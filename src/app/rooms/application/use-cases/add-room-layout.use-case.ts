import { v4 as uuid } from 'uuid';
import { RoomLayout } from '@app/rooms/domain/entities/room-layout.entity';
import { RoomRepository } from '@app/rooms/domain/repositories/room.repository';
import { Inject, Injectable } from '@nestjs/common';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';

export interface AddRoomLayoutDto {
  roomId: string;
  description?: string;
  imageUrl: string;
}

@Injectable()
export class AddRoomLayoutUseCase {
  constructor(
    @Inject('RoomRepository')
    private readonly roomRepository: RoomRepository,
  ) {}

  async execute(payload: AddRoomLayoutDto): Promise<void> {
    try {
      const room = await this.roomRepository.findById(payload.roomId);

      if (!room) {
        throw Exception.new({
          code: Code.NOT_FOUND.code,
          overrideMessage: `Room with ID ${payload.roomId} not found`,
        });
      }

      const layout = new RoomLayout(
        uuid(), // Generates a unique ID for the layout
        payload.description ?? '',
        payload.imageUrl,
        payload.roomId,
        new Date(),
        new Date(),
        null,
      );

      await this.roomRepository.addLayout(layout);
    } catch (error) {
      if (error instanceof Exception) {
        throw error;
      }

      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage:
          'An unexpected error occurred while adding the room layout',
      });
    }
  }
}
