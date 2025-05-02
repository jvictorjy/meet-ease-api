import { Test, TestingModule } from '@nestjs/testing';
import { DeleteUserController } from '@app/users/interfaces/http/controllers/delete-user.controller';
import { DeleteUserUseCase } from '@app/users/application/use-cases/delete-user.use-case';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { ZodValidationPipe } from '@app/@common/application/pipes/zod-validation.pipe';
import { UUIDSchemaValidation } from '@app/@common/application/validations';

describe('DeleteUserController', () => {
  let controller: DeleteUserController;
  let deleteUserUseCase: DeleteUserUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeleteUserController],
      providers: [
        {
          provide: DeleteUserUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DeleteUserController>(DeleteUserController);
    deleteUserUseCase = module.get<DeleteUserUseCase>(DeleteUserUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delete a user when use case executes successfully', async () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';

    jest.spyOn(deleteUserUseCase, 'execute').mockResolvedValue(undefined);

    await controller.handle(userId);

    expect(deleteUserUseCase.execute).toHaveBeenCalledWith(userId);
  });

  it('should throw an error when use case throws a domain exception', async () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';

    jest.spyOn(deleteUserUseCase, 'execute').mockRejectedValue(
      Exception.new({
        code: Code.NOT_FOUND.code,
        overrideMessage: 'User not found',
      }),
    );

    await expect(controller.handle(userId)).rejects.toThrow('User not found');
  });

  it('should throw an error when validation fails with invalid UUID', async () => {
    const invalidUserId = 'invalid-uuid';

    const validationPipe = new ZodValidationPipe(new UUIDSchemaValidation());

    await expect(validationPipe.transform(invalidUserId)).rejects.toThrow();
  });

  it('should throw an error when validation fails with empty string', async () => {
    const emptyUserId = '';

    const validationPipe = new ZodValidationPipe(new UUIDSchemaValidation());

    await expect(validationPipe.transform(emptyUserId)).rejects.toThrow();
  });
});
