import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@core/@shared/infrastructure/config/env.validation';
import { applySwagger } from '@app/@common/application/config';
import { Logger } from '@nestjs/common';
import { json, urlencoded } from 'express';

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.create(MainModule);

  const configService =
    app.get<ConfigService<EnvironmentVariables, true>>(ConfigService);

  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  app.enableShutdownHooks();

  applySwagger(app);

  await app.listen(configService.get('PORT') ?? 3000).then(() => {
    logger.log(
      `🚀 meet-ease-api is running in http://localhost:${configService.get(
        'PORT',
      )}`,
    );
  });
}
bootstrap();
