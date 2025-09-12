export class UserModel {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  profile: Record<string, any>;
  area?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
