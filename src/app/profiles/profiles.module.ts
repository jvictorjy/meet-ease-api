import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common/infrastructure/adapters/database/database.module';
import { PrismaProfileRepository } from '@app/profiles/infrastructure/repositories/prisma-profile.repository';
import {
  CreateProfileController,
  FindAllProfileController,
  GetProfileController,
  UpdateProfileController,
} from '@app/profiles/interfaces/http/controllers';
import {
  CreateProfileUseCase,
  FindAllProfileUseCase,
  GetProfileUseCase,
  UpdateProfileUseCase,
} from '@app/profiles/application/use-cases';

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateProfileController,
    UpdateProfileController,
    FindAllProfileController,
    GetProfileController,
  ],
  providers: [
    {
      provide: 'ProfileRepository',
      useClass: PrismaProfileRepository,
    },
    CreateProfileUseCase,
    UpdateProfileUseCase,
    FindAllProfileUseCase,
    GetProfileUseCase,
  ],
})
export class ProfilesModule {}
