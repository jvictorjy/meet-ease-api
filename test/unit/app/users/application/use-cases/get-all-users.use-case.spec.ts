import { GetAllUsersUseCase } from '@app/users/application/use-cases/get-all-users.use-case';
import { UserRepository } from '@app/users/domain/repositories/user.repository';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';

describe('GetAllUsersUseCase', () => {
  let getAllUsersUseCase: GetAllUsersUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = {
      findAll: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
  });

  it('should return a list of users when userRepository.findAll resolves', async () => {
    const users = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
        created_at: new Date('2023-01-01'),
        updated_at: new Date('2023-01-02'),
      },
    ];
    userRepository.findAll.mockResolvedValue(users);

    const result = await getAllUsersUseCase.execute();

    expect(result).toEqual([
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
        created_at: new Date('2023-01-01'),
        updated_at: new Date('2023-01-02'),
      },
    ]);
    expect(userRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should throw the same exception if userRepository.findAll throws a known Exception', async () => {
    const mockException = Exception.new({
      code: Code.NOT_FOUND.code,
      overrideMessage: 'No users found',
    });
    userRepository.findAll.mockRejectedValue(mockException);

    await expect(getAllUsersUseCase.execute()).rejects.toThrow(mockException);
    expect(userRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should throw a generic exception if userRepository.findAll throws an unknown error', async () => {
    userRepository.findAll.mockRejectedValue(new Error('Unexpected error'));

    await expect(getAllUsersUseCase.execute()).rejects.toThrow(
      expect.objectContaining({
        code: Code.INTERNAL_SERVER_ERROR.code,
        message: 'An unexpected error occurred',
      }),
    );
    expect(userRepository.findAll).toHaveBeenCalledTimes(1);
  });
});
