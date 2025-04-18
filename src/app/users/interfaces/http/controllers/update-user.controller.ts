import { UpdateUserUseCase } from '@app/users/application/use-cases/update-user.use-case';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';
import { ZodValidationPipe } from '@app/common/application/pipes/zod-validation.pipe';
import { UUIDSchemaValidation } from '@app/common/application/validations';
import { UpdateUserSchemaValidator } from '@app/users/application/validators/update-user-schema.validator';
import {
  UpdateUserRequestDto,
  UpdateUserResponseDto,
} from '@app/users/interfaces/http/dtos/update-user.dto';
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

/**
 * Controller for handling user update operations.
 * Provides an endpoint to update user details.
 */
@Controller('users')
@ApiTags('Users') // Groups endpoints under the "Users" tag in Swagger documentation
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema }) // Defines Swagger response for 400 errors
@ApiNotFoundResponse({ description: 'Not Found', type: ErrorSchema }) // Defines Swagger response for 404 errors
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
}) // Defines Swagger response for 422 errors
export class UpdateUserController {
  /**
   * Constructor for the UpdateUserController.
   * @param updateUserUseCase - The use case for updating a user.
   */
  constructor(private readonly updateUserUseCase: UpdateUserUseCase) {}

  /**
   * Handles the HTTP PATCH request to update a user.
   * @param id - The UUID of the user to update, validated using ZodValidationPipe.
   * @param body - The request body containing user update details, validated using ZodValidationPipe.
   * @returns The updated user data.
   */
  @Patch('/:id')
  @HttpCode(HttpStatus.OK) // Sets the HTTP status code to 200 for successful responses
  @ApiOperation({
    summary: 'Update user', // Provides a summary for the Swagger documentation
    description: 'Update user', // Provides a description for the Swagger documentation
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User updated', // Describes the 200 status response in Swagger
    type: UpdateUserResponseDto, // Defines the response schema in Swagger
  })
  @ApiBody({ type: UpdateUserRequestDto }) // Defines the request body schema in Swagger
  async handle(
    @Param('id', new ZodValidationPipe(new UUIDSchemaValidation())) id: string, // Validates the `id` parameter as a UUID
    @Body(new ZodValidationPipe(new UpdateUserSchemaValidator()))
    body: UpdateUserRequestDto, // Validates the request body against the UpdateUserSchemaValidator
  ) {
    return this.updateUserUseCase.execute(id, body); // Executes the update user use case
  }
}
