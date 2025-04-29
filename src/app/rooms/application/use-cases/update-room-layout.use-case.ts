import { RoomLayout } from '@app/rooms/domain/entities/room-layout.entity';
import { RoomRepository } from '@app/rooms/domain/repositories/room.repository';
import { Inject, Injectable } from '@nestjs/common';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';

export interface UpdateRoomLayoutDto {
  id: string;
  description?: string;
  imageUrl?: string;
}

@Injectable()
export class UpdateRoomLayoutUseCase {
  constructor(
    @Inject('RoomRepository')
    private readonly roomRepository: RoomRepository,
  ) {}

  async execute(payload: UpdateRoomLayoutDto): Promise<void> {
    try {
      const existingLayout = await this.roomRepository.findLayoutById(
        payload.id,
      );

      if (!existingLayout) {
        throw Exception.new({
          code: Code.NOT_FOUND.code,
          overrideMessage: `Room layout with ID ${payload.id} not found`,
        });
      }

      const layout = new RoomLayout(
        existingLayout.id,
        payload.description ?? existingLayout.description,
        payload.imageUrl ?? existingLayout.imageUrl,
        existingLayout.roomId,
        existingLayout.createdAt,
        new Date(),
        existingLayout.deletedAt,
      );

      await this.roomRepository.updateLayout(layout);
    } catch (error) {
      if (error instanceof Exception) {
        throw error;
      }

      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage:
          'An unexpected error occurred while updating the room layout',
      });
    }
  }
}
