import { Module } from '@nestjs/common';
import { BcryptHasher } from '@app/@common/infrastructure/adapters/cryptography/bcryptjs/bcrypt-hasher';
import { JwtEncrypter } from '@app/@common/infrastructure/adapters/cryptography/bcryptjs/jwt-encrypter';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [BcryptHasher, JwtEncrypter, JwtService],
  exports: [BcryptHasher, JwtEncrypter, JwtService],
})
export class CryptographyModule {}
