import { v4 as uuid } from 'uuid';
import { Profile } from '@app/profiles/domain/entities/profile.entity';
import { ProfileRepository } from '@app/profiles/domain/repositories/profile.repository';
import { Inject, Injectable } from '@nestjs/common';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';

/**
 * Use case for creating a new profile.
 *
 * This class handles the business logic for creating a profile, including
 * generating a unique ID, setting timestamps, and persisting the profile
 * to the repository.
 */
@Injectable()
export class CreateProfileUseCase {
  /**
   * Constructor for `CreateProfileUseCase`.
   *
   * @param profileRepository - The repository responsible for managing profiles.
   */
  constructor(
    @Inject('ProfileRepository')
    private readonly profileRepository: ProfileRepository,
  ) {}

  /**
   * Executes the profile creation process.
   *
   * @param role - The role of the profile (e.g., admin, user).
   * @param description - An optional description for the profile.
   * @returns A promise that resolves to the created profile.
   *
   * @throws {Exception} If an error occurs during profile creation.
   */
  async execute(role: string, description: string | null): Promise<Profile> {
    try {
      const profile = new Profile(
        uuid(), // Generates a unique ID for the profile
        role,
        description,
        new Date(), // Sets the creation timestamp
        new Date(), // Sets the update timestamp
      );
      return this.profileRepository.create(profile); // Persists the profile to the repository
    } catch (error) {
      throw Exception.new({
        code: Code.BAD_REQUEST.code,
        overrideMessage: `Error creating profile: ${error.message}`, // Custom error message
      });
    }
  }
}
