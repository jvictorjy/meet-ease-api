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
import { GetAllAreasUseCase } from '@app/areas/application/use-cases/get-all-areas.use-case';

@Controller('areas')
@ApiTags('Areas') // Swagger tag for grouping endpoints under "Areas"
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema }) // Swagger response for 400 errors
@ApiNotFoundResponse({ description: 'Not Found', type: ErrorSchema }) // Swagger response for 404 errors
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
}) // Swagger response for 422 errors
export class GetAllAreasController {
  constructor(private readonly getAllAreasUseCase: GetAllAreasUseCase) {}

  @Get()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK) // Sets the HTTP status code to 200
  @ApiOperation({
    summary: 'Get all areas', // Swagger summary for the endpoint
    description: 'Get all areas', // Swagger description for the endpoint
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Areas found', // Swagger response for 200 status
  })
  async handle() {
    return this.getAllAreasUseCase.execute();
  }
}
