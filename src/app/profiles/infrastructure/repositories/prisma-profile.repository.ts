import { PrismaClient } from '@prisma/client';
import { Profile } from '@app/profiles/domain/entities/profile.entity';
import { ProfileRepository } from '@app/profiles/domain/repositories/profile.repository';

export class PrismaProfileRepository implements ProfileRepository {
  private prisma = new PrismaClient();

  async create(profile: Profile): Promise<Profile> {
    const createdProfile = await this.prisma.profiles.create({
      data: {
        id: profile.id,
        role: profile.role,
        description: profile.description,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
      },
    });

    return new Profile(
      createdProfile.id,
      createdProfile.role,
      createdProfile.description,
      createdProfile.created_at,
      createdProfile.updated_at,
    );
  }

  async update(profile: Profile): Promise<Profile> {
    const updatedProfile = await this.prisma.profiles.update({
      where: { id: profile.id },
      data: {
        role: profile.role,
        description: profile.description,
        updated_at: profile.updated_at,
      },
    });

    return new Profile(
      updatedProfile.id,
      updatedProfile.role,
      updatedProfile.description,
      updatedProfile.created_at,
      updatedProfile.updated_at,
    );
  }

  async findById(id: string): Promise<Profile | null> {
    const foundProfile = await this.prisma.profiles.findUnique({
      where: { id },
    });

    if (!foundProfile) return null;

    return new Profile(
      foundProfile.id,
      foundProfile.role,
      foundProfile.description,
      foundProfile.created_at,
      foundProfile.updated_at,
    );
  }

  async findAll(): Promise<Profile[]> {
    const foundProfiles = await this.prisma.profiles.findMany();

    return foundProfiles.map((profile) => {
      return new Profile(
        profile.id,
        profile.role,
        profile.description,
        profile.created_at,
        profile.updated_at,
      );
    });
  }
}
