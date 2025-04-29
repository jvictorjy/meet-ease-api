import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ErrorSchema } from '@app/@common/application/documentations/openapi/swagger/error.schema';

import { ZodValidationPipe } from '@app/@common/application/pipes/zod-validation.pipe';
import { RefreshTokenUseCase } from '@app/auth/application/use-cases/refresh-token.use-case';

import { Public } from '@app/auth/infrastructure/jwt/public';
import { RefreshTokenSchemaValidators } from '@app/auth/application/validators/refresh-token.schema.validators';
import {
  RefreshTokenDto,
  RefreshTokenResponseDto,
} from '@app/auth/interfaces/http/dtos/refresh-token.dto';

@Controller('auth')
@ApiTags('Auth')
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
@ApiNotFoundResponse({ description: 'Not Found', type: ErrorSchema })
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
})
export class RefreshTokenController {
  constructor(private readonly refreshTokenUseCase: RefreshTokenUseCase) {}

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token refresh successful',
    type: RefreshTokenResponseDto,
  })
  @Public()
  @ApiBody({ type: RefreshTokenDto })
  async execute(
    @Body(new ZodValidationPipe(new RefreshTokenSchemaValidators()))
    data: RefreshTokenDto,
  ): Promise<RefreshTokenResponseDto> {
    return this.refreshTokenUseCase.execute(data);
  }
}
