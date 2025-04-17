import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common/infrastructure/adapters/database/database.module';
import { CryptographyModule } from '@app/common/infrastructure/adapters/cryptography/cryptography.module';
import { CreateUserController } from '@app/users/interfaces/http/controllers';
import { PrismaUserRepository } from '@app/users/infrastructure/repositories/prisma-user.repository';
import { BcryptHasher } from '@app/common/infrastructure/adapters/cryptography/bcryptjs/bcrypt-hasher';
import { CreateUserUseCase } from '@app/users/application/use-cases';
import { PrismaProfileRepository } from '@app/profiles/infrastructure/repositories/prisma-profile.repository';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [CreateUserController],
  providers: [
    {
      provide: 'UserRepository',
      useClass: PrismaUserRepository,
    },
    {
      provide: 'ProfileRepository',
      useClass: PrismaProfileRepository,
    },
    {
      provide: 'HashGenerator',
      useClass: BcryptHasher,
    },
    CreateUserUseCase,
  ],
  exports: [],
})
export class UsersModule {}
