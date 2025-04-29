import { RoomRepository } from '@app/rooms/domain/repositories/room.repository';
import { RoomModel } from '@app/rooms/domain/models/room.model';
import { Inject, Injectable } from '@nestjs/common';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';

@Injectable()
export class GetRoomUseCase {
  constructor(
    @Inject('RoomRepository')
    private readonly roomRepository: RoomRepository,
  ) {}

  async execute(id: string): Promise<RoomModel> {
    try {
      const room = await this.roomRepository.findById(id);

      if (!room) {
        throw Exception.new({
          code: Code.NOT_FOUND.code,
          overrideMessage: `Room with ID ${id} not found`,
        });
      }

      return room;
    } catch (error) {
      if (error instanceof Exception) {
        throw error;
      }

      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage:
          'An unexpected error occurred while retrieving the room',
      });
    }
  }
}
