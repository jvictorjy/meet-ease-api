import {
  UserRepository,
  UserUpdatePayload,
} from '@app/users/domain/repositories/user.repository';
import { PrismaClient } from '@prisma/client';
import { User } from '@app/users/domain/entities/user.entity';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { Inject } from '@nestjs/common';
import { UserAggregateMapper } from '@app/users/domain/mappers/user-aggregate.mapper';
import { UserModel } from '@app/users/domain/models/user.model';
import { Profile } from '@app/profiles/domain/entities/profile.entity';
import { RoleName } from '@app/auth/infrastructure/roles/roles.enum';

export class PrismaUserRepository implements UserRepository {
  private prisma = new PrismaClient();

  constructor(
    @Inject('UserAggregateMapper')
    private readonly mapper: UserAggregateMapper,
  ) {}

  async create(user: User): Promise<void> {
    try {
      await this.prisma.user.create({
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          password: user.password,
          created_at: user.createdAt,
          updated_at: user.updatedAt,
          profile: {
            connect: { id: user.profile_id },
          },
        },
      });
    } catch (error) {
      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: error.message,
      });
    }
  }

  async findById(id: string): Promise<UserModel | null> {
    try {
      const foundUser = await this.prisma.user.findUnique({
        where: { id },
        include: {
          profile: true,
        },
      });

      if (!foundUser) return null;

      const user = new User(
        foundUser.id,
        foundUser.name,
        foundUser.email,
        foundUser.phone,
        foundUser.password,
        foundUser.profile_id,
        foundUser.created_at,
        foundUser.updated_at,
      );

      const profile = new Profile(
        foundUser.profile.id,
        foundUser.profile.name,
        foundUser.profile.description || '',
        foundUser.profile.role as RoleName,
        foundUser.profile.created_at,
        foundUser.profile.updated_at,
      );

      return this.mapper.mapToAggregate(user, profile);
    } catch (error) {
      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: error.message,
      });
    }
  }

  async findAll(): Promise<UserModel[]> {
    try {
      const foundUsers = await this.prisma.user.findMany({
        include: {
          profile: true,
        },
      });

      return this.mapper.mapCollection(foundUsers);
    } catch (error) {
      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: error.message,
      });
    }
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    try {
      const foundUser = await this.prisma.user.findUnique({
        where: { email },
        include: {
          profile: true,
        },
      });

      if (!foundUser) return null;

      const user = new User(
        foundUser.id,
        foundUser.name,
        foundUser.email,
        foundUser.phone,
        foundUser.password,
        foundUser.profile_id,
        foundUser.created_at,
        foundUser.updated_at,
      );

      const profile = new Profile(
        foundUser.profile.id,
        foundUser.profile.name,
        foundUser.profile.description || '',
        foundUser.profile.role as RoleName,
        foundUser.profile.created_at,
        foundUser.profile.updated_at,
      );

      return this.mapper.mapToAggregate(user, profile);
    } catch (error) {
      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: error.message,
      });
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    try {
      const foundUser = await this.prisma.user.findUnique({
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
    } catch (error) {
      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: error.message,
      });
    }
  }

  async update(user: UserUpdatePayload): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          updated_at: new Date(),
        },
      });
    } catch (error) {
      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: error.message,
      });
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: error.message,
      });
    }
  }
}
