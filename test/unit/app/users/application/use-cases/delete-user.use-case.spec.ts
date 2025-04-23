import { DeleteUserUseCase } from '@app/users/application/use-cases/delete-user.use-case';
import { UserRepository } from '@app/users/domain/repositories/user.repository';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { User } from '@app/users/domain/entities/user.entity';

describe('DeleteUserUseCase', () => {
  let deleteUserUseCase: DeleteUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    deleteUserUseCase = new DeleteUserUseCase(userRepository);
  });

  it('should delete a user when they exist', async () => {
    userRepository.findById.mockResolvedValue(
      new User(
        '123',
        'John Doe',
        'john.doe@example.com',
        '123-456-7890',
        'hashedpassword123',
        'profile123',
        new Date('2021-01-01'),
        new Date('2021-01-02'),
      ),
    );
    userRepository.delete.mockResolvedValue();

    await expect(deleteUserUseCase.execute('123')).resolves.toBeUndefined();

    expect(userRepository.findById).toHaveBeenCalledWith('123');
    expect(userRepository.delete).toHaveBeenCalledWith('123');
  });

  it('should throw an exception if the user does not exist', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(deleteUserUseCase.execute('123')).rejects.toThrowError(
      Exception.new({
        code: Code.NOT_FOUND.code,
        overrideMessage: 'User not found',
      }),
    );

    expect(userRepository.findById).toHaveBeenCalledWith('123');
    expect(userRepository.delete).not.toHaveBeenCalled();
  });

  it('should rethrow an exception if it is an instance of Exception', async () => {
    const exception = Exception.new({
      code: Code.INTERNAL_SERVER_ERROR.code,
      overrideMessage: 'Database error',
    });
    userRepository.findById.mockRejectedValue(exception);

    await expect(deleteUserUseCase.execute('123')).rejects.toThrow(exception);

    expect(userRepository.findById).toHaveBeenCalledWith('123');
    expect(userRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw a generic exception for unexpected errors', async () => {
    userRepository.findById.mockRejectedValue(new Error('Unexpected error'));

    await expect(deleteUserUseCase.execute('123')).rejects.toThrowError(
      Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: 'An unexpected error occurred',
      }),
    );

    expect(userRepository.findById).toHaveBeenCalledWith('123');
    expect(userRepository.delete).not.toHaveBeenCalled();
  });
});
