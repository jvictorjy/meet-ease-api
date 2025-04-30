import { Test, TestingModule } from '@nestjs/testing';
import { CreateProfileController } from '@app/profiles/interfaces/http/controllers/create-profile.controller';
import { CreateProfileUseCase } from '@app/profiles/application/use-cases/create-profiele.use-case';
import { CreateProfileDto } from '@app/profiles/interfaces/http/dtos/create-profile.dto';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { ZodValidationPipe } from '@app/@common/application/pipes/zod-validation.pipe';
import { CreateProfileSchemaValidator } from '@app/profiles/application/validators/create-profile-schema.validator';
import { RoleName } from '@app/auth/infrastructure/roles/roles.enum';

describe('CreateProfileController', () => {
  let controller: CreateProfileController;
  let createProfileUseCase: CreateProfileUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateProfileController],
      providers: [
        {
          provide: CreateProfileUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CreateProfileController>(CreateProfileController);
    createProfileUseCase =
      module.get<CreateProfileUseCase>(CreateProfileUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a profile when use case executes successfully', async () => {
    const body: CreateProfileDto = {
      name: 'Test Profile',
      description: 'This is a test profile',
      role: RoleName.ADMIN,
    };

    const expectedResult = {
      id: '123e4567-e89b-12d3-a456-426614174001',
      name: 'Test Profile',
      description: 'This is a test profile',
      role: RoleName.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest
      .spyOn(createProfileUseCase, 'execute')
      .mockResolvedValue(expectedResult);

    const result = await controller.handle(body);

    expect(result).toEqual(expectedResult);
    expect(createProfileUseCase.execute).toHaveBeenCalledWith(body);
  });

  it('should throw an error when use case throws a domain exception', async () => {
    const body: CreateProfileDto = {
      name: 'Test Profile',
      description: 'This is a test profile',
      role: RoleName.ADMIN,
    };

    jest.spyOn(createProfileUseCase, 'execute').mockRejectedValue(
      Exception.new({
        code: Code.NOT_FOUND.code,
        overrideMessage: 'Profile not found',
      }),
    );

    await expect(controller.handle(body)).rejects.toThrow('Profile not found');
  });

  it('should throw an error when validation fails', async () => {
    const invalidData = {
      name: '',
      description: 'This is a test profile',
    };

    const validationPipe = new ZodValidationPipe(
      new CreateProfileSchemaValidator(),
    );

    await expect(validationPipe.transform(invalidData)).rejects.toThrow();
  });
});
