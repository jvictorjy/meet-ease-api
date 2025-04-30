import { v4 as uuid } from 'uuid';
import { Room } from '@app/rooms/domain/entities/room.entity';
import { RoomLayout } from '@app/rooms/domain/entities/room-layout.entity';
import { RoomRepository } from '@app/rooms/domain/repositories/room.repository';
import { Inject, Injectable } from '@nestjs/common';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';
import { FileUploadService } from '@app/@common/infrastructure/services/file-upload.service';

export interface CreateRoomLayoutDto {
  description?: string;
  imageUrl: string;
}

export interface CreateRoomDto {
  name: string;
  description?: string;
  layout?: CreateRoomLayoutDto;
}

@Injectable()
export class CreateRoomUseCase {
  constructor(
    @Inject('RoomRepository')
    private readonly roomRepository: RoomRepository,

    @Inject('FileUploadService')
    private readonly fileUploadService: FileUploadService,
  ) {}

  async execute(
    payload: CreateRoomDto,
    file?: Express.Multer.File,
  ): Promise<void> {
    try {
      let imageUrl = '';
      if (file) {
        imageUrl = await this.fileUploadService.uploadFile(
          file,
          'room-layouts',
        );
      }

      const roomId = uuid();
      const now = new Date();

      const room = new Room(
        roomId,
        payload.name,
        payload.description ?? '',
        now,
        now,
        null,
      );

      await this.roomRepository.create(room);

      if (payload.layout) {
        const layout = new RoomLayout(
          uuid(),
          payload.layout.description ?? '',
          file ? imageUrl : '',
          roomId,
          now,
          now,
          null,
        );

        await this.roomRepository.addLayout(layout);
      }
    } catch (error) {
      if (error instanceof Exception) {
        throw error;
      }

      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: 'An unexpected error occurred while creating the room',
      });
    }
  }
}
