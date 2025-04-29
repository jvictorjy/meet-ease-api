import { Module, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from '@core/@shared/infrastructure/config/env.validation';
import { APP_FILTER } from '@nestjs/core';
import {
  HttpExceptionFilter,
  ZodValidationExceptionFilter,
} from '@app/@common/application/exceptions/filter';
import { MainController } from './main.controller';
import { UsersModule } from '@app/users/users.module';
import { ProfilesModule } from '@app/profiles/profiles.module';
import { AuthModule } from '@app/auth/auth.module';
import { AreasModule } from '@app/areas/areas.module';

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
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),
    UsersModule,
    ProfilesModule,
    AuthModule,
    AreasModule,
  ],
  controllers: [MainController],
  providers,
})
export class MainModule {}
