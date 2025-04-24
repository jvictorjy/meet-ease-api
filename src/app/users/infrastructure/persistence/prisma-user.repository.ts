import {
  UserRepository,
  UserUpdatePayload,
} from '@app/users/domain/repositories/user.repository';
import { PrismaClient } from '@prisma/client';
import { User } from '@app/users/domain/entities/user.entity';

export class PrismaUserRepository implements UserRepository {
  private prisma = new PrismaClient();

  async create(user: User): Promise<User> {
    try {
      const createdUser = await this.prisma.users.create({
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          password: user.password,
          created_at: user.created_at,
          updated_at: user.updated_at,
          profile: {
            connect: { id: user.profile_id },
          },
        },
      });

      return new User(
        createdUser.id,
        createdUser.name,
        createdUser.email,
        createdUser.phone,
        createdUser.password,
        createdUser.profile_id,
        createdUser.created_at,
        createdUser.updated_at,
      );
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  async findById(id: string): Promise<any | null> {
    const foundUser = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!foundUser) return null;

    return new User(
      foundUser.id,
      foundUser.name,
      foundUser.email,
      foundUser.phone,
      foundUser.password,
      foundUser.profile_id,
      foundUser.created_at,
      foundUser.updated_at,
    );
  }

  async findAll(): Promise<any[]> {
    const foundUsers = await this.prisma.users.findMany();

    return foundUsers.map((user) => {
      return new User(
        user.id,
        user.name,
        user.email,
        user.phone,
        user.password,
        user.profile_id,
        user.created_at,
        user.updated_at,
      );
    });
  }

  async findByEmail(email: string): Promise<any | null> {
    const foundUser = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!foundUser) return null;

    return new User(
      foundUser.id,
      foundUser.name,
      foundUser.email,
      foundUser.phone,
      foundUser.password,
      foundUser.profile_id,
      foundUser.created_at,
      foundUser.updated_at,
    );
  }

  async update(user: UserUpdatePayload): Promise<User> {
    const updatedUser = await this.prisma.users.update({
      where: { id: user.id },
      data: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        updated_at: new Date(),
      },
    });

    return new User(
      updatedUser.id,
      updatedUser.name,
      updatedUser.email,
      updatedUser.phone,
      updatedUser.password,
      updatedUser.profile_id,
      updatedUser.created_at,
      updatedUser.updated_at,
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.users.delete({
      where: { id },
    });
  }
}
