import { ProfileRepository } from '@app/profiles/domain/repositories/profile.repository';
import { Inject, Injectable } from '@nestjs/common';
import { Profile } from '@app/profiles/domain/entities/profile.entity';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';

@Injectable()
export class FindAllProfileUseCase {
  constructor(
    @Inject('ProfileRepository')
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(): Promise<Profile[]> {
    try {
      return this.profileRepository.findAll();
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
