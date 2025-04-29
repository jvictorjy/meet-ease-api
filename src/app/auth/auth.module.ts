import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@core/@shared/infrastructure/config/env.validation';
import { CryptographyModule } from '@app/@common/infrastructure/adapters/cryptography/cryptography.module';
import { PrismaUserRepository } from '@app/users/infrastructure/persistence/prisma-user.repository';
import { BcryptHasher } from '@app/@common/infrastructure/adapters/cryptography/bcryptjs/bcrypt-hasher';
import { JwtEncrypter } from '@app/@common/infrastructure/adapters/cryptography/bcryptjs/jwt-encrypter';
import { UseCases } from '@app/auth/application/use-cases';
import { Controllers } from '@app/auth/interfaces/http/controllers';
import { JwtStrategy } from '@app/auth/infrastructure/jwt/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '@app/auth/application/services/auth.service';
import { PrismaProfileRepository } from '@app/profiles/infrastructure/persistence/prisma-profile.repository';
import { ProfileAggregateMapper } from '@app/profiles/domain/mappers/profile-aggregate.mapper';
import { UserAggregateMapper } from '@app/users/domain/mappers/user-aggregate.mapper';

const configService = new ConfigService<EnvironmentVariables, true>(
  ConfigService,
);

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      global: true,
      useFactory() {
        const privateKey = configService.get('JWT_PRIVATE_KEY');
        const publicKey = configService.get('JWT_PUBLIC_KEY');

        return {
          signOptions: {
            expiresIn: configService.get('JWT_EXPIRES_IN'),
            algorithm: 'RS256',
          },
          privateKey: Buffer.from(privateKey, 'base64'),
          publicKey: Buffer.from(publicKey, 'base64'),
        };
      },
    }),
    CryptographyModule,
  ],
  controllers: [...Controllers],
  providers: [
    ...UseCases,
    JwtStrategy,
    {
      provide: 'UserRepository',
      useClass: PrismaUserRepository,
    },
    {
      provide: 'HashComparer',
      useClass: BcryptHasher,
    },
    {
      provide: 'Encrypter',
      useClass: JwtEncrypter,
    },
    {
      provide: 'AuthService',
      useClass: AuthService,
    },
    {
      provide: 'ProfileRepository',
      useClass: PrismaProfileRepository,
    },
    {
      provide: 'JwtService',
      useClass: JwtService,
    },
    {
      provide: 'ConfigService',
      useClass: ConfigService,
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
})
export class AuthModule {}
