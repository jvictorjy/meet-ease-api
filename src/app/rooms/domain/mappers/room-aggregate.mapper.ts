import { Injectable } from '@nestjs/common';
import { Room } from '@app/rooms/domain/entities/room.entity';
import { RoomLayout } from '@app/rooms/domain/entities/room-layout.entity';
import {
  RoomModel,
  RoomLayoutModel,
} from '@app/rooms/domain/models/room.model';

@Injectable()
export class RoomAggregateMapper {
  async mapToAggregate(
    roomEntity: Room,
    layouts: RoomLayout[] = [],
  ): Promise<RoomModel> {
    const room = this.removeUnderscorePrefix(roomEntity);
    const mappedLayouts = await this.mapLayoutCollection(layouts);

    return {
      id: room.id,
      name: room.name,
      description: room.description,
      max_capacity: room.maxCapacity,
      opening_time: room.openingTime,
      closing_time: room.closingTime,
      createdAt: room.createdAt || new Date(),
      updatedAt: room.updatedAt || new Date(),
      deletedAt: room.deletedAt,
      layouts: mappedLayouts,
    };
  }

  async mapCollection(
    rooms: Room[],
    layoutsMap: Record<string, RoomLayout[]> = {},
  ): Promise<RoomModel[]> {
    return Promise.all(
      rooms.map((room) => this.mapToAggregate(room, layoutsMap[room.id] || [])),
    );
  }

  async mapLayoutToAggregate(
    layoutEntity: RoomLayout,
  ): Promise<RoomLayoutModel> {
    const layout = this.removeUnderscorePrefix(layoutEntity);

    return {
      id: layout.id,
      description: layout.description,
      imageUrl: layout.imageUrl,
      roomId: layout.roomId,
      createdAt: layout.createdAt || new Date(),
      updatedAt: layout.updatedAt || new Date(),
      deletedAt: layout.deletedAt,
    };
  }

  async mapLayoutCollection(layouts: RoomLayout[]): Promise<RoomLayoutModel[]> {
    return Promise.all(
      layouts.map((layout) => this.mapLayoutToAggregate(layout)),
    );
  }

  private removeUnderscorePrefix(
    entity: Room | RoomLayout,
  ): Record<string, any> {
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
