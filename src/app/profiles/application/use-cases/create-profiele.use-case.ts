import { v4 as uuid } from 'uuid';
import { Profile } from '@app/profiles/domain/entities/profile.entity';
import { ProfileRepository } from '@app/profiles/domain/repositories/profile.repository';
import { Inject, Injectable } from '@nestjs/common';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { CreateProfileDto } from '@app/profiles/application/dto/create-profile.dto';

@Injectable()
export class CreateProfileUseCase {
  constructor(
    @Inject('ProfileRepository')
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(payload: CreateProfileDto): Promise<void> {
    try {
      const profile = new Profile(
        uuid(), // Generates a unique ID for the profile
        payload.name,
        payload.description ?? '',
        payload.role,
        new Date(),
        new Date(),
      );
      await this.profileRepository.create(profile); // Persists the profile to the repository
    } catch (error) {
      if (error instanceof Exception) {
        throw error;
      }

      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: 'An unexpected error occurred',
      });
    }
  }
}
