import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common/infrastructure/adapters/database/database.module';
import { PrismaProfileRepository } from '@app/profiles/infrastructure/repositories/prisma-profile.repository';
import { Controllers } from '@app/profiles/interfaces/http/controllers';
import { UseCases } from '@app/profiles/application/use-cases';

@Module({
  imports: [DatabaseModule],
  controllers: [...Controllers],
  providers: [
    {
      provide: 'ProfileRepository',
      useClass: PrismaProfileRepository,
    },
    ...UseCases,
  ],
})
export class ProfilesModule {}
