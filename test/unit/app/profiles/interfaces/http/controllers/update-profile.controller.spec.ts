import { Test, TestingModule } from '@nestjs/testing';
import { UpdateProfileController } from '@app/profiles/interfaces/http/controllers/update-profile.controller';
import { UpdateProfileUseCase } from '@app/profiles/application/use-cases/update-profile.use-case';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { ZodValidationPipe } from '@app/@common/application/pipes/zod-validation.pipe';
import { UpdateProfileSchemaValidator } from '@app/profiles/application/validators/update-profile-schema.validator';
import { RoleName } from '@app/auth/infrastructure/roles/roles.enum';
import { UpdateProfileRequestDto } from '@app/profiles/interfaces/http/dtos/update-profile-request.dto';

describe('UpdateProfileController', () => {
  let controller: UpdateProfileController;
  let updateProfileUseCase: UpdateProfileUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateProfileController],
      providers: [
        {
          provide: UpdateProfileUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UpdateProfileController>(UpdateProfileController);
    updateProfileUseCase =
      module.get<UpdateProfileUseCase>(UpdateProfileUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should update a profile when use case executes successfully', async () => {
    const profileId = '123e4567-e89b-12d3-a456-426614174001';
    const body: UpdateProfileRequestDto = {
      name: 'Updated Profile',
      description: 'This is an updated profile',
      role: RoleName.ADMIN,
    };

    const expectedResult = {
      id: profileId,
      name: 'Updated Profile',
      description: 'This is an updated profile',
      role: RoleName.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest
      .spyOn(updateProfileUseCase, 'execute')
      .mockResolvedValue(expectedResult);

    const result = await controller.handle(profileId, body);

    expect(result).toEqual(expectedResult);
  });

  it('should throw an error when use case throws a domain exception', async () => {
    const profileId = '123e4567-e89b-12d3-a456-426614174001';
    const body: UpdateProfileRequestDto = {
      name: 'Updated Profile',
      description: 'This is an updated profile',
      role: RoleName.ADMIN,
    };

    jest.spyOn(updateProfileUseCase, 'execute').mockRejectedValue(
      Exception.new({
        code: Code.NOT_FOUND.code,
        overrideMessage: 'Profile not found',
      }),
    );

    await expect(controller.handle(profileId, body)).rejects.toThrow(
      'Profile not found',
    );
  });

  it('should throw an error when validation fails', async () => {
    const invalidData = {
      name: '',
      description: 'This is an updated profile',
    };

    const validationPipe = new ZodValidationPipe(
      new UpdateProfileSchemaValidator(),
    );

    await expect(validationPipe.transform(invalidData)).rejects.toThrow();
  });
});
