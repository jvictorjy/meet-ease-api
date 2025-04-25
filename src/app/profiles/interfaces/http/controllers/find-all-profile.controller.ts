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

import { ErrorSchema } from '@app/@common/application/documentations/openapi/swagger/error.schema';
import { FindAllProfileUseCase } from '@app/profiles/application/use-cases/find-all-profile.use-case';
import { GetProfileUseCaseResponseDto } from '@app/profiles/application/dto/get-profile.dto';

@Controller('profiles')
@ApiTags('Profiles') // Swagger tag for grouping endpoints under "Profiles"
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema }) // Swagger response for 400 errors
@ApiNotFoundResponse({ description: 'Not Found', type: ErrorSchema }) // Swagger response for 404 errors
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
}) // Swagger response for 422 errors
export class FindAllProfileController {
  constructor(private readonly findAllProfileUseCase: FindAllProfileUseCase) {}

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
    type: [GetProfileUseCaseResponseDto], // Swagger response type
  })
  async handle() {
    return this.findAllProfileUseCase.execute();
  }
}
