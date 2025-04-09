import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from '@core/@shared/infrastructure/config/env.validation';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, validate })],
  controllers: [],
  providers: [],
})
export class MainModule {}
