import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { CreateProfileUseCase } from '@app/profiles/application/use-cases/create-profiele.use-case';
import { ProfileRepository } from '@app/profiles/domain/repositories/profile.repository';
import { CreateProfileDto } from '@app/profiles/interfaces/http/dtos/create-profile.dto';
import { RoleName } from '@app/auth/infrastructure/roles/roles.enum';

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mocked-uuid'),
}));

describe('CreateProfileUseCase', () => {
  let createProfileUseCase: CreateProfileUseCase;
  let profileRepository: jest.Mocked<ProfileRepository>;

  beforeEach(() => {
    profileRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<ProfileRepository>;

    createProfileUseCase = new CreateProfileUseCase(profileRepository);
  });

  it('should be defined', () => {
    expect(createProfileUseCase).toBeDefined();
  });

  it('should create a profile successfully', async () => {
    const payload: CreateProfileDto = {
      name: 'Test Profile',
      description: 'Test Description',
      role: RoleName.ADMIN,
    };

    profileRepository.create.mockResolvedValue(undefined);

    // Act
    await createProfileUseCase.execute(payload);

    // Assert
    expect(profileRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'mocked-uuid',
        name: payload.name,
        description: payload.description,
        role: payload.role,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );
  });

  it('should create a profile with default empty description when not provided', async () => {
    // Arrange
    const payload: CreateProfileDto = {
      name: 'Test Profile',
      role: RoleName.ADMIN,
    };

    profileRepository.create.mockResolvedValue(undefined);

    // Act
    await createProfileUseCase.execute(payload);

    // Assert
    expect(profileRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'mocked-uuid',
        name: payload.name,
        description: '',
        role: payload.role,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );
  });

  it('should handle domain exceptions', async () => {
    // Arrange
    const payload: CreateProfileDto = {
      name: 'Test Profile',
      description: 'Test Description',
      role: RoleName.ADMIN,
    };

    const domainException = Exception.new({
      code: Code.BAD_REQUEST.code,
      overrideMessage: 'Domain error',
    });

    profileRepository.create.mockRejectedValue(domainException);

    // Act & Assert
    await expect(createProfileUseCase.execute(payload)).rejects.toThrow(
      domainException,
    );
  });

  it('should handle unexpected errors', async () => {
    const payload: CreateProfileDto = {
      name: 'Test Profile',
      description: 'Test Description',
      role: RoleName.ADMIN,
    };

    profileRepository.create.mockRejectedValue(new Error('Database error'));

    await expect(createProfileUseCase.execute(payload)).rejects.toThrow(
      Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: 'An unexpected error occurred',
      }),
    );
  });
});
