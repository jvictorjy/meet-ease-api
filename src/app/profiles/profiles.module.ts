import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common/infrastructure/adapters/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class ProfilesModule {}
