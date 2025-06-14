import { ProfileRepository } from '@app/profiles/domain/repositories/profile.repository';
import { Profile } from '@app/profiles/domain/entities/profile.entity';
import { Inject, Injectable } from '@nestjs/common';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';

import { RoleName } from '@app/auth/infrastructure/roles/roles.enum';
import { UpdateProfileRequestDto } from '@app/profiles/interfaces/http/dtos/update-profile-request.dto';

@Injectable()
export class UpdateProfileUseCase {
  constructor(
    @Inject('ProfileRepository')
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(
    id: string,
    updateProfileDto: UpdateProfileRequestDto,
  ): Promise<void> {
    try {
      const existingProfile = await this.profileRepository.findById(id);

      if (!existingProfile) {
        throw Exception.new({
          code: Code.NOT_FOUND.code,
          overrideMessage: `Profile not found`,
        });
      }

      // Create a new profile with updated values
      const updatedProfile = new Profile(
        existingProfile.id,
        updateProfileDto.name !== undefined
          ? updateProfileDto.name
          : existingProfile.name,
        updateProfileDto.description !== undefined
          ? (updateProfileDto.description ?? '')
          : (existingProfile.description ?? ''),
        updateProfileDto.role !== undefined
          ? (updateProfileDto.role as RoleName)
          : (existingProfile.role as RoleName),
        existingProfile.createdAt,
        new Date(),
      );

      await this.profileRepository.update(updatedProfile);
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
