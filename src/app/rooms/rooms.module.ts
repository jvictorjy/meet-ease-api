import { Module } from '@nestjs/common';
import { Controllers } from '@app/rooms/interfaces/http/controllers';
import { UseCases } from '@app/rooms/application/use-cases';
import { PrismaRoomRepository } from '@app/rooms/infrastructure/persistence/prisma-room.repository';
import { RoomAggregateMapper } from '@app/rooms/domain/mappers/room-aggregate.mapper';
import { StorageModule } from '@app/@common/infrastructure/adapters/storage/storage.module';

@Module({
  imports: [StorageModule],
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
  ],
  exports: [RoomAggregateMapper],
})
export class RoomsModule {}
