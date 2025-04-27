import { Profile } from '@app/profiles/domain/entities/profile.entity';

export class UserModel {
  id: string;
  name: string;
  email: string;
  phone: string;
  profile: Profile;
  createdAt: Date;
  updatedAt: Date;
}
