import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserController } from '@app/users/interfaces/http/controllers/create-user.controller';
import { CreateUserUseCase } from '@app/users/application/use-cases/create-user.use-case';
import { CreateUserRequestDto } from '@app/users/interfaces/http/dtos/create-user.dto';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { ZodValidationPipe } from '@app/@common/application/pipes/zod-validation.pipe';
import { CreateUserSchemaValidator } from '@app/users/application/validators/create-user-schema.validator';

describe('CreateUserController', () => {
  let controller: CreateUserController;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateUserController],
      providers: [
        {
          provide: CreateUserUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CreateUserController>(CreateUserController);
    createUserUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user when use case executes successfully', async () => {
    const body: CreateUserRequestDto = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      password: 'Password123',
      confirm_password: 'Password123',
      profile_id: '123e4567-e89b-12d3-a456-426614174001',
    };

    const expectedResult = {
      id: '123e4567-e89b-12d3-a456-426614174002',
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      profile: {
        id: '123e4567-e89b-12d3-a456-426614174001',
        name: 'Test Profile',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(createUserUseCase, 'execute').mockResolvedValue(expectedResult);

    const result = await controller.handle(body);

    expect(result).toEqual(expectedResult);
    expect(createUserUseCase.execute).toHaveBeenCalledWith(body);
  });

  it('should throw an error when use case throws a domain exception', async () => {
    const body: CreateUserRequestDto = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      password: 'Password123',
      confirm_password: 'Password123',
      profile_id: '123e4567-e89b-12d3-a456-426614174001',
    };

    jest.spyOn(createUserUseCase, 'execute').mockRejectedValue(
      Exception.new({
        code: Code.NOT_FOUND.code,
        overrideMessage: 'Profile not found',
      }),
    );

    await expect(controller.handle(body)).rejects.toThrow('Profile not found');
  });

  it('should throw an error when validation fails', async () => {
    const invalidData = {
      name: 'Test User',
      email: 'invalid-email',
      phone: '1234567890',
      password: 'Password123',
      confirm_password: 'DifferentPassword',
      profile_id: '123e4567-e89b-12d3-a456-426614174001',
    };

    const validationPipe = new ZodValidationPipe(
      new CreateUserSchemaValidator(),
    );

    await expect(validationPipe.transform(invalidData)).rejects.toThrow();
  });

  it('should throw an error when required fields are missing', async () => {
    const incompleteData = {
      name: 'Test User',
      // Missing email
      phone: '1234567890',
      // Missing password
      // Missing confirm_password
      profile_id: '123e4567-e89b-12d3-a456-426614174001',
    };

    const validationPipe = new ZodValidationPipe(
      new CreateUserSchemaValidator(),
    );

    await expect(validationPipe.transform(incompleteData)).rejects.toThrow();
  });
});
