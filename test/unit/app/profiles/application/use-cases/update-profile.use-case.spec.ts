import { ProfileRepository } from '@app/profiles/domain/repositories/profile.repository';
import { Profile } from '@app/profiles/domain/entities/profile.entity';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { UpdateProfileUseCase } from '@app/profiles/application/use-cases';

describe('UpdateProfileUseCase', () => {
  let useCase: UpdateProfileUseCase;
  let profileRepository: jest.Mocked<ProfileRepository>;

  beforeEach(() => {
    profileRepository = {
      findById: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<ProfileRepository>;

    useCase = new UpdateProfileUseCase(profileRepository);
  });

  it('updates the profile description successfully', async () => {
    const profile = new Profile(
      '1',
      'admin',
      'old description',
      new Date(),
      new Date(),
    );
    profileRepository.findById.mockResolvedValue(profile);
    profileRepository.update.mockResolvedValue(profile);

    const result = await useCase.execute('1', 'new description');

    expect(profileRepository.findById).toHaveBeenCalledWith('1');
    expect(profileRepository.update).toHaveBeenCalledWith(profile);
    expect(result.description).toBe('new description');
  });

  it('throws an error when the profile is not found', async () => {
    profileRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('1', 'new description')).rejects.toThrowError(
      'Profile not found',
    );
    expect(profileRepository.findById).toHaveBeenCalledWith('1');
    expect(profileRepository.update).not.toHaveBeenCalled();
  });

  it('allows updating the description to null', async () => {
    const profile = new Profile(
      '1',
      'admin',
      'old description',
      new Date(),
      new Date(),
    );
    profileRepository.findById.mockResolvedValue(profile);
    profileRepository.update.mockResolvedValue(profile);

    const result = await useCase.execute('1', null);

    expect(profileRepository.findById).toHaveBeenCalledWith('1');
    expect(profileRepository.update).toHaveBeenCalledWith(profile);
    expect(result.description).toBeNull();
  });

  it('throws a custom exception when an unexpected error occurs', async () => {
    profileRepository.findById.mockImplementation(() => {
      throw new Error('Database error');
    });

    await expect(useCase.execute('1', 'new description')).rejects.toThrowError(
      Exception.new({
        code: Code.BAD_REQUEST.code,
        overrideMessage: 'Error updating profile: Database error',
      }).message,
    );
    expect(profileRepository.findById).toHaveBeenCalledWith('1');
    expect(profileRepository.update).not.toHaveBeenCalled();
  });
});
