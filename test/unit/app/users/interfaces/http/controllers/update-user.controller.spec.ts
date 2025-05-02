import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserController } from '@app/users/interfaces/http/controllers/update-user.controller';
import { UpdateUserUseCase } from '@app/users/application/use-cases/update-user.use-case';
import {
  UpdateUserRequestDto,
  UpdateUserResponseDto,
} from '@app/users/interfaces/http/dtos/update-user.dto';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { ZodValidationPipe } from '@app/@common/application/pipes/zod-validation.pipe';
import { UUIDSchemaValidation } from '@app/@common/application/validations';
import { UpdateUserSchemaValidator } from '@app/users/application/validators/update-user-schema.validator';

describe('UpdateUserController', () => {
  let controller: UpdateUserController;
  let updateUserUseCase: UpdateUserUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateUserController],
      providers: [
        {
          provide: UpdateUserUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UpdateUserController>(UpdateUserController);
    updateUserUseCase = module.get<UpdateUserUseCase>(UpdateUserUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should update a user when use case executes successfully', async () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';
    const updateData: UpdateUserRequestDto = {
      name: 'Updated Name',
      email: 'updated@example.com',
      phone: '9876543210',
    };

    const expectedResult: UpdateUserResponseDto = {
      id: userId,
      name: 'Updated Name',
      email: 'updated@example.com',
      phone: '9876543210',
      created_at: new Date(),
      updated_at: new Date(),
    };

    jest.spyOn(updateUserUseCase, 'execute').mockResolvedValue(expectedResult);

    const result = await controller.handle(userId, updateData);

    expect(result).toEqual(expectedResult);
    expect(updateUserUseCase.execute).toHaveBeenCalledWith(userId, updateData);
  });

  it('should update a user with partial data', async () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';
    const updateData: UpdateUserRequestDto = {
      name: 'Updated Name',
      // Only updating name, leaving email and phone unchanged
    };

    const expectedResult: UpdateUserResponseDto = {
      id: userId,
      name: 'Updated Name',
      email: 'existing@example.com', // Existing email remains unchanged
      phone: '1234567890', // Existing phone remains unchanged
      created_at: new Date(),
      updated_at: new Date(),
    };

    jest.spyOn(updateUserUseCase, 'execute').mockResolvedValue(expectedResult);

    const result = await controller.handle(userId, updateData);

    expect(result).toEqual(expectedResult);
    expect(updateUserUseCase.execute).toHaveBeenCalledWith(userId, updateData);
  });

  it('should throw an error when user is not found', async () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';
    const updateData: UpdateUserRequestDto = {
      name: 'Updated Name',
    };

    jest.spyOn(updateUserUseCase, 'execute').mockRejectedValue(
      Exception.new({
        code: Code.NOT_FOUND.code,
        overrideMessage: 'User not found',
      }),
    );

    await expect(controller.handle(userId, updateData)).rejects.toThrow(
      'User not found',
    );
  });

  it('should throw an error when validation fails with invalid UUID', async () => {
    const invalidUserId = 'invalid-uuid';
    const updateData: UpdateUserRequestDto = {
      name: 'Updated Name',
    };

    const validationPipe = new ZodValidationPipe(new UUIDSchemaValidation());

    await expect(validationPipe.transform(invalidUserId)).rejects.toThrow();
  });

  it('should throw an error when validation fails with invalid email', async () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';
    const invalidUpdateData = {
      email: 'invalid-email', // Invalid email format
    };

    const validationPipe = new ZodValidationPipe(
      new UpdateUserSchemaValidator(),
    );

    await expect(validationPipe.transform(invalidUpdateData)).rejects.toThrow();
  });

  it('should throw an error when use case throws a domain exception', async () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';
    const updateData: UpdateUserRequestDto = {
      name: 'Updated Name',
    };

    jest.spyOn(updateUserUseCase, 'execute').mockRejectedValue(
      Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: 'Error updating user',
      }),
    );

    await expect(controller.handle(userId, updateData)).rejects.toThrow(
      'Error updating user',
    );
  });
});
