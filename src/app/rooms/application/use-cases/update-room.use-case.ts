import { Room } from '@app/rooms/domain/entities/room.entity';
import { RoomRepository } from '@app/rooms/domain/repositories/room.repository';
import { Inject, Injectable } from '@nestjs/common';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';

export interface UpdateRoomDto {
  id: string;
  name?: string;
  description?: string;
  max_capacity: number;
  opening_time: string;
  closing_time: string;
}

@Injectable()
export class UpdateRoomUseCase {
  constructor(
    @Inject('RoomRepository')
    private readonly roomRepository: RoomRepository,
  ) {}

  async execute(payload: UpdateRoomDto): Promise<void> {
    try {
      const existingRoom = await this.roomRepository.findById(payload.id);

      if (!existingRoom) {
        throw Exception.new({
          code: Code.NOT_FOUND.code,
          overrideMessage: `Room with ID ${payload.id} not found`,
        });
      }

      const room = new Room(
        existingRoom.id,
        payload.name ?? existingRoom.name,
        payload.description ?? existingRoom.description,
        payload.max_capacity ?? existingRoom.max_capacity,
        payload.opening_time ?? existingRoom.opening_time,
        payload.closing_time ?? existingRoom.closing_time,
        existingRoom.createdAt,
        new Date(),
        existingRoom.deletedAt,
      );

      await this.roomRepository.update(room);
    } catch (error) {
      if (error instanceof Exception) {
        throw error;
      }

      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: 'An unexpected error occurred while updating the room',
      });
    }
  }
}
