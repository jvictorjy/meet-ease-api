import { Test, TestingModule } from '@nestjs/testing';
import { GetAllUsersController } from '@app/users/interfaces/http/controllers/get-all-users.controller';
import { GetAllUsersUseCase } from '@app/users/application/use-cases/get-all-users.use-case';
import { GetUserResponseDto } from '@app/users/interfaces/http/dtos/get-user.dto';

describe('GetAllUsersController - handle method', () => {
  let getAllUsersController: GetAllUsersController;
  let getAllUsersUseCase: GetAllUsersUseCase;

  const mockUsers: GetUserResponseDto[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '1234567890',
      created_at: new Date('2022-01-01'),
      updated_at: new Date('2022-01-02'),
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'janesmith@example.com',
      phone: '0987654321',
      created_at: new Date('2022-02-01'),
      updated_at: new Date('2022-02-02'),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetAllUsersController],
      providers: [
        {
          provide: GetAllUsersUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockUsers),
          },
        },
      ],
    }).compile();

    getAllUsersController = module.get<GetAllUsersController>(
      GetAllUsersController,
    );
    getAllUsersUseCase = module.get<GetAllUsersUseCase>(GetAllUsersUseCase);
  });

  it('should return a list of users', async () => {
    const result = await getAllUsersController.handle();
    expect(result).toEqual(mockUsers);
    expect(getAllUsersUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it('should call execute method of GetAllUsersUseCase', async () => {
    await getAllUsersController.handle();
    expect(getAllUsersUseCase.execute).toHaveBeenCalled();
  });
});
