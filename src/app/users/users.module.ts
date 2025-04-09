import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common/infrastructure/adapters/database/database.module';
import { CryptographyModule } from '@app/common/infrastructure/adapters/cryptography/cryptography.module';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class UsersModule {}
