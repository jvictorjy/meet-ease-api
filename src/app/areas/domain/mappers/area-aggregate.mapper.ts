import { Injectable } from '@nestjs/common';
import { Area } from '@app/areas/domain/entities/area.entity';
import { AreaModel } from '@app/areas/domain/models/area.model';

@Injectable()
export class AreaAggregateMapper {
  async mapToAggregate(areaEntity: Area): Promise<AreaModel> {
    const area = this.removeUnderscorePrefix(areaEntity);

    return {
      id: area.id,
      name: area.name,
      description: area.description,
      parent_id: area.parent_id,
      createdAt: area.createdAt || new Date(),
      updatedAt: area.updatedAt || new Date(),
      deletedAt: area.deletedAt || null,
    };
  }

  async mapCollection(areas: Area[]): Promise<AreaModel[]> {
    return Promise.all(areas.map((area) => this.mapToAggregate(area)));
  }

  private removeUnderscorePrefix(entity: Area): Record<string, any> {
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
