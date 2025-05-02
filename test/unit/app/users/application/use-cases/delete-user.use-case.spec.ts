import { DeleteUserUseCase } from '@app/users/application/use-cases/delete-user.use-case';
import { UserRepository } from '@app/users/domain/repositories/user.repository';
import { User } from '@app/users/domain/entities/user.entity';

describe('DeleteUserUseCase', () => {
  let deleteUserUseCase: DeleteUserUseCase;
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

    deleteUserUseCase = new DeleteUserUseCase(userRepositoryMock);
  });

  it('should delete a user successfully', async () => {
    // Arrange
    const userId = 'user-id';
    const mockUser = new User(
      userId,
      'Test User',
      'test@example.com',
      '1234567890',
      'hashed-password',
      'profile-id',
      new Date(),
      new Date(),
    );

    userRepositoryMock.findById.mockResolvedValue(mockUser);
    userRepositoryMock.delete.mockResolvedValue(undefined);

    // Act
    await deleteUserUseCase.execute(userId);

    // Assert
    expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId);
    expect(userRepositoryMock.delete).toHaveBeenCalledWith(userId);
  });

  it('should throw an exception when user is not found', async () => {
    // Arrange
    const userId = 'non-existent-user-id';
    userRepositoryMock.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(deleteUserUseCase.execute(userId)).rejects.toThrow(
      expect.objectContaining({
        message: 'User not found',
      }),
    );
    expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId);
    expect(userRepositoryMock.delete).not.toHaveBeenCalled();
  });

  it('should handle unexpected errors during findById', async () => {
    // Arrange
    const userId = 'user-id';
    userRepositoryMock.findById.mockRejectedValue(new Error('Database error'));

    // Act & Assert
    await expect(deleteUserUseCase.execute(userId)).rejects.toThrow(
      expect.objectContaining({
        message: 'An unexpected error occurred',
      }),
    );
    expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId);
    expect(userRepositoryMock.delete).not.toHaveBeenCalled();
  });

  it('should handle unexpected errors during delete', async () => {
    // Arrange
    const userId = 'user-id';
    const mockUser = new User(
      userId,
      'Test User',
      'test@example.com',
      '1234567890',
      'hashed-password',
      'profile-id',
      new Date(),
      new Date(),
    );

    userRepositoryMock.findById.mockResolvedValue(mockUser);
    userRepositoryMock.delete.mockRejectedValue(new Error('Database error'));

    // Act & Assert
    await expect(deleteUserUseCase.execute(userId)).rejects.toThrow(
      expect.objectContaining({
        message: 'An unexpected error occurred',
      }),
    );
    expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId);
    expect(userRepositoryMock.delete).toHaveBeenCalledWith(userId);
  });
});
