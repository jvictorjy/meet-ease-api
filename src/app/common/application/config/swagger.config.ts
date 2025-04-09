import type { INestApplication } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import type { SwaggerCustomOptions } from '@nestjs/swagger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@core/@shared/infrastructure/config/env.validation';

const logger = new Logger('Swagger');

const configService = new ConfigService<EnvironmentVariables, true>(
  ConfigService,
);

export const applySwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Meet Ease API')
    .setDescription('API to room reservation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  const theme = new SwaggerTheme();
  const customOptions: SwaggerCustomOptions = {
    customSiteTitle: 'Meet Ease Docs',
    customCss: theme.getBuffer(SwaggerThemeNameEnum.ONE_DARK),
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      defaultModelsExpandDepth: -1,
    },
  };
  SwaggerModule.setup('api-doc', app, document, customOptions);

  logger.log(
    `📄 Documentation is running in http://localhost:${configService.get('PORT')}/api-doc`,
  );
};
