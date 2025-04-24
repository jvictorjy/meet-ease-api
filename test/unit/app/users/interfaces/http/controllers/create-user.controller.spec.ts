import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserRequestDto } from '@app/users/interfaces/http/dtos/create-user.dto';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { ZodValidationPipe } from '@app/@common/application/pipes/zod-validation.pipe';
import { UUIDSchemaValidation } from '@app/@common/application/validations';
import { CreateUserUseCase } from '@app/users/application/use-cases/create-user.use-case';
import { CreateUserController } from '@app/users/interfaces/http/controllers/create-user.controller';

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

  it('returns created user data when use case executes successfully', async () => {
    const body: CreateUserRequestDto = {
      name: 'Alice Doe',
      email: 'alice.doe@example.com',
      phone: '1234567890',
      password: 'password123',
      confirm_password: 'password123',
      profile_id: 'valid-profile-id',
    };

    jest.spyOn(createUserUseCase, 'execute').mockResolvedValue({
      id: 'user-id',
      ...body,
    });

    const result = await controller.handle(body);

    expect(result).toEqual(
      expect.objectContaining({
        id: 'user-id',
        name: 'Alice Doe',
        email: 'alice.doe@example.com',
        phone: '1234567890',
        profile_id: 'valid-profile-id',
      }),
    );
  });

  it('throws an error when Zod validation fails', async () => {
    const invalidId = 'invalid-uuid';
    const validationPipe = new ZodValidationPipe(new UUIDSchemaValidation());

    await expect(
      validationPipe.transform(invalidId, { type: 'param' }),
    ).rejects.toThrow(
      Exception.new({
        code: Code.BAD_REQUEST.code,
        overrideMessage: `UUID is invalid`,
      }),
    );
  });

  it('throws an error when use case throws a domain exception', async () => {
    const body: CreateUserRequestDto = {
      name: 'Bob Doe',
      email: 'bob.doe@example.com',
      phone: '1234567890',
      password: 'password123',
      confirm_password: 'password123',
      profile_id: 'valid-profile-id',
    };

    jest.spyOn(createUserUseCase, 'execute').mockRejectedValue(
      Exception.new({
        code: Code.NOT_FOUND.code,
        overrideMessage: 'Invalid profile ID',
      }),
    );

    await expect(controller.handle(body)).rejects.toThrow('Invalid profile ID');
  });
});
