import { ProfileRepository } from '@app/profiles/domain/repositories/profile.repository';
import { Profile } from '@app/profiles/domain/entities/profile.entity';
import { Inject, Injectable } from '@nestjs/common';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';

@Injectable()
export class UpdateProfileUseCase {
  constructor(
    @Inject('ProfileRepository')
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(id: string, description: string | null): Promise<Profile> {
    try {
      const profile = await this.profileRepository.findById(id);

      if (!profile) {
        throw Exception.new({
          code: Code.NOT_FOUND.code,
          overrideMessage: `Profile not found`,
        });
      }

      profile.updateDescription(description);

      return this.profileRepository.update(profile);
    } catch (error) {
      throw Exception.new({
        code: Code.BAD_REQUEST.code,
        overrideMessage: `Error updating profile: ${error.message}`,
      });
    }
  }
}
