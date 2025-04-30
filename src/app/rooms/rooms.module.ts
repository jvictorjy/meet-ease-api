import { Module } from '@nestjs/common';
import { Controllers } from '@app/rooms/interfaces/http/controllers';
import { UseCases } from '@app/rooms/application/use-cases';
import { PrismaRoomRepository } from '@app/rooms/infrastructure/persistence/prisma-room.repository';
import { RoomAggregateMapper } from '@app/rooms/domain/mappers/room-aggregate.mapper';
import { FileUploadModule } from '@app/@common/infrastructure/services/file-upload.module';
import { FileUploadService } from '@app/@common/infrastructure/services/file-upload.service';
import { S3StorageService } from '@app/@common/infrastructure/adapters/storage/s3-storage.service';

@Module({
  imports: [FileUploadModule],
  controllers: [...Controllers],
  providers: [
    ...UseCases,
    RoomAggregateMapper,
    {
      provide: 'RoomRepository',
      useClass: PrismaRoomRepository,
    },
    {
      provide: 'RoomAggregateMapper',
      useClass: RoomAggregateMapper,
    },
    {
      provide: 'FileUploadService',
      useClass: FileUploadService,
    },
    {
      provide: 'StorageService',
      useClass: S3StorageService,
    },
  ],
  exports: [RoomAggregateMapper],
})
export class RoomsModule {}
