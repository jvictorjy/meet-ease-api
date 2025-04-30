import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { FindAllProfileUseCase } from '@app/profiles/application/use-cases/find-all-profile.use-case';
import { ProfileRepository } from '@app/profiles/domain/repositories/profile.repository';
import { ProfileModel } from '@app/profiles/domain/models/profile.model';
import { RoleName } from '@app/auth/infrastructure/roles/roles.enum';

describe('FindAllProfileUseCase', () => {
  let findAllProfileUseCase: FindAllProfileUseCase;
  let profileRepository: jest.Mocked<ProfileRepository>;

  beforeEach(() => {
    profileRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<ProfileRepository>;

    findAllProfileUseCase = new FindAllProfileUseCase(profileRepository);
  });

  it('should be defined', () => {
    expect(findAllProfileUseCase).toBeDefined();
  });

  it('should return all profiles', async () => {
    // Arrange
    const profiles: ProfileModel[] = [
      {
        id: 'profile-1',
        name: 'Profile 1',
        description: 'Description 1',
        role: RoleName.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'profile-2',
        name: 'Profile 2',
        description: 'Description 2',
        role: RoleName.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    profileRepository.findAll.mockResolvedValue(profiles);

    // Act
    const result = await findAllProfileUseCase.execute();

    // Assert
    expect(result).toEqual(profiles);
    expect(profileRepository.findAll).toHaveBeenCalled();
  });

  it('should return an empty array when no profiles exist', async () => {
    // Arrange
    profileRepository.findAll.mockResolvedValue([]);

    // Act
    const result = await findAllProfileUseCase.execute();

    // Assert
    expect(result).toEqual([]);
    expect(profileRepository.findAll).toHaveBeenCalled();
  });

  it('should handle domain exceptions', async () => {
    // Arrange
    const domainException = Exception.new({
      code: Code.BAD_REQUEST.code,
      overrideMessage: 'Domain error',
    });

    profileRepository.findAll.mockRejectedValue(domainException);

    // Act & Assert
    await expect(findAllProfileUseCase.execute()).rejects.toThrow(
      domainException,
    );
  });

  it('should handle unexpected errors', async () => {
    profileRepository.findAll.mockRejectedValue(new Error('Database error'));

    await expect(findAllProfileUseCase.execute()).rejects.toThrow();
  });
});
