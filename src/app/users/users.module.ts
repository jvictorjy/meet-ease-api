import { Module } from '@nestjs/common';
import { CryptographyModule } from '@app/common/infrastructure/adapters/cryptography/cryptography.module';
import { PrismaUserRepository } from '@app/users/infrastructure/repositories/prisma-user.repository';
import { BcryptHasher } from '@app/common/infrastructure/adapters/cryptography/bcryptjs/bcrypt-hasher';
import { PrismaProfileRepository } from '@app/profiles/infrastructure/repositories/prisma-profile.repository';
import { UseCases } from '@app/users/application/use-cases';
import { Controllers } from '@app/users/interfaces/http/controllers';

@Module({
  imports: [CryptographyModule],
  controllers: [...Controllers],
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
    ...UseCases,
  ],
  exports: [],
})
export class UsersModule {}
