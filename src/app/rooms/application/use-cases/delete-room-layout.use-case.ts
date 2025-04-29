import { RoomRepository } from '@app/rooms/domain/repositories/room.repository';
import { Inject, Injectable } from '@nestjs/common';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';

@Injectable()
export class DeleteRoomLayoutUseCase {
  constructor(
    @Inject('RoomRepository')
    private readonly roomRepository: RoomRepository,
  ) {}

  async execute(id: string): Promise<void> {
    try {
      const layout = await this.roomRepository.findLayoutById(id);

      if (!layout) {
        throw Exception.new({
          code: Code.NOT_FOUND.code,
          overrideMessage: `Room layout with ID ${id} not found`,
        });
      }

      await this.roomRepository.deleteLayout(id);
    } catch (error) {
      if (error instanceof Exception) {
        throw error;
      }

      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage:
          'An unexpected error occurred while deleting the room layout',
      });
    }
  }
}
