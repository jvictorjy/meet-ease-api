import { Module, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from '@core/@shared/infrastructure/config/env.validation';
import { APP_FILTER } from '@nestjs/core';
import {
  HttpExceptionFilter,
  ZodValidationExceptionFilter,
} from '@app/common/application/exceptions/filter';
import { MainController } from './main.controller';
import { UsersModule } from '@app/users/users.module';

const providers: Provider[] = [
  {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: ZodValidationExceptionFilter,
  },
];

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, validate }), UsersModule],
  controllers: [MainController],
  providers,
})
export class MainModule {}
