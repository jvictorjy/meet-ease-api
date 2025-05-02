import { Test, TestingModule } from '@nestjs/testing';
import { GetUserByIdController } from '@app/users/interfaces/http/controllers/get-user-by-id.controller';
import { GetUserByIdUseCase } from '@app/users/application/use-cases/get-user-by-id.use-case';
import { UserModel } from '@app/users/domain/models/user.model';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { ZodValidationPipe } from '@app/@common/application/pipes/zod-validation.pipe';
import { UUIDSchemaValidation } from '@app/@common/application/validations';

describe('GetUserByIdController', () => {
  let controller: GetUserByIdController;
  let getUserByIdUseCase: GetUserByIdUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetUserByIdController],
      providers: [
        {
          provide: GetUserByIdUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GetUserByIdController>(GetUserByIdController);
    getUserByIdUseCase = module.get<GetUserByIdUseCase>(GetUserByIdUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a user when use case executes successfully', async () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';

    // Create a sample user model
    const expectedUser = new UserModel();
    expectedUser.id = userId;
    expectedUser.name = 'Test User';
    expectedUser.email = 'test@example.com';
    expectedUser.phone = '1234567890';
    expectedUser.profile = { id: 'profile-id', name: 'Test Profile' };
    expectedUser.createdAt = new Date();
    expectedUser.updatedAt = new Date();

    jest.spyOn(getUserByIdUseCase, 'execute').mockResolvedValue(expectedUser);

    const result = await controller.handle(userId);

    expect(result).toEqual(expectedUser);
    expect(getUserByIdUseCase.execute).toHaveBeenCalledWith(userId);
  });

  it('should throw an error when user is not found', async () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';

    jest.spyOn(getUserByIdUseCase, 'execute').mockRejectedValue(
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

  it('should throw an error when use case throws a domain exception', async () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';

    jest.spyOn(getUserByIdUseCase, 'execute').mockRejectedValue(
      Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: 'Error retrieving user',
      }),
    );

    await expect(controller.handle(userId)).rejects.toThrow(
      'Error retrieving user',
    );
  });
});
