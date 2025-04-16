import { ProfileRepository } from '@app/profiles/domain/repositories/profile.repository';
import { Profile } from '@app/profiles/domain/entities/profile.entity';
import { Inject, Injectable } from '@nestjs/common';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';

/**
 * Use case for updating a profile's description.
 *
 * This class handles the business logic for updating a profile's description
 * in the repository. It ensures that the profile exists before updating and
 * handles any errors that may occur during the process.
 */
@Injectable()
export class UpdateProfileUseCase {
  /**
   * Constructor for `UpdateProfileUseCase`.
   *
   * @param profileRepository - The repository responsible for managing profiles.
   */
  constructor(
    @Inject('ProfileRepository')
    private readonly profileRepository: ProfileRepository,
  ) {}

  /**
   * Executes the process of updating a profile's description.
   *
   * @param id - The ID of the profile to update.
   * @param description - The new description for the profile. Can be null.
   * @returns A promise that resolves to the updated profile entity.
   *
   * @throws {Exception} If the profile is not found or if an error occurs during the update.
   */
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
