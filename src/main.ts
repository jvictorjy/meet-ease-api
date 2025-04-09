import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EnvironmentVariables } from '@core/@shared/infrastructure/config/env.validation';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);

  const configService =
    app.get<ConfigService<EnvironmentVariables, true>>(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('Meet Ease API')
    .setDescription('API to make room reservations')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);

  await app.listen(configService.get('PORT') ?? 3000).then(() => {
    console.log(
      `🚀 meet-ease-api is running in http://localhost:${configService.get(
        'PORT',
      )}`,
    );
  });
}
bootstrap();
