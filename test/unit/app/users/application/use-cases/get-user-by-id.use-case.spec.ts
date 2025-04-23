import { GetUserByIdUseCase } from '@app/users/application/use-cases/get-user-by-id.use-case';
import { UserRepository } from '@app/users/domain/repositories/user.repository';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';

describe('GetUserByIdUseCase', () => {
  let getUserByIdUseCase: GetUserByIdUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
  });

  it('should return the user when user exists', async () => {
    const mockUser = {
      id: '123',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '123-456-7890',
      created_at: new Date('2021-01-01'),
      updated_at: new Date('2021-01-02'),
    };
    userRepository.findById.mockResolvedValue(mockUser);

    const result = await getUserByIdUseCase.execute('123');

    expect(result).toEqual({
      id: '123',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '123-456-7890',
      created_at: new Date('2021-01-01'),
      updated_at: new Date('2021-01-02'),
    });
    expect(userRepository.findById).toHaveBeenCalledWith('123');
  });

  it('should throw NOT_FOUND exception when user does not exist', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(getUserByIdUseCase.execute('123')).rejects.toThrowError(
      Exception.new({
        code: Code.NOT_FOUND.code,
        overrideMessage: 'User not found',
      }),
    );
    expect(userRepository.findById).toHaveBeenCalledWith('123');
  });

  it('should throw INTERNAL_SERVER_ERROR exception on unexpected error', async () => {
    userRepository.findById.mockRejectedValue(new Error('Database error'));

    await expect(getUserByIdUseCase.execute('123')).rejects.toThrowError(
      Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: 'An unexpected error occurred',
      }),
    );
    expect(userRepository.findById).toHaveBeenCalledWith('123');
  });
});
