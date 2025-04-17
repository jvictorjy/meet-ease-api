import { CreateUserUseCase } from '@app/users/application/use-cases';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ZodValidationPipe } from '@app/common/application/pipes/zod-validation.pipe';
import { CreateUserSchemaValidation } from '@app/users/application/validators/create-user-schema.validation';
import { CreateUserRequestDto } from '@app/users/interfaces/http/dtos/create-user.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ErrorSchema } from '@app/common/application/documentations/openapi/swagger/error.schema';

@Controller('users')
@ApiTags('Users') // Swagger tag for grouping endpoints under "Profiles"
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema }) // Swagger response for 400 errors
@ApiNotFoundResponse({ description: 'Not Found', type: ErrorSchema }) // Swagger response for 404 errors
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
}) // Swagger response for 422 errors
export class CreateUserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED) // Sets the HTTP status code to 201
  @ApiOperation({
    summary: 'Create user', // Swagger summary for the endpoint
    description: 'Create user', // Swagger description for the endpoint
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Profile user', // Swagger response for 201 status
  })
  @ApiBody({ type: CreateUserRequestDto }) // Swagger body schema for the request
  async handle(
    @Body(new ZodValidationPipe(new CreateUserSchemaValidation()))
    body: CreateUserRequestDto,
  ) {
    return this.createUserUseCase.execute(body);
  }
}
