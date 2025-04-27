export class UserModel {
  id: string;
  name: string;
  email: string;
  phone: string;
  profile: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
