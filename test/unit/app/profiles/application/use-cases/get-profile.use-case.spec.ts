import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { GetProfileUseCase } from '@app/profiles/application/use-cases/get-profile.use-case';
import { ProfileRepository } from '@app/profiles/domain/repositories/profile.repository';
import { ProfileModel } from '@app/profiles/domain/models/profile.model';

describe('GetProfileUseCase', () => {
  let getProfileUseCase: GetProfileUseCase;
  let profileRepository: jest.Mocked<ProfileRepository>;

  beforeEach(() => {
    profileRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<ProfileRepository>;

    getProfileUseCase = new GetProfileUseCase(profileRepository);
  });

  it('should be defined', () => {
    expect(getProfileUseCase).toBeDefined();
  });

  it('should get a profile by id when it exists', async () => {
    // Arrange
    const profileId = 'profile-id';
    const profile: ProfileModel = {
      id: profileId,
      name: 'Test Profile',
      description: 'Test Description',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    profileRepository.findById.mockResolvedValue(profile);

    // Act
    const result = await getProfileUseCase.execute(profileId);

    // Assert
    expect(result).toEqual(profile);
    expect(profileRepository.findById).toHaveBeenCalledWith(profileId);
  });

  it('should throw a NOT_FOUND exception when profile does not exist', async () => {
    // Arrange
    const profileId = 'non-existent-profile-id';

    profileRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(getProfileUseCase.execute(profileId)).rejects.toThrow(
      Exception.new({
        code: Code.NOT_FOUND.code,
        overrideMessage: 'Profile not found',
      }),
    );
    expect(profileRepository.findById).toHaveBeenCalledWith(profileId);
  });

  it('should handle domain exceptions', async () => {
    // Arrange
    const profileId = 'profile-id';

    const domainException = Exception.new({
      code: Code.BAD_REQUEST.code,
      overrideMessage: 'Domain error',
    });

    profileRepository.findById.mockRejectedValue(domainException);

    // Act & Assert
    await expect(getProfileUseCase.execute(profileId)).rejects.toThrow(
      domainException,
    );
  });

  it('should handle unexpected errors', async () => {
    const profileId = 'profile-id';

    profileRepository.findById.mockRejectedValue(new Error('Database error'));

    await expect(getProfileUseCase.execute(profileId)).rejects.toThrow(
      Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: 'An unexpected error occurred',
      }),
    );
  });
});
