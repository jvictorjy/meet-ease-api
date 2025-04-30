import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ErrorSchema } from '@app/@common/application/documentations/openapi/swagger/error.schema';
import { GetAreaByIdUseCase } from '@app/areas/application/use-cases/get-area-by-id.use-case';
import { ZodValidationPipe } from '@app/@common/application/pipes/zod-validation.pipe';
import { UUIDSchemaValidation } from '@app/@common/application/validations';

@Controller('areas')
@ApiTags('Areas') // Swagger tag for grouping endpoints under "Areas"
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema }) // Swagger response for 400 errors
@ApiNotFoundResponse({ description: 'Not Found', type: ErrorSchema }) // Swagger response for 404 errors
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
}) // Swagger response for 422 errors
export class GetAreaByIdController {
  constructor(private readonly getAreaByIdUseCase: GetAreaByIdUseCase) {}

  @Get(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK) // Sets the HTTP status code to 200
  @ApiOperation({
    summary: 'Get area by ID', // Swagger summary for the endpoint
    description: 'Get an area by its ID', // Swagger description for the endpoint
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Area found', // Swagger response for 200 status
  })
  @ApiParam({
    name: 'id',
    description: 'Area ID',
    type: String,
    required: true,
  })
  async handle(
    @Param('id', new ZodValidationPipe(new UUIDSchemaValidation())) id: string,
  ) {
    return this.getAreaByIdUseCase.execute(id);
  }
}
