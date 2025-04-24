import { Module, Provider } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@core/@shared/infrastructure/config/env.validation';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from '@app/auth/infrastructure/jwt/jwt.guard';
import { CryptographyModule } from '@app/@common/infrastructure/adapters/cryptography/cryptography.module';
import { PrismaUserRepository } from '@app/users/infrastructure/persistence/prisma-user.repository';
import { BcryptHasher } from '@app/@common/infrastructure/adapters/cryptography/bcryptjs/bcrypt-hasher';
import { JwtEncrypter } from '@app/@common/infrastructure/adapters/cryptography/bcryptjs/jwt-encrypter';
import { UseCases } from '@app/auth/application/use-cases';
import { Controllers } from '@app/auth/interfaces/http/controllers';
import { JwtStrategy } from '@app/auth/infrastructure/jwt/jwt.strategy';

const configService = new ConfigService<EnvironmentVariables, true>(
  ConfigService,
);

const providers: Provider[] = [
  {
    provide: APP_GUARD,
    useClass: JwtGuard,
  },
];

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory() {
        const privateKey = configService.get('JWT_PRIVATE_KEY');
        const publicKey = configService.get('JWT_PUBLIC_KEY');

        return {
          signOptions: { expiresIn: '24h', algorithm: 'RS256' },
          privateKey: Buffer.from(privateKey, 'base64'),
          publicKey: Buffer.from(publicKey, 'base64'),
        };
      },
    }),
    CryptographyModule,
  ],
  controllers: [...Controllers],
  providers: [
    ...providers,
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
  ],
})
export class AuthModule {}
