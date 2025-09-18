import { Inject, Injectable } from '@nestjs/common';
import { RoomRepository } from '@app/rooms/domain/repositories/room.repository';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { RoomLayoutModel } from '@app/rooms/domain/models/room.model';

@Injectable()
export class ListRoomLayoutsUseCase {
  constructor(
    @Inject('RoomRepository')
    private readonly roomRepository: RoomRepository,
  ) {}

  async execute(roomId: string): Promise<RoomLayoutModel[]> {
    try {
      const room = await this.roomRepository.findById(roomId);
      if (!room) {
        throw Exception.new({
          code: Code.NOT_FOUND.code,
          overrideMessage: `Room with ID ${roomId} not found`,
        });
      }

      const layouts = await this.roomRepository.findLayoutsByRoomId(roomId);
      return layouts.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    } catch (error) {
      if (error instanceof Exception) {
        throw error;
      }

      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage:
          'An unexpected error occurred while listing the room layouts',
      });
    }
  }
}
