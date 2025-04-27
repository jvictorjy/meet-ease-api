import { Injectable } from '@nestjs/common';
import { Profile } from '@app/profiles/domain/entities/profile.entity';
import { ProfileModel } from '@app/profiles/domain/models/profile.model';

@Injectable()
export class ProfileAggregateMapper {
  async mapToAggregate(profileEntity: Profile): Promise<ProfileModel> {
    const profile = this.removeUnderscorePrefix(profileEntity);

    return {
      id: profile.id,
      name: profile.name,
      description: profile.description,
      role: profile.role,
      createdAt: profile.createdAt || new Date(),
      updatedAt: profile.updatedAt || new Date(),
    };
  }

  async mapCollection(profiles: Profile[]): Promise<ProfileModel[]> {
    return Promise.all(profiles.map((profile) => this.mapToAggregate(profile)));
  }

  private removeUnderscorePrefix(entity: Profile): Record<string, any> {
    if (!entity || typeof entity !== 'object') {
      return {};
    }

    return Object.entries(entity).reduce((cleaned, [key, value]) => {
      // Remove underscore from the beginning of the key
      const cleanKey = key.startsWith('_') ? key.substring(1) : key;
      cleaned[cleanKey] = value;
      return cleaned;
    }, {});
  }
}
