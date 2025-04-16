import { ProfileRepository } from '@app/profiles/domain/repositories/profile.repository';
import { Inject, Injectable } from '@nestjs/common';
import { Profile } from '@app/profiles/domain/entities/profile.entity';

@Injectable()
export class FindAllProfileUseCase {
  constructor(
    @Inject('ProfileRepository')
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(): Promise<Profile[]> {
    return this.profileRepository.findAll();
  }
}
