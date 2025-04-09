import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './env.validation';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService =
    app.get<ConfigService<EnvironmentVariables, true>>(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('Delivery API')
    .setDescription('API for calculating delivery fees with margin')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);

  await app.listen(configService.get('PORT') ?? 3000);
}
bootstrap();
