import { PrismaClient } from '@prisma/client';
import { Room } from '@app/rooms/domain/entities/room.entity';
import { RoomLayout } from '@app/rooms/domain/entities/room-layout.entity';
import { RoomRepository } from '@app/rooms/domain/repositories/room.repository';
import { RoomAggregateMapper } from '@app/rooms/domain/mappers/room-aggregate.mapper';
import {
  RoomModel,
  RoomLayoutModel,
} from '@app/rooms/domain/models/room.model';
import { Inject, Injectable } from '@nestjs/common';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';

@Injectable()
export class PrismaRoomRepository implements RoomRepository {
  private readonly prisma = new PrismaClient();

  constructor(
    @Inject('RoomAggregateMapper')
    private readonly mapper: RoomAggregateMapper,
  ) {}

  async create(room: Room): Promise<void> {
    try {
      await this.prisma.room.create({
        data: {
          id: room.id,
          name: room.name,
          description: room.description,
          created_at: room.createdAt,
          updated_at: room.updatedAt,
          deleted_at: room.deletedAt,
        },
      });
    } catch (error) {
      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: error.message,
      });
    }
  }

  async update(room: Room): Promise<void> {
    try {
      await this.prisma.room.update({
        where: { id: room.id },
        data: {
          name: room.name,
          description: room.description,
          updated_at: new Date(),
        },
      });
    } catch (error) {
      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: error.message,
      });
    }
  }

  async findById(id: string): Promise<RoomModel | null> {
    try {
      const roomData = await this.prisma.room.findUnique({
        where: { id },
      });

      if (!roomData) {
        return null;
      }

      const layouts = await this.prisma.roomLayout.findMany({
        where: { room_id: id, deleted_at: null },
      });

      const roomEntity = new Room(
        roomData.id,
        roomData.name,
        roomData.description || '',
        roomData.created_at,
        roomData.updated_at,
        roomData.deleted_at,
      );

      const layoutEntities = layouts.map(
        (layout) =>
          new RoomLayout(
            layout.id,
            layout.description || '',
            layout.image_url,
            layout.room_id,
            layout.created_at,
            layout.updated_at,
            layout.deleted_at,
          ),
      );

      return this.mapper.mapToAggregate(roomEntity, layoutEntities);
    } catch (error) {
      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: error.message,
      });
    }
  }

  async findAll(): Promise<RoomModel[]> {
    try {
      const roomsData = await this.prisma.room.findMany({
        where: { deleted_at: null },
      });

      const roomIds = roomsData.map((room) => room.id);
      const layoutsData = await this.prisma.roomLayout.findMany({
        where: { room_id: { in: roomIds }, deleted_at: null },
      });

      const layoutsByRoomId: Record<string, any[]> = {};
      layoutsData.forEach((layout) => {
        if (!layoutsByRoomId[layout.room_id]) {
          layoutsByRoomId[layout.room_id] = [];
        }
        layoutsByRoomId[layout.room_id].push(layout);
      });

      const roomEntities = roomsData.map(
        (room) =>
          new Room(
            room.id,
            room.name,
            room.description || '',
            room.created_at,
            room.updated_at,
            room.deleted_at,
          ),
      );

      const layoutEntitiesByRoomId: Record<string, RoomLayout[]> = {};
      Object.entries(layoutsByRoomId).forEach(([roomId, layouts]) => {
        layoutEntitiesByRoomId[roomId] = layouts.map(
          (layout) =>
            new RoomLayout(
              layout.id,
              layout.description || '',
              layout.image_url,
              layout.room_id,
              layout.created_at,
              layout.updated_at,
              layout.deleted_at,
            ),
        );
      });

      return this.mapper.mapCollection(roomEntities, layoutEntitiesByRoomId);
    } catch (error) {
      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: error.message,
      });
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.room.update({
        where: { id },
        data: {
          deleted_at: new Date(),
        },
      });
    } catch (error) {
      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: error.message,
      });
    }
  }

  async addLayout(layout: RoomLayout): Promise<void> {
    try {
      await this.prisma.roomLayout.create({
        data: {
          id: layout.id,
          description: layout.description,
          image_url: layout.imageUrl,
          room_id: layout.roomId,
          created_at: layout.createdAt,
          updated_at: layout.updatedAt,
          deleted_at: layout.deletedAt,
        },
      });
    } catch (error) {
      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: error.message,
      });
    }
  }

  async updateLayout(layout: RoomLayout): Promise<void> {
    try {
      await this.prisma.roomLayout.update({
        where: { id: layout.id },
        data: {
          description: layout.description,
          image_url: layout.imageUrl,
          updated_at: new Date(),
        },
      });
    } catch (error) {
      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: error.message,
      });
    }
  }

  async deleteLayout(id: string): Promise<void> {
    try {
      await this.prisma.roomLayout.update({
        where: { id },
        data: {
          deleted_at: new Date(),
        },
      });
    } catch (error) {
      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: error.message,
      });
    }
  }

  async findLayoutById(id: string): Promise<RoomLayoutModel | null> {
    try {
      const layoutData = await this.prisma.roomLayout.findUnique({
        where: { id },
      });

      if (!layoutData) {
        return null;
      }

      const layoutEntity = new RoomLayout(
        layoutData.id,
        layoutData.description || '',
        layoutData.image_url,
        layoutData.room_id,
        layoutData.created_at,
        layoutData.updated_at,
        layoutData.deleted_at,
      );

      return this.mapper.mapLayoutToAggregate(layoutEntity);
    } catch (error) {
      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: error.message,
      });
    }
  }

  async findLayoutsByRoomId(roomId: string): Promise<RoomLayoutModel[]> {
    try {
      const layoutsData = await this.prisma.roomLayout.findMany({
        where: { room_id: roomId, deleted_at: null },
      });

      const layoutEntities = layoutsData.map(
        (layout) =>
          new RoomLayout(
            layout.id,
            layout.description || '',
            layout.image_url,
            layout.room_id,
            layout.created_at,
            layout.updated_at,
            layout.deleted_at,
          ),
      );

      return this.mapper.mapLayoutCollection(layoutEntities);
    } catch (error) {
      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: error.message,
      });
    }
  }
}
