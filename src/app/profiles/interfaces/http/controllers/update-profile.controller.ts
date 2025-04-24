import {
  Controller,
  Body,
  HttpCode,
  HttpStatus,
  Patch,
  Param,
} from '@nestjs/common';
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
import { ZodValidationPipe } from '@app/@common/application/pipes/zod-validation.pipe';
import { UpdateProfileUseCase } from '@app/profiles/application/use-cases/update-profile.use-case';
import {
  UpdateProfileRequestDto,
  UpdateProfileResponseDto,
} from '@app/profiles/interfaces/http/dtos/update-profile-request.dto';
import { UUIDSchemaValidation } from '@app/@common/application/validations';
import { UpdateProfileSchemaValidator } from '@app/profiles/application/validators/update-profile-schema.validator';

/**
 * Controller for handling profile update requests.
 *
 * This controller provides an endpoint to update an existing profile.
 * It validates the request parameters and body using Zod schema validation
 * and delegates the update logic to the `UpdateProfileUseCase`.
 */
@Controller('profiles')
@ApiTags('Profiles') // Swagger tag for grouping endpoints under "Profiles"
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema }) // Swagger response for 400 errors
@ApiNotFoundResponse({ description: 'Not Found', type: ErrorSchema }) // Swagger response for 404 errors
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
}) // Swagger response for 422 errors
export class UpdateProfileController {
  /**
   * Constructor for `UpdateProfileController`.
   *
   * @param updateProfileUseCase - The use case responsible for updating profiles.
   */
  constructor(private readonly updateProfileUseCase: UpdateProfileUseCase) {}

  /**
   * Handles the request to update a profile.
   *
   * @param id - The unique identifier of the profile to be updated.
   *   - Validated using `UUIDSchemaValidation`.
   * @param body - The request body containing the profile details to update.
   *   - `description`: An optional description for the profile.
   *   - Validated using `UpdateProfileSchemaValidator`.
   *
   * @returns The updated profile as an instance of `UpdateProfileResponseDto`.
   *
   * @throws {BadRequestException} If the request parameters or body are invalid.
   * @throws {NotFoundException} If the profile with the given ID is not found.
   * @throws {UnprocessableEntityException} If the profile cannot be updated.
   */
  @Patch(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK) // Sets the HTTP status code to 200
  @ApiOperation({
    summary: 'Update profile', // Swagger summary for the endpoint
    description: 'Update profile', // Swagger description for the endpoint
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile updated', // Swagger response for 200 status
    type: UpdateProfileResponseDto, // Swagger response type
  })
  @ApiBody({ type: UpdateProfileRequestDto }) // Swagger body schema for the request
  async handle(
    @Param('id', new ZodValidationPipe(new UUIDSchemaValidation())) id: string,
    @Body(new ZodValidationPipe(new UpdateProfileSchemaValidator()))
    body: {
      description: string | null;
    },
  ) {
    return this.updateProfileUseCase.execute(id, body.description);
  }
}
