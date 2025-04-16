/**
 * Represents a profile entity.
 *
 * This class defines the structure and behavior of a profile, including
 * its properties and methods for updating the description and checking roles.
 */
export class Profile {
  /**
   * Constructs a new `Profile` instance.
   *
   * @param id - The unique identifier of the profile.
   * @param role - The role associated with the profile.
   * @param description - A description of the profile, which can be null.
   * @param created_at - The date and time when the profile was created.
   * @param updated_at - The date and time when the profile was last updated.
   */
  constructor(
    public readonly id: string,
    public role: string,
    public description: string | null,
    public created_at: Date,
    public updated_at: Date,
  ) {}

  /**
   * Updates the description of the profile.
   *
   * @param newDescription - The new description to set for the profile. Can be null.
   */
  updateDescription(newDescription: string | null) {
    this.description = newDescription;
  }

  /**
   * Checks if the profile has the specified role.
   *
   * @param role - The role to check against the profile's role.
   * @returns `true` if the profile has the specified role, otherwise `false`.
   */
  hasRole(role: string): boolean {
    return this.role === role;
  }
}
