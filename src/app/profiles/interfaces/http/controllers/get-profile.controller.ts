import { GetProfileUseCaseResponseDTO } from '@app/profiles/interfaces/http/dtos/get-profile.dto';
import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ZodValidationPipe } from '@app/@common/application/pipes/zod-validation.pipe';
import { UUIDSchemaValidation } from '@app/@common/application/validations';
import { ErrorSchema } from '@app/@common/application/documentations/openapi/swagger/error.schema';
import { GetProfileUseCase } from '@app/profiles/application/use-cases/get-profile.use-case';

/**
 * Controller for handling profile retrieval requests.
 *
 * This controller provides an endpoint to retrieve a profile by its ID.
 * It validates the `id` parameter using Zod schema validation and delegates
 * the retrieval logic to the `GetProfileUseCase`.
 */
@Controller('profiles')
@ApiTags('Profiles') // Swagger tag for grouping endpoints under "Profiles"
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema }) // Swagger response for 400 errors
@ApiNotFoundResponse({ description: 'Not Found', type: ErrorSchema }) // Swagger response for 404 errors
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
}) // Swagger response for 422 errors
export class GetProfileController {
  /**
   * Constructor for `GetProfileController`.
   *
   * @param getProfileUseCase - The use case responsible for retrieving profiles.
   */
  constructor(private readonly getProfileUseCase: GetProfileUseCase) {}

  /**
   * Handles the retrieval of a profile by its ID.
   *
   * @param id - The ID of the profile to retrieve. It is validated using a Zod schema.
   * @returns A promise that resolves to the profile data.
   *
   * @throws {BadRequestException} If the `id` parameter is invalid.
   * @throws {NotFoundException} If the profile is not found.
   * @throws {UnprocessableEntityException} If the profile cannot be retrieved.
   */
  @Get(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK) // Sets the HTTP status code to 200
  @ApiOperation({
    summary: 'Get profile', // Swagger summary for the endpoint
    description: 'Get profile by ID', // Swagger description for the endpoint
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get profile by ID', // Swagger response for 200 status
    type: GetProfileUseCaseResponseDTO, // Swagger response type
  })
  async handle(
    @Param('id', new ZodValidationPipe(new UUIDSchemaValidation())) id: string,
  ): Promise<GetProfileUseCaseResponseDTO> {
    return this.getProfileUseCase.execute(id);
  }
}
