import { Module } from '@nestjs/common';
import { PrismaProfileRepository } from '@app/profiles/infrastructure/persistence/prisma-profile.repository';
import { Controllers } from '@app/profiles/interfaces/http/controllers';
import { UseCases } from '@app/profiles/application/use-cases';
import { ProfileAggregateMapper } from '@app/profiles/domain/mappers/profile-aggregate.mapper';

@Module({
  imports: [],
  controllers: [...Controllers],
  providers: [
    ...UseCases,
    ProfileAggregateMapper,
    {
      provide: 'ProfileRepository',
      useClass: PrismaProfileRepository,
    },
    {
      provide: 'ProfileAggregateMapper',
      useClass: ProfileAggregateMapper,
    },
  ],
})
export class ProfilesModule {}
