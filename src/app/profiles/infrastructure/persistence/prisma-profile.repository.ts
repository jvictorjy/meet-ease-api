import { PrismaClient } from '@prisma/client';
import { Profile } from '@app/profiles/domain/entities/profile.entity';
import { ProfileRepository } from '@app/profiles/domain/repositories/profile.repository';
import { RoleName } from '@app/auth/infrastructure/roles/roles.enum';
import { ProfileAggregateMapper } from '@app/profiles/domain/mappers/profile-aggregate.mapper';
import { ProfileModel } from '@app/profiles/domain/models/profile.model';
import { Inject, Injectable } from '@nestjs/common';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';

@Injectable()
export class PrismaProfileRepository implements ProfileRepository {
  private readonly prisma = new PrismaClient();

  constructor(
    @Inject('ProfileAggregateMapper')
    private readonly mapper: ProfileAggregateMapper,
  ) {}

  async create(profile: Profile): Promise<void> {
    try {
      await this.prisma.profile.create({
        data: {
          id: profile.id,
          name: profile.name,
          description: profile.description,
          role: profile.role,
          created_at: profile.createdAt,
          updated_at: profile.updatedAt,
        },
      });
    } catch (error) {
      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: error.message,
      });
    }
  }

  async update(profile: Profile): Promise<void> {
    try {
      await this.prisma.profile.update({
        where: { id: profile.id },
        data: {
          name: profile.name,
          description: profile.description,
          role: profile.role,
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

  async findById(id: string): Promise<ProfileModel | null> {
    try {
      const profileData = await this.prisma.profile.findUnique({
        where: { id },
      });

      if (!profileData) {
        return null;
      }

      return this.mapper.mapToAggregate(
        new Profile(
          profileData.id,
          profileData.name,
          profileData.description || '',
          profileData.role as RoleName,
          profileData.created_at,
          profileData.updated_at,
        ),
      );
    } catch (error) {
      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: error.message,
      });
    }
  }

  async findAll(): Promise<ProfileModel[]> {
    const profilesData = await this.prisma.profile.findMany();

    return this.mapper.mapCollection(
      profilesData.map(
        (profile) =>
          new Profile(
            profile.id,
            profile.name,
            profile.description || '',
            profile.role as RoleName,
            profile.created_at,
            profile.updated_at,
          ),
      ),
    );
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.profile.delete({
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
