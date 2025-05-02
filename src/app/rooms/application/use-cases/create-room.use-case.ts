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
  layouts?: CreateRoomLayoutDto[];
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
    files?: Express.Multer.File[],
  ): Promise<void> {
    try {
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

      if (payload.layouts) {
        const layouts = payload.layouts;
        const dataLayouts: RoomLayout[] = [];

        for (let i = 0; i < layouts.length; i++) {
          const layout = layouts[i];
          let imageUrl = '';

          // Upload the file if it exists
          if (files && files[i]) {
            imageUrl = await this.fileUploadService.uploadFile(
              files[i],
              'room-layouts',
            );
          }

          const newLayout = new RoomLayout(
            uuid(),
            layout.description ?? '',
            imageUrl,
            roomId,
            now,
            now,
            null,
          );

          dataLayouts.push(newLayout);
        }

        await this.roomRepository.create(room, dataLayouts);
      } else {
        await this.roomRepository.create(room);
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
