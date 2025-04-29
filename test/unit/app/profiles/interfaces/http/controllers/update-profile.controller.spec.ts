import { UpdateProfileUseCase } from '@app/profiles/application/use-cases/update-profile.use-case';
import { ZodValidationPipe } from '@app/@common/application/pipes/zod-validation.pipe';
import { UUIDSchemaValidation } from '@app/@common/application/validations';
import { UpdateProfileSchemaValidator } from '@app/profiles/application/validators/update-profile-schema.validator';

import { Test, TestingModule } from '@nestjs/testing';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { UpdateProfileController } from '@app/profiles/interfaces/http/controllers/update-profile.controller';
import { UpdateProfileResponseDto } from '@app/profiles/application/dtos/update-profile-request.dto';

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

  it('returns HTTP 200 and updated profile when update is successful', async () => {
    const mockResponse = new UpdateProfileResponseDto();
    mockResponse.id = '1';
    mockResponse.description = 'Updated description';
    jest.spyOn(updateProfileUseCase, 'execute').mockResolvedValue(mockResponse);

    const result = await controller.handle('1', {
      description: 'Updated description',
    });

    expect(updateProfileUseCase.execute).toHaveBeenCalledWith(
      '1',
      'Updated description',
    );
    expect(result).toEqual(mockResponse);
  });

  it('returns HTTP 400 when id validation fails', async () => {
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

  it('returns HTTP 404 when profile is not found', async () => {
    jest.spyOn(updateProfileUseCase, 'execute').mockRejectedValue(
      Exception.new({
        code: Code.NOT_FOUND.code,
        overrideMessage: 'Profile not found',
      }),
    );

    await expect(
      controller.handle('1', { description: 'Updated description' }),
    ).rejects.toThrow(
      Exception.new({
        code: Code.NOT_FOUND.code,
        overrideMessage: 'Profile not found',
      }),
    );
    expect(updateProfileUseCase.execute).toHaveBeenCalledWith(
      '1',
      'Updated description',
    );
  });

  it('returns HTTP 200 and allows description to be updated to null', async () => {
    const mockResponse = new UpdateProfileResponseDto();
    mockResponse.id = '1';
    mockResponse.description = null;
    jest.spyOn(updateProfileUseCase, 'execute').mockResolvedValue(mockResponse);

    const result = await controller.handle('1', { description: null });

    expect(updateProfileUseCase.execute).toHaveBeenCalledWith('1', null);
    expect(result).toEqual(mockResponse);
  });

  it('returns HTTP 400 when description validation fails', async () => {
    const invalidBody = { description: 123 };
    const validationPipe = new ZodValidationPipe(
      new UpdateProfileSchemaValidator(),
    );

    await expect(validationPipe.transform(invalidBody)).rejects.toThrow(
      Exception.new({
        code: Code.BAD_REQUEST.code,
        overrideMessage: `Description must be a string`,
      }),
    );
  });
});
