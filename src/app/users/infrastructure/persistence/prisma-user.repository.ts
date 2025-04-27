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

  async findById(id: string): Promise<any | null> {
    try {
      const foundUser = await this.prisma.user.findUnique({
        where: { id },
        include: {
          profile: true,
        },
      });

      if (!foundUser) return null;

      return this.mapper.mapToAggregate(
        new User(
          foundUser.id,
          foundUser.name,
          foundUser.email,
          foundUser.phone,
          foundUser.password,
          foundUser.profile_id,
          foundUser.created_at,
          foundUser.updated_at,
        ),
      );
    } catch (error) {
      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: error.message,
      });
    }
  }

  async findAll(): Promise<UserModel[]> {
    try {
      const foundUsers = await this.prisma.user.findMany();

      return this.mapper.mapCollection(
        foundUsers.map(
          (user) =>
            new User(
              user.id,
              user.name,
              user.email,
              user.phone,
              user.password,
              user.profile_id,
              user.created_at,
              user.updated_at,
            ),
        ),
      );
    } catch (error) {
      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: error.message,
      });
    }
  }

  async findByEmail(email: string): Promise<any | null> {
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
