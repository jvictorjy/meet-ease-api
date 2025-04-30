import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { UpdateProfileUseCase } from '@app/profiles/application/use-cases/update-profile.use-case';
import { ProfileRepository } from '@app/profiles/domain/repositories/profile.repository';
import { ProfileModel } from '@app/profiles/domain/models/profile.model';
import { UpdateProfileRequestDto } from '@app/profiles/interfaces/http/dtos/update-profile-request.dto';
import { RoleName } from '@app/auth/infrastructure/roles/roles.enum';

describe('UpdateProfileUseCase', () => {
  let updateProfileUseCase: UpdateProfileUseCase;
  let profileRepository: jest.Mocked<ProfileRepository>;

  beforeEach(() => {
    profileRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<ProfileRepository>;

    updateProfileUseCase = new UpdateProfileUseCase(profileRepository);
  });

  it('should be defined', () => {
    expect(updateProfileUseCase).toBeDefined();
  });

  it('should update a profile when it exists', async () => {
    const profileId = 'profile-id';
    const existingProfile: ProfileModel = {
      id: profileId,
      name: 'Test Profile',
      description: 'Test Description',
      role: RoleName.ADMIN,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    };

    const updateData: UpdateProfileRequestDto = {
      name: 'Updated Profile',
      description: 'Updated Description',
      role: RoleName.ADMIN,
    };

    profileRepository.findById.mockResolvedValue(existingProfile);
    profileRepository.update.mockResolvedValue(undefined);

    // Act
    await updateProfileUseCase.execute(profileId, updateData);

    // Assert
    expect(profileRepository.findById).toHaveBeenCalledWith(profileId);
    expect(profileRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: profileId,
        name: updateData.name,
        description: updateData.description,
        role: existingProfile.role,
        createdAt: existingProfile.createdAt,
        updatedAt: expect.any(Date),
      }),
    );
  });

  it('should update only provided fields', async () => {
    // Arrange
    const profileId = 'profile-id';
    const existingProfile: ProfileModel = {
      id: profileId,
      name: 'Test Profile',
      description: 'Test Description',
      role: RoleName.ADMIN,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    };

    const updateData: UpdateProfileRequestDto = {
      name: 'Updated Profile',
      role: RoleName.ADMIN,
      // description is not provided
    };

    profileRepository.findById.mockResolvedValue(existingProfile);
    profileRepository.update.mockResolvedValue(undefined);

    // Act
    await updateProfileUseCase.execute(profileId, updateData);

    // Assert
    expect(profileRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: profileId,
        name: updateData.name,
        description: existingProfile.description,
        role: existingProfile.role,
      }),
    );
  });

  it('should handle null description', async () => {
    // Arrange
    const profileId = 'profile-id';
    const existingProfile: ProfileModel = {
      id: profileId,
      name: 'Test Profile',
      description: 'Test Description',
      role: RoleName.ADMIN,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    };

    const updateData: UpdateProfileRequestDto = {
      description: null,
      name: existingProfile.name,
      role: existingProfile.role,
    };

    profileRepository.findById.mockResolvedValue(existingProfile);
    profileRepository.update.mockResolvedValue(undefined);

    // Act
    await updateProfileUseCase.execute(profileId, updateData);

    // Assert
    expect(profileRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: profileId,
        name: existingProfile.name,
        description: '',
        role: existingProfile.role,
      }),
    );
  });

  it('should throw a NOT_FOUND exception when profile does not exist', async () => {
    // Arrange
    const profileId = 'non-existent-profile-id';
    const updateData: UpdateProfileRequestDto = {
      name: 'Updated Profile',
      role: RoleName.ADMIN,
    };

    profileRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(
      updateProfileUseCase.execute(profileId, updateData),
    ).rejects.toThrow(
      Exception.new({
        code: Code.NOT_FOUND.code,
        overrideMessage: 'Profile not found',
      }),
    );
    expect(profileRepository.findById).toHaveBeenCalledWith(profileId);
    expect(profileRepository.update).not.toHaveBeenCalled();
  });

  it('should handle domain exceptions', async () => {
    // Arrange
    const profileId = 'profile-id';
    const existingProfile: ProfileModel = {
      id: profileId,
      name: 'Test Profile',
      description: 'Test Description',
      role: RoleName.ADMIN,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    };

    const updateData: UpdateProfileRequestDto = {
      name: 'Updated Profile',
      role: 'user' as RoleName,
    };

    const domainException = Exception.new({
      code: Code.BAD_REQUEST.code,
      overrideMessage: 'Domain error',
    });

    profileRepository.findById.mockResolvedValue(existingProfile);
    profileRepository.update.mockRejectedValue(domainException);

    // Act & Assert
    await expect(
      updateProfileUseCase.execute(profileId, updateData),
    ).rejects.toThrow(domainException);
  });

  it('should handle unexpected errors', async () => {
    // Arrange
    const profileId = 'profile-id';
    const existingProfile: ProfileModel = {
      id: profileId,
      name: 'Test Profile',
      description: 'Test Description',
      role: RoleName.ADMIN,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    };

    const updateData: UpdateProfileRequestDto = {
      name: 'Updated Profile',
      role: RoleName.ADMIN,
    };

    profileRepository.findById.mockResolvedValue(existingProfile);
    profileRepository.update.mockRejectedValue(new Error('Database error'));

    // Act & Assert
    await expect(
      updateProfileUseCase.execute(profileId, updateData),
    ).rejects.toThrow(
      Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: 'An unexpected error occurred',
      }),
    );
  });
});
