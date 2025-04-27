import { Profile } from '@app/profiles/domain/entities/profile.entity';
import { ProfileModel } from '@app/profiles/domain/models/profile.model';

export interface ProfileRepository {
  create(profile: Profile): Promise<void>;
  update(profile: Profile): Promise<Profile>;
  findById(id: string): Promise<ProfileModel | null>;
  findAll(): Promise<ProfileModel[]>;
  delete(id: string): Promise<void>;
}
