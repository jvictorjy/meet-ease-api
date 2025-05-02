import { GetAllUsersUseCase } from '@app/users/application/use-cases/get-all-users.use-case';
import { UserRepository } from '@app/users/domain/repositories/user.repository';
import { User } from '@app/users/domain/entities/user.entity';
import { Exception } from '@core/@shared/domain/exception/Exception';

describe('GetAllUsersUseCase', () => {
  let getAllUsersUseCase: GetAllUsersUseCase;
  let userRepositoryMock: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepositoryMock = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<UserRepository>;

    getAllUsersUseCase = new GetAllUsersUseCase(userRepositoryMock);
  });

  it('should return all users successfully', async () => {
    // Arrange
    const mockUsers = [
      new User(
        'user-id-1',
        'Test User 1',
        'test1@example.com',
        '1234567890',
        'hashed-password-1',
        'profile-id-1',
        new Date(),
        new Date(),
      ),
      new User(
        'user-id-2',
        'Test User 2',
        'test2@example.com',
        '0987654321',
        'hashed-password-2',
        'profile-id-2',
        new Date(),
        new Date(),
      ),
    ];

    userRepositoryMock.findAll.mockResolvedValue(mockUsers);

    // Act
    const result = await getAllUsersUseCase.execute();

    // Assert
    expect(userRepositoryMock.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockUsers);
    expect(result.length).toBe(2);
    expect(result[0]).toBeInstanceOf(User);
    expect(result[1]).toBeInstanceOf(User);
  });

  it('should return an empty array when no users exist', async () => {
    // Arrange
    userRepositoryMock.findAll.mockResolvedValue([]);

    // Act
    const result = await getAllUsersUseCase.execute();

    // Assert
    expect(userRepositoryMock.findAll).toHaveBeenCalled();
    expect(result).toEqual([]);
    expect(result.length).toBe(0);
  });

  it('should handle unexpected errors', async () => {
    // Arrange
    userRepositoryMock.findAll.mockRejectedValue(new Error('Database error'));

    // Act & Assert
    await expect(getAllUsersUseCase.execute()).rejects.toThrow(
      expect.objectContaining({
        message: 'An unexpected error occurred',
      }),
    );
    expect(userRepositoryMock.findAll).toHaveBeenCalled();
  });

  it('should propagate Exception errors', async () => {
    // Arrange
    const customException = Exception.new({
      code: 'CUSTOM_ERROR',
      overrideMessage: 'Custom error message',
    });
    userRepositoryMock.findAll.mockRejectedValue(customException);

    // Act & Assert
    await expect(getAllUsersUseCase.execute()).rejects.toThrow(customException);
    expect(userRepositoryMock.findAll).toHaveBeenCalled();
  });
});
