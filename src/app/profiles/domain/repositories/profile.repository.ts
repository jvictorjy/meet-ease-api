import { Profile } from '@app/profiles/domain/entities/profile.entity';

/**
 * Interface for the Profile repository.
 *
 * This interface defines the contract for managing profiles in the data layer.
 * It includes methods for creating, updating, retrieving, and deleting profiles.
 */
export interface ProfileRepository {
  /**
   * Creates a new profile.
   *
   * @param profile - The profile entity to be created.
   * @returns A promise that resolves to the created profile.
   */
  create(profile: Profile): Promise<Profile>;

  /**
   * Updates an existing profile.
   *
   * @param profile - The profile entity with updated data.
   * @returns A promise that resolves to the updated profile.
   */
  update(profile: Profile): Promise<Profile>;

  /**
   * Finds a profile by its ID.
   *
   * @param id - The unique identifier of the profile.
   * @returns A promise that resolves to the profile if found, or null if not found.
   */
  findById(id: string): Promise<Profile | null>;

  /**
   * Retrieves all profiles.
   *
   * @returns A promise that resolves to an array of all profiles.
   */
  findAll(): Promise<Profile[]>;

  /**
   * Deletes a profile by its ID.
   *
   * @param id - The unique identifier of the profile to be deleted.
   * @returns A promise that resolves when the profile is deleted.
   */
  delete(id: string): Promise<void>;
}
