import { ProfileRepository } from '@app/profiles/domain/repositories/profile.repository';
import { Inject, Injectable } from '@nestjs/common';
import { Profile } from '@app/profiles/domain/entities/profile.entity';

/**
 * Use case for retrieving all profiles.
 *
 * This class handles the business logic for fetching all profiles
 * from the repository.
 */
@Injectable()
export class FindAllProfileUseCase {
  /**
   * Constructor for `FindAllProfileUseCase`.
   *
   * @param profileRepository - The repository responsible for managing profiles.
   */
  constructor(
    @Inject('ProfileRepository')
    private readonly profileRepository: ProfileRepository,
  ) {}

  /**
   * Executes the process of retrieving all profiles.
   *
   * @returns A promise that resolves to an array of profiles.
   */
  async execute(): Promise<Profile[]> {
    return this.profileRepository.findAll();
  }
}
