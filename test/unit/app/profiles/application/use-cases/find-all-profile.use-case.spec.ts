import { ProfileRepository } from '@app/profiles/domain/repositories/profile.repository';
import { Profile } from '@app/profiles/domain/entities/profile.entity';
import { FindAllProfileUseCase } from '@app/profiles/application/use-cases';

describe('FindAllProfileUseCase', () => {
  let useCase: FindAllProfileUseCase;
  let profileRepository: jest.Mocked<ProfileRepository>;

  beforeEach(() => {
    profileRepository = {
      findAll: jest.fn(),
    } as unknown as jest.Mocked<ProfileRepository>;

    useCase = new FindAllProfileUseCase(profileRepository);
  });

  it('returns all profiles successfully', async () => {
    const profiles = [
      new Profile('1', 'admin', 'description1', new Date(), new Date()),
      new Profile('2', 'user', 'description2', new Date(), new Date()),
    ];
    profileRepository.findAll.mockResolvedValue(profiles);

    const result = await useCase.execute();

    expect(profileRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(profiles);
  });

  it('returns an empty array when no profiles are found', async () => {
    profileRepository.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(profileRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('throws an error when the repository throws an unexpected error', async () => {
    profileRepository.findAll.mockRejectedValue(new Error('Database error'));

    await expect(useCase.execute()).rejects.toThrowError('Database error');
    expect(profileRepository.findAll).toHaveBeenCalled();
  });
});
