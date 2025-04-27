import { RoleName } from '@app/auth/infrastructure/roles/roles.enum';

export interface ProfileModel {
  id: string;
  name: string;
  description: string;
  role: RoleName;
  createdAt: Date;
  updatedAt: Date;
}
