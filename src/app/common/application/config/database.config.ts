import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@core/@shared/infrastructure/config/env.validation';

const configService = new ConfigService<EnvironmentVariables, true>(
  ConfigService,
);

const dialect = configService.get('DB_DIALECT');
const host = configService.get('DB_HOST');
const port = configService.get('DB_PORT');
const database = configService.get('DB_DATABASE');
const user = configService.get('DB_USER');
const pass = configService.get('DB_PASSWORD');

export const DATABASE_URL = `${dialect}://${user}:${pass}@${host}:${port}/${database}`;
