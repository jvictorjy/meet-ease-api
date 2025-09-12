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
import { Area } from '@app/areas/domain/entities/area.entity';

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
          area: user.area_id
            ? {
                connect: { id: user.area_id },
              }
            : undefined,
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
          area: true,
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
        foundUser.area_id,
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

      let area: Area | undefined;
      if (foundUser.area) {
        area = new Area(
          foundUser.area.id,
          foundUser.area.name,
          foundUser.area.description,
          foundUser.area.parent_id,
          foundUser.area.created_at,
          foundUser.area.updated_at,
          foundUser.area.deleted_at,
        );
      }

      return this.mapper.mapToAggregate(user, profile, area);
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
        where: { deleted_at: null },
        include: {
          profile: true,
          area: true,
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
        foundUser.area_id,
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
        foundUser.area_id,
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
          password: user.password,
          area: user.area_id
            ? {
                connect: { id: user.area_id },
              }
            : undefined,
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
      await this.prisma.user.update({
        where: { id },
        data: {
          deleted_at: new Date(),
        },
      });
    } catch (error) {
      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: error.message,
      });
    }
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword, updated_at: new Date() },
      });
    } catch (error) {
      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: error.message,
      });
    }
  }
}
