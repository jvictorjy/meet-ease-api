import { Test, TestingModule } from '@nestjs/testing';
import { GetAllUsersController } from '@app/users/interfaces/http/controllers/get-all-users.controller';
import { GetAllUsersUseCase } from '@app/users/application/use-cases/get-all-users.use-case';
import { UserModel } from '@app/users/domain/models/user.model';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';

describe('GetAllUsersController', () => {
  let controller: GetAllUsersController;
  let getAllUsersUseCase: GetAllUsersUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetAllUsersController],
      providers: [
        {
          provide: GetAllUsersUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GetAllUsersController>(GetAllUsersController);
    getAllUsersUseCase = module.get<GetAllUsersUseCase>(GetAllUsersUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all users when use case executes successfully', async () => {
    // Create sample user models
    const user1 = new UserModel();
    user1.id = '123e4567-e89b-12d3-a456-426614174001';
    user1.name = 'User 1';
    user1.email = 'user1@example.com';
    user1.phone = '1234567890';
    user1.profile = { id: 'profile-id-1', name: 'Profile 1' };
    user1.createdAt = new Date();
    user1.updatedAt = new Date();

    const user2 = new UserModel();
    user2.id = '123e4567-e89b-12d3-a456-426614174002';
    user2.name = 'User 2';
    user2.email = 'user2@example.com';
    user2.phone = '0987654321';
    user2.profile = { id: 'profile-id-2', name: 'Profile 2' };
    user2.createdAt = new Date();
    user2.updatedAt = new Date();

    const expectedUsers = [user1, user2];

    jest.spyOn(getAllUsersUseCase, 'execute').mockResolvedValue(expectedUsers);

    const result = await controller.handle();

    expect(result).toEqual(expectedUsers);
    expect(getAllUsersUseCase.execute).toHaveBeenCalled();
  });

  it('should return an empty array when no users exist', async () => {
    const expectedUsers: UserModel[] = [];

    jest.spyOn(getAllUsersUseCase, 'execute').mockResolvedValue(expectedUsers);

    const result = await controller.handle();

    expect(result).toEqual(expectedUsers);
    expect(getAllUsersUseCase.execute).toHaveBeenCalled();
  });

  it('should throw an error when use case throws a domain exception', async () => {
    jest.spyOn(getAllUsersUseCase, 'execute').mockRejectedValue(
      Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: 'Error retrieving users',
      }),
    );

    await expect(controller.handle()).rejects.toThrow('Error retrieving users');
  });
});
