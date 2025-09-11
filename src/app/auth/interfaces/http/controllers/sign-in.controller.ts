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
import { SignInUseCase } from '@app/auth/application/use-cases/sign-in.use-case';

import { Public } from '@app/auth/infrastructure/jwt/public';
import { SignInSchemaValidators } from '@app/auth/application/validators/sign-in.schema.validators';
import {
  SignInDto,
  SignInResponseDto,
} from '@app/auth/interfaces/http/dtos/sign-in.dto';

@Controller('auth')
@ApiTags('Auth')
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
@ApiNotFoundResponse({ description: 'Not Found', type: ErrorSchema })
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
})
export class SignInController {
  constructor(private readonly signInUseCase: SignInUseCase) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Authentication successful',
    type: SignInResponseDto,
  })
  @Public()
  @ApiBody({ type: SignInDto })
  async execute(
    @Body(new ZodValidationPipe(new SignInSchemaValidators()))
    data: SignInDto,
  ): Promise<SignInResponseDto> {
    console.log(data);
    return this.signInUseCase.execute(data);
  }
}
