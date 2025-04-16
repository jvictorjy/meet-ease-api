import { ProfileRepository } from '@app/profiles/domain/repositories/profile.repository';
import { Inject, Injectable } from '@nestjs/common';
import { Profile } from '@app/profiles/domain/entities/profile.entity';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';

/**
 * Use case for retrieving a profile by user ID.
 *
 * This class handles the business logic for fetching a profile from the repository
 * based on the provided user ID. It ensures that the profile exists and handles
 * any errors that may occur during the process.
 */
@Injectable()
export class GetProfileUseCase {
  /**
   * Constructor for `GetProfileUseCase`.
   *
   * @param profileRepository - The repository responsible for managing profiles.
   */
  constructor(
    @Inject('ProfileRepository')
    private readonly profileRepository: ProfileRepository,
  ) {}

  /**
   * Executes the process of retrieving a profile by user ID.
   *
   * @param userId - The ID of the user whose profile is to be retrieved.
   * @returns A promise that resolves to the profile entity.
   *
   * @throws {Exception} If the profile is not found or if an error occurs during retrieval.
   */
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
