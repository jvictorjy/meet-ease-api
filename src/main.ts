import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@core/@shared/infrastructure/config/env.validation';
import { applySwagger } from '@app/@common/application/config';
import { Logger } from '@nestjs/common';

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.create(MainModule);

  const configService =
    app.get<ConfigService<EnvironmentVariables, true>>(ConfigService);

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
