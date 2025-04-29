import { Module, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from '@core/@shared/infrastructure/config/env.validation';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import {
  HttpExceptionFilter,
  ZodValidationExceptionFilter,
} from '@app/@common/application/exceptions/filter';
import { MainController } from './main.controller';
import { UsersModule } from '@app/users/users.module';
import { ProfilesModule } from '@app/profiles/profiles.module';
import { AuthModule } from '@app/auth/auth.module';
import { AreasModule } from '@app/areas/areas.module';
import { JwtGuard } from '@app/auth/infrastructure/guards/jwt.guard';
import { RolesGuard } from '@app/auth/infrastructure/guards/roles.guard';
import { RoomsModule } from '@app/rooms/rooms.module';

const providers: Provider[] = [
  {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: ZodValidationExceptionFilter,
  },
  {
    provide: APP_GUARD,
    useClass: JwtGuard,
  },
  {
    provide: APP_GUARD,
    useClass: RolesGuard,
  },
];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),
    UsersModule,
    ProfilesModule,
    AuthModule,
    AreasModule,
    RoomsModule,
  ],
  controllers: [MainController],
  providers,
})
export class MainModule {}
