import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBadRequestResponse, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ErrorSchema } from '@app/@common/application/documentations/openapi/swagger/error.schema';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@core/@shared/infrastructure/config/env.validation';
import { Public } from '@app/auth/infrastructure/jwt/public';

const configService = new ConfigService<EnvironmentVariables, true>(
  ConfigService,
);

@ApiTags('Default')
@Controller({
  version: '1',
})
@ApiBadRequestResponse({ description: 'Bad Request' })
export class MainController {
  @Get('healthcheck')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: ErrorSchema })
  execute(): { status: string } {
    return {
      status: `[${configService.get('NODE_ENV')}] meet-ease-api is online`,
    };
  }
}
