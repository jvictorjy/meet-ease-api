import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateProfileUseCase } from '@app/profiles/application/use-cases/create-profiele.use-case';
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
import { CreateProfileDtoSwagger } from '@app/profiles/interfaces/http/dtos/profile-request.dto';
import { ZodValidationPipe } from '@app/common/application/pipes/zod-validation.pipe';
import { CreateProfileSchemaValidator } from '@app/profiles/application/validators/create-profile-schema.validator';

/**
 * Controller for handling profile creation requests.
 *
 * This controller provides an endpoint to create a new profile.
 * It validates the request body using Zod schema validation and
 * delegates the creation logic to the `CreateProfileUseCase`.
 */
@Controller('profiles')
@ApiTags('Profiles') // Swagger tag for grouping endpoints under "Profiles"
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema }) // Swagger response for 400 errors
@ApiNotFoundResponse({ description: 'Not Found', type: ErrorSchema }) // Swagger response for 404 errors
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
}) // Swagger response for 422 errors
export class CreateProfileController {
  /**
   * Constructor for `CreateProfileController`.
   *
   * @param createProfileUseCase - The use case responsible for creating profiles.
   */
  constructor(private readonly createProfileUseCase: CreateProfileUseCase) {}

  /**
   * Handles the creation of a new profile.
   *
   * @param body - The request body containing the profile details.
   *   - `id`: The ID of the user creating the profile.
   *   - `role`: The role of the profile (e.g., admin, user).
   *   - `description`: An optional description for the profile.
   *
   * @returns The created profile.
   *
   * @throws {BadRequestException} If the request body is invalid.
   * @throws {NotFoundException} If the user is not found.
   * @throws {UnprocessableEntityException} If the profile cannot be created.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED) // Sets the HTTP status code to 201
  @ApiOperation({
    summary: 'Create profile', // Swagger summary for the endpoint
    description: 'Create profile', // Swagger description for the endpoint
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Profile created', // Swagger response for 201 status
  })
  @ApiBody({ type: CreateProfileDtoSwagger }) // Swagger body schema for the request
  async handle(
    @Body(new ZodValidationPipe(new CreateProfileSchemaValidator()))
    body: {
      userId: string;
      role: string;
      description: string | null;
    },
  ) {
    return this.createProfileUseCase.execute(body.role, body.description);
  }
}
