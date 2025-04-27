import { User } from '@app/users/domain/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { UserModel } from '@app/users/domain/models/user.model';
import { Profile } from '@app/profiles/domain/entities/profile.entity';

@Injectable()
export class UserAggregateMapper {
  async mapToAggregate(
    userEntity: User,
    profileEntity: Profile,
  ): Promise<UserModel> {
    const user = this.removeUnderscorePrefix(userEntity);
    const profile = this.removeUnderscorePrefix(profileEntity);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profile,
      createdAt: user.created_at ?? new Date(),
      updatedAt: user.updated_at ?? new Date(),
    };
  }

  async mapCollection(users: any[]): Promise<any[]> {
    return users.map((user) => this.mapToAggregate(user, user.profile));
  }

  private removeUnderscorePrefix(entity: any): Record<string, any> {
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
