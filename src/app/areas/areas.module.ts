import { Module } from '@nestjs/common';
import { Controllers } from '@app/areas/interfaces/http/controllers';
import { UseCases } from '@app/areas/application/use-cases';
import { PrismaAreaRepository } from '@app/areas/infrastructure/persistence/prisma-area.repository';
import { AreaAggregateMapper } from '@app/areas/domain/mappers/area-aggregate.mapper';

@Module({
  controllers: [...Controllers],
  providers: [
    ...UseCases,
    AreaAggregateMapper,
    {
      provide: 'AreaRepository',
      useClass: PrismaAreaRepository,
    },
    {
      provide: 'AreaAggregateMapper',
      useClass: AreaAggregateMapper,
    },
  ],
  exports: [AreaAggregateMapper],
})
export class AreasModule {}
