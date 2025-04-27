import { User } from '@app/users/domain/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { UserModel } from '@app/users/domain/models/user.model';

@Injectable()
export class UserAggregateMapper {
  async mapToAggregate(userEntity: User): Promise<UserModel> {
    const user = this.removeUnderscorePrefix(userEntity);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profile: user.profile,
      createdAt: user.createdAt || new Date(),
      updatedAt: user.updatedAt || new Date(),
    };
  }

  async mapCollection(users: User[]): Promise<UserModel[]> {
    return Promise.all(users.map((user) => this.mapToAggregate(user)));
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
