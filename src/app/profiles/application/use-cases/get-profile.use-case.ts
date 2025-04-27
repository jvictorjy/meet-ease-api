import { ProfileRepository } from '@app/profiles/domain/repositories/profile.repository';
import { Inject, Injectable } from '@nestjs/common';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { ProfileModel } from '@app/profiles/domain/models/profile.model';

@Injectable()
export class GetProfileUseCase {
  constructor(
    @Inject('ProfileRepository')
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(userId: string): Promise<ProfileModel> {
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
