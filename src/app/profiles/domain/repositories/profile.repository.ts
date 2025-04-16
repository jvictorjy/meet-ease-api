import { Profile } from '@app/profiles/domain/entities/profile.entity';

export interface ProfileRepository {
  create(profile: Profile): Promise<Profile>;
  update(profile: Profile): Promise<Profile>;
}
