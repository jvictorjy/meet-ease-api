import { v4 as uuid } from 'uuid';
import { RoomLayout } from '@app/rooms/domain/entities/room-layout.entity';
import { RoomRepository } from '@app/rooms/domain/repositories/room.repository';
import { Inject, Injectable } from '@nestjs/common';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { FileUploadService } from '@app/@common/infrastructure/services/file-upload.service';

export interface IAddRoomLayoutDto {
  roomId: string;
  description?: string;
}

@Injectable()
export class AddRoomLayoutUseCase {
  constructor(
    @Inject('RoomRepository')
    private readonly roomRepository: RoomRepository,

    @Inject('FileUploadService')
    private readonly fileUploadService: FileUploadService,
  ) {}

  async execute(
    payload: IAddRoomLayoutDto,
    file: Express.Multer.File,
  ): Promise<void> {
    try {
      const room = await this.roomRepository.findById(payload.roomId);

      if (!room) {
        throw Exception.new({
          code: Code.NOT_FOUND.code,
          overrideMessage: `Room with ID ${payload.roomId} not found`,
        });
      }

      const imageUrl = await this.fileUploadService.uploadFile(
        file,
        payload.roomId,
      );

      const layout = new RoomLayout(
        uuid(),
        payload.description ?? '',
        imageUrl,
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
