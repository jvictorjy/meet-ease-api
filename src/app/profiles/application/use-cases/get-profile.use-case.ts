import { ProfileRepository } from '@app/profiles/domain/repositories/profile.repository';
import { Inject, Injectable } from '@nestjs/common';
import { Profile } from '@app/profiles/domain/entities/profile.entity';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';

@Injectable()
export class GetProfileUseCase {
  constructor(
    @Inject('ProfileRepository')
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(userId: string): Promise<Profile> {
    try {
      const profile = await this.profileRepository.findById(userId);

      if (!profile) {
        throw Exception.new({
          code: Code.NOT_FOUND.code,
          overrideMessage: `Profile not found`,
        });
      }

      return profile;
    } catch (error) {
      throw Exception.new({
        code: Code.BAD_REQUEST.code,
        overrideMessage: `Error getting profile: ${error.message}`,
      });
    }
  }
}
