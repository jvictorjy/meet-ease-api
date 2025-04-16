import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common/infrastructure/adapters/database/database.module';
import { PrismaProfileRepository } from '@app/profiles/infrastructure/repositories/prisma-profile.repository';
import {
  CreateProfileController,
  UpdateProfileController,
} from '@app/profiles/interfaces/http/controllers';
import {
  CreateProfileUseCase,
  UpdateProfileUseCase,
} from '@app/profiles/application/use-cases';

@Module({
  imports: [DatabaseModule],
  controllers: [CreateProfileController, UpdateProfileController],
  providers: [
    {
      provide: 'ProfileRepository',
      useClass: PrismaProfileRepository,
    },
    CreateProfileUseCase,
    UpdateProfileUseCase,
  ],
})
export class ProfilesModule {}
