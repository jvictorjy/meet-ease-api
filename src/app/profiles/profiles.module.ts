import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common/infrastructure/adapters/database/database.module';
import { PrismaProfileRepository } from '@app/profiles/infrastructure/repositories/prisma-profile.repository';
import { CreateProfileUseCase } from '@app/profiles/application/use-cases/create-profiele.use-case';
import { CreateProfileController } from '@app/profiles/interfaces/http/controllers/create-profile.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [CreateProfileController],
  providers: [
    {
      provide: 'ProfileRepository',
      useClass: PrismaProfileRepository,
    },
    CreateProfileUseCase,
  ],
})
export class ProfilesModule {}
