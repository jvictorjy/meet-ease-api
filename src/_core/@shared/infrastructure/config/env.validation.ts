import {
  plainToInstance,
  Transform,
  TransformFnParams,
} from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, validateSync } from 'class-validator';

const transform = {
  toInt: ({ value }: TransformFnParams) => parseInt(value),
};

export class EnvironmentVariables {
  @IsNotEmpty()
  @IsString()
  NODE_ENV: string;

  @IsNotEmpty()
  @IsString()
  API_HOST: string;

  @IsNotEmpty()
  @IsString()
  API_LOG_ENABLE: string;

  @IsNotEmpty()
  @Transform(transform.toInt)
  @IsInt()
  PORT: number;

  @IsNotEmpty()
  @IsString()
  JWT_SECRET: string;

  @IsNotEmpty()
  @IsString()
  JWT_PRIVATE_KEY: string;

  @IsNotEmpty()
  @IsString()
  JWT_PUBLIC_KEY: string;

  @IsNotEmpty()
  @IsString()
  DB_DIALECT: string;

  @IsNotEmpty()
  @IsString()
  DB_HOST: string;

  @IsNotEmpty()
  @Transform(transform.toInt)
  @IsInt()
  DB_PORT: number;

  @IsNotEmpty()
  @IsString()
  DB_USER: string;

  @IsNotEmpty()
  @IsString()
  DB_PASSWORD: string;

  @IsNotEmpty()
  @IsString()
  DB_DATABASE: string;

  @IsNotEmpty()
  @IsString()
  DB_LOGGING: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: false,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
