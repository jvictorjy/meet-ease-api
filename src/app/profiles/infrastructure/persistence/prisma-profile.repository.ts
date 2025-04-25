import { PrismaClient } from '@prisma/client';
import { Profile } from '@app/profiles/domain/entities/profile.entity';
import { ProfileRepository } from '@app/profiles/domain/repositories/profile.repository';
import { RoleName } from '@app/auth/infrastructure/roles/roles.enum';

export class PrismaProfileRepository implements ProfileRepository {
  private prisma = new PrismaClient();

  async create(profile: Profile): Promise<Profile> {
    const profileData = await this.prisma.profile.create({
      data: {
        id: profile.id,
        name: profile.name,
        description: profile.description,
        role: profile.role,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
      },
    });

    return new Profile(
      profileData.id,
      profileData.name,
      profileData.description ?? '',
      profileData.role as RoleName,
      profileData.created_at,
      profileData.updated_at,
    );
  }

  async update(profile: Profile): Promise<Profile> {
    const profileData = await this.prisma.profile.update({
      where: { id: profile.id },
      data: {
        name: profile.name,
        description: profile.description,
        role: profile.role,
        updated_at: new Date(),
      },
    });

    return new Profile(
      profileData.id,
      profileData.name,
      profileData.description || '',
      profileData.role as RoleName,
      profileData.created_at,
      profileData.updated_at,
    );
  }

  async findById(id: string): Promise<Profile | null> {
    const profileData = await this.prisma.profile.findUnique({
      where: { id },
    });

    if (!profileData) {
      return null;
    }

    return new Profile(
      profileData.id,
      profileData.name,
      profileData.description || '',
      profileData.role as RoleName,
      profileData.created_at,
      profileData.updated_at,
    );
  }

  async findAll(): Promise<Profile[]> {
    const profilesData = await this.prisma.profile.findMany();

    return profilesData.map(
      (profile) =>
        new Profile(
          profile.id,
          profile.name,
          profile.description || '',
          profile.role as RoleName,
          profile.created_at,
          profile.updated_at,
        ),
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.profile.delete({
      where: { id },
    });
  }
}
