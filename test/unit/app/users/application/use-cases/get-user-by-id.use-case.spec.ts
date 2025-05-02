import { GetUserByIdUseCase } from '@app/users/application/use-cases/get-user-by-id.use-case';
import { UserRepository } from '@app/users/domain/repositories/user.repository';
import { User } from '@app/users/domain/entities/user.entity';
import { Exception } from '@core/@shared/domain/exception/Exception';

describe('GetUserByIdUseCase', () => {
  let getUserByIdUseCase: GetUserByIdUseCase;
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

    getUserByIdUseCase = new GetUserByIdUseCase(userRepositoryMock);
  });

  it('should return a user by id successfully', async () => {
    // Arrange
    const userId = 'user-id';
    const createdAt = new Date();
    const updatedAt = new Date();

    const mockUser = new User(
      userId,
      'Test User',
      'test@example.com',
      '1234567890',
      'hashed-password',
      'profile-id',
      createdAt,
      updatedAt,
    );

    mockUser.profile = { id: 'profile-id', name: 'Test Profile' };

    userRepositoryMock.findById.mockResolvedValue(mockUser);

    // Act
    const result = await getUserByIdUseCase.execute(userId);

    // Assert
    expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId);
    expect(result).toEqual({
      id: userId,
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      profile: { id: 'profile-id', name: 'Test Profile' },
      createdAt,
      updatedAt,
    });
  });

  it('should throw an exception when user is not found', async () => {
    // Arrange
    const userId = 'non-existent-user-id';
    userRepositoryMock.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(getUserByIdUseCase.execute(userId)).rejects.toThrow(
      expect.objectContaining({
        message: 'User not found',
      }),
    );
    expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId);
  });

  it('should handle unexpected errors', async () => {
    // Arrange
    const userId = 'user-id';
    userRepositoryMock.findById.mockRejectedValue(new Error('Database error'));

    // Act & Assert
    await expect(getUserByIdUseCase.execute(userId)).rejects.toThrow(
      expect.objectContaining({
        message: 'An unexpected error occurred',
      }),
    );
    expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId);
  });

  it('should propagate Exception errors', async () => {
    // Arrange
    const userId = 'user-id';
    const customException = Exception.new({
      code: 'CUSTOM_ERROR',
      overrideMessage: 'Custom error message',
    });
    userRepositoryMock.findById.mockRejectedValue(customException);

    // Act & Assert
    await expect(getUserByIdUseCase.execute(userId)).rejects.toThrow(
      customException,
    );
    expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId);
  });
});
