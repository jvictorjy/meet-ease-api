import { User } from '../entities/user.entity';

export interface UserUpdatePayload {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
}

export interface UserRepository {
  create(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  findByEmail(email: string): Promise<User | null>;
  update(user: UserUpdatePayload): Promise<User>;
  delete(id: string): Promise<void>;
}
