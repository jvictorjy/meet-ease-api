import { User } from '@app/users/domain/entities/user.entity';
import { UserModel } from '@app/users/domain/models/user.model';

export interface UserUpdatePayload {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
}

export interface UserRepository {
  create(user: User): Promise<void>;
  update(user: UserUpdatePayload): Promise<void>;
  findById(id: string): Promise<User | null>;
  findAll(): Promise<UserModel[]>;
  findByEmail(email: string): Promise<User | null>;
  delete(id: string): Promise<void>;
}
