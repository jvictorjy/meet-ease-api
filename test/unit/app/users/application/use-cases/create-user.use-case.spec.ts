import { CreateUserUseCase } from '@app/users/application/use-cases/create-user.use-case';
import { UserRepository } from '@app/users/domain/repositories/user.repository';
import { ProfileRepository } from '@app/profiles/domain/repositories/profile.repository';
import { HashGenerator } from '@app/@common/application/cryptography';
import { CreateUserRequestDto } from '@app/users/interfaces/http/dtos/create-user.dto';
import { User } from '@app/users/domain/entities/user.entity';

// Mock UUID to return a consistent value for testing
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid'),
}));

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;
  let userRepositoryMock: jest.Mocked<UserRepository>;
  let profileRepositoryMock: jest.Mocked<ProfileRepository>;
  let hashGeneratorMock: jest.Mocked<HashGenerator>;

  beforeEach(() => {
    userRepositoryMock = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<UserRepository>;

    profileRepositoryMock = {
      findById: jest.fn(),
    } as jest.Mocked<ProfileRepository>;

    hashGeneratorMock = {
      hash: jest.fn(),
      compare: jest.fn(),
    } as jest.Mocked<HashGenerator>;

    createUserUseCase = new CreateUserUseCase(
      userRepositoryMock,
      profileRepositoryMock,
      hashGeneratorMock,
    );
  });

  it('should create a user successfully', async () => {
    // Arrange
    const createUserDto: CreateUserRequestDto = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      password: 'password123',
      profile_id: 'profile-id',
    };

    profileRepositoryMock.findById.mockResolvedValue({
      id: 'profile-id',
      name: 'Test Profile',
    });
    userRepositoryMock.findByEmail.mockResolvedValue(null);
    hashGeneratorMock.hash.mockResolvedValue('hashed-password');
    userRepositoryMock.create.mockResolvedValue(undefined);

    // Act
    await createUserUseCase.execute(createUserDto);

    // Assert
    expect(profileRepositoryMock.findById).toHaveBeenCalledWith('profile-id');
    expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(
      'test@example.com',
    );
    expect(hashGeneratorMock.hash).toHaveBeenCalledWith('password123');
    expect(userRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'mocked-uuid',
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        password: 'hashed-password',
        profile_id: 'profile-id',
      }),
    );
  });

  it('should throw an exception when profile is not found', async () => {
    // Arrange
    const createUserDto: CreateUserRequestDto = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      password: 'password123',
      profile_id: 'non-existent-profile-id',
    };

    profileRepositoryMock.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(createUserUseCase.execute(createUserDto)).rejects.toThrow(
      expect.objectContaining({
        message: 'Profile not found',
      }),
    );
    expect(profileRepositoryMock.findById).toHaveBeenCalledWith(
      'non-existent-profile-id',
    );
    expect(userRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('should throw an exception when email is already in use', async () => {
    // Arrange
    const createUserDto: CreateUserRequestDto = {
      name: 'Test User',
      email: 'existing@example.com',
      phone: '1234567890',
      password: 'password123',
      profile_id: 'profile-id',
    };

    profileRepositoryMock.findById.mockResolvedValue({
      id: 'profile-id',
      name: 'Test Profile',
    });
    userRepositoryMock.findByEmail.mockResolvedValue(
      new User(
        'existing-id',
        'Existing User',
        'existing@example.com',
        '9876543210',
        'hashed-password',
        'profile-id',
        new Date(),
        new Date(),
      ),
    );

    // Act & Assert
    await expect(createUserUseCase.execute(createUserDto)).rejects.toThrow(
      expect.objectContaining({
        message: 'Email already in use',
      }),
    );
    expect(profileRepositoryMock.findById).toHaveBeenCalledWith('profile-id');
    expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(
      'existing@example.com',
    );
    expect(userRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('should handle unexpected errors', async () => {
    // Arrange
    const createUserDto: CreateUserRequestDto = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      password: 'password123',
      profile_id: 'profile-id',
    };

    profileRepositoryMock.findById.mockResolvedValue({
      id: 'profile-id',
      name: 'Test Profile',
    });
    userRepositoryMock.findByEmail.mockResolvedValue(null);
    hashGeneratorMock.hash.mockResolvedValue('hashed-password');
    userRepositoryMock.create.mockRejectedValue(new Error('Database error'));

    // Act & Assert
    await expect(createUserUseCase.execute(createUserDto)).rejects.toThrow(
      expect.objectContaining({
        message: 'An unexpected error occurred',
      }),
    );
    expect(profileRepositoryMock.findById).toHaveBeenCalledWith('profile-id');
    expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(
      'test@example.com',
    );
    expect(hashGeneratorMock.hash).toHaveBeenCalledWith('password123');
    expect(userRepositoryMock.create).toHaveBeenCalled();
  });
});
