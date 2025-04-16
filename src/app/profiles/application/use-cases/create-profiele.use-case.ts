import { v4 as uuid } from 'uuid';
import { Profile } from '@app/profiles/domain/entities/profile.entity';
import { ProfileRepository } from '@app/profiles/domain/repositories/profile.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CreateProfileUseCase {
  constructor(
    @Inject('ProfileRepository')
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(role: string, description: string | null): Promise<Profile> {
    const profile = new Profile(
      uuid(),
      role,
      description,
      new Date(),
      new Date(),
    );
    return this.profileRepository.create(profile);
  }
}
