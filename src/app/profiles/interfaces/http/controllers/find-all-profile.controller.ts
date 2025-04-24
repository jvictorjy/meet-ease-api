import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { GetProfileUseCaseResponseDTO } from '@app/profiles/interfaces/http/dtos/get-profile.dto';
import { ErrorSchema } from '@app/@common/application/documentations/openapi/swagger/error.schema';
import { FindAllProfileUseCase } from '@app/profiles/application/use-cases/find-all-profile.use-case';

/**
 * Controller for handling requests to retrieve all profiles.
 *
 * This controller provides an endpoint to list all profiles.
 * It delegates the logic to the `FindAllProfileUseCase` and
 * returns the result as a response.
 */
@Controller('profiles')
@ApiTags('Profiles') // Swagger tag for grouping endpoints under "Profiles"
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema }) // Swagger response for 400 errors
@ApiNotFoundResponse({ description: 'Not Found', type: ErrorSchema }) // Swagger response for 404 errors
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
}) // Swagger response for 422 errors
export class FindAllProfileController {
  /**
   * Constructor for `FindAllProfileController`.
   *
   * @param findAllProfileUseCase - The use case responsible for retrieving all profiles.
   */
  constructor(private readonly findAllProfileUseCase: FindAllProfileUseCase) {}

  /**
   * Handles the request to list all profiles.
   *
   * @returns A list of profiles as an array of `FindAllProfileUseCaseResponseDTO`.
   *
   * @throws {BadRequestException} If the request is invalid.
   * @throws {NotFoundException} If no profiles are found.
   * @throws {UnprocessableEntityException} If the request cannot be processed.
   */
  @Get()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK) // Sets the HTTP status code to 200
  @ApiOperation({
    summary: 'List profiles', // Swagger summary for the endpoint
    description: 'List all profiles', // Swagger description for the endpoint
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List profiles', // Swagger response for 200 status
    type: [GetProfileUseCaseResponseDTO], // Swagger response type
  })
  async handle() {
    return this.findAllProfileUseCase.execute();
  }
}
