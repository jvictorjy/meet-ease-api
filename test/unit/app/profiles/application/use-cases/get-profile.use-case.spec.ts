import { GetProfileUseCase } from '@app/profiles/application/use-cases/get-profile.use-case';
import { ProfileRepository } from '@app/profiles/domain/repositories/profile.repository';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { Profile } from '@app/profiles/domain/entities/profile.entity';

describe('GetProfileUseCase', () => {
  let getProfileUseCase: GetProfileUseCase;
  let profileRepository: jest.Mocked<ProfileRepository>;

  beforeEach(() => {
    profileRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<ProfileRepository>;

    getProfileUseCase = new GetProfileUseCase(profileRepository);
  });

  it('returns the profile when it exists', async () => {
    const mockProfile: Profile = { id: '123', role: 'Admin' } as Profile;
    profileRepository.findById.mockResolvedValue(mockProfile);

    const result = await getProfileUseCase.execute('123');

    expect(result).toEqual(mockProfile);
    expect(profileRepository.findById).toHaveBeenCalledWith('123');
  });

  it('throws NOT_FOUND exception when profile does not exist', async () => {
    profileRepository.findById.mockResolvedValue(null);

    await expect(getProfileUseCase.execute('123')).rejects.toThrowError(
      Exception.new({
        code: Code.NOT_FOUND.code,
        overrideMessage: 'Error getting profile: Profile not found',
      }),
    );
    expect(profileRepository.findById).toHaveBeenCalledWith('123');
  });

  it('throws BAD_REQUEST exception when repository throws an error', async () => {
    profileRepository.findById.mockRejectedValue(new Error('Database error'));

    await expect(getProfileUseCase.execute('123')).rejects.toThrowError(
      Exception.new({
        code: Code.BAD_REQUEST.code,
        overrideMessage: 'Error getting profile: Database error',
      }),
    );
    expect(profileRepository.findById).toHaveBeenCalledWith('123');
  });
});
