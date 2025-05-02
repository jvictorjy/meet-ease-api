import { UpdateUserUseCase } from '@app/users/application/use-cases/update-user.use-case';
import { UserRepository } from '@app/users/domain/repositories/user.repository';
import { User } from '@app/users/domain/entities/user.entity';
import { UpdateUserRequestDto } from '@app/users/interfaces/http/dtos/update-user.dto';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';

describe('UpdateUserUseCase', () => {
  let updateUserUseCase: UpdateUserUseCase;
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

    updateUserUseCase = new UpdateUserUseCase(userRepositoryMock);
  });

  it('should update a user successfully', async () => {
    // Arrange
    const userId = 'user-id';
    const mockUser = new User(
      userId,
      'Original Name',
      'original@example.com',
      '1234567890',
      'hashed-password',
      'profile-id',
      new Date(),
      new Date(),
    );

    const updateUserDto: UpdateUserRequestDto = {
      name: 'Updated Name',
      phone: '0987654321',
    };

    userRepositoryMock.findById.mockResolvedValue(mockUser);
    userRepositoryMock.update.mockResolvedValue(undefined);

    // Act
    await updateUserUseCase.execute(userId, updateUserDto);

    // Assert
    expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId);
    expect(userRepositoryMock.update).toHaveBeenCalledWith({
      id: userId,
      name: 'Updated Name',
      phone: '0987654321',
    });
  });

  it('should throw an exception when user is not found', async () => {
    // Arrange
    const userId = 'non-existent-user-id';
    const updateUserDto: UpdateUserRequestDto = {
      name: 'Updated Name',
    };

    userRepositoryMock.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(
      updateUserUseCase.execute(userId, updateUserDto),
    ).rejects.toThrow(
      expect.objectContaining({
        message: 'User not found',
      }),
    );
    expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId);
    expect(userRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should handle unexpected errors during findById', async () => {
    // Arrange
    const userId = 'user-id';
    const updateUserDto: UpdateUserRequestDto = {
      name: 'Updated Name',
    };

    userRepositoryMock.findById.mockRejectedValue(new Error('Database error'));

    // Act & Assert
    await expect(
      updateUserUseCase.execute(userId, updateUserDto),
    ).rejects.toThrow(
      expect.objectContaining({
        message: 'An unexpected error occurred',
      }),
    );
    expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId);
    expect(userRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should handle unexpected errors during update', async () => {
    // Arrange
    const userId = 'user-id';
    const mockUser = new User(
      userId,
      'Original Name',
      'original@example.com',
      '1234567890',
      'hashed-password',
      'profile-id',
      new Date(),
      new Date(),
    );

    const updateUserDto: UpdateUserRequestDto = {
      name: 'Updated Name',
    };

    userRepositoryMock.findById.mockResolvedValue(mockUser);
    userRepositoryMock.update.mockRejectedValue(new Error('Database error'));

    // Act & Assert
    await expect(
      updateUserUseCase.execute(userId, updateUserDto),
    ).rejects.toThrow(
      expect.objectContaining({
        message: 'An unexpected error occurred',
      }),
    );
    expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId);
    expect(userRepositoryMock.update).toHaveBeenCalled();
  });

  it('should propagate Exception errors', async () => {
    // Arrange
    const userId = 'user-id';
    const updateUserDto: UpdateUserRequestDto = {
      name: 'Updated Name',
    };

    const customException = Exception.new({
      code: Code.NOT_FOUND.code,
      overrideMessage: 'Custom error message',
    });
    userRepositoryMock.findById.mockRejectedValue(customException);

    // Act & Assert
    await expect(
      updateUserUseCase.execute(userId, updateUserDto),
    ).rejects.toThrow(customException);
    expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId);
    expect(userRepositoryMock.update).not.toHaveBeenCalled();
  });
});
