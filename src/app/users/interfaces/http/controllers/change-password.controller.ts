import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';
import { ZodValidationPipe } from '@app/@common/application/pipes/zod-validation.pipe';
import { UUIDSchemaValidation } from '@app/@common/application/validations';
import { ChangePasswordSchemaValidator } from '@app/users/application/validators/change-password-schema.validator';
import { ChangePasswordRequestDto } from '@app/users/interfaces/http/dtos/change-password.dto';
import { ChangePasswordUseCase } from '@app/users/application/use-cases/change-password.use-case';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ErrorSchema } from '@app/@common/application/documentations/openapi/swagger/error.schema';

@Controller('users')
@ApiTags('Users')
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
@ApiNotFoundResponse({ description: 'Not Found', type: ErrorSchema })
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
})
export class ChangePasswordController {
  constructor(private readonly useCase: ChangePasswordUseCase) {}

  @Patch(':id/password')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Change user password',
    description: 'Change user password',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Password changed' })
  @ApiBody({ type: ChangePasswordRequestDto })
  async handle(
    @Param('id', new ZodValidationPipe(new UUIDSchemaValidation())) id: string,
    @Body(new ZodValidationPipe(new ChangePasswordSchemaValidator()))
    body: ChangePasswordRequestDto,
  ) {
    await this.useCase.execute(id, body);
    return { message: 'Password changed' };
  }
}
