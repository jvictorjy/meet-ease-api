import { Module } from '@nestjs/common';
import { CryptographyModule } from '@app/@common/infrastructure/adapters/cryptography/cryptography.module';
import { PrismaUserRepository } from '@app/users/infrastructure/persistence/prisma-user.repository';
import { BcryptHasher } from '@app/@common/infrastructure/adapters/cryptography/bcryptjs/bcrypt-hasher';
import { PrismaProfileRepository } from '@app/profiles/infrastructure/persistence/prisma-profile.repository';
import { UseCases } from '@app/users/application/use-cases';
import { Controllers } from '@app/users/interfaces/http/controllers';
import { ProfileAggregateMapper } from '@app/profiles/domain/mappers/profile-aggregate.mapper';
import { UserAggregateMapper } from '@app/users/domain/mappers/user-aggregate.mapper';

@Module({
  imports: [CryptographyModule],
  controllers: [...Controllers],
  providers: [
    ...UseCases,
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
    {
      provide: 'ProfileAggregateMapper',
      useClass: ProfileAggregateMapper,
    },
    {
      provide: 'UserAggregateMapper',
      useClass: UserAggregateMapper,
    },
  ],
  exports: [],
})
export class UsersModule {}
