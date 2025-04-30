import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ZodValidationPipe } from '@app/@common/application/pipes/zod-validation.pipe';
import { CreateAreaSchemaValidator } from '@app/areas/application/validators/create-area-schema.validator';
import { CreateAreaRequestDto } from '@app/areas/interfaces/http/dtos/create-area.dto';
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
import { CreateAreaUseCase } from '@app/areas/application/use-cases/create-area.use-case';

@Controller('areas')
@ApiTags('Areas') // Swagger tag for grouping endpoints under "Areas"
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema }) // Swagger response for 400 errors
@ApiNotFoundResponse({ description: 'Not Found', type: ErrorSchema }) // Swagger response for 404 errors
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
}) // Swagger response for 422 errors
export class CreateAreaController {
  constructor(private readonly createAreaUseCase: CreateAreaUseCase) {}

  @Post()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED) // Sets the HTTP status code to 201
  @ApiOperation({
    summary: 'Create area', // Swagger summary for the endpoint
    description: 'Create a new area', // Swagger description for the endpoint
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Area created', // Swagger response for 201 status
  })
  @ApiBody({ type: CreateAreaRequestDto }) // Swagger body schema for the request
  async handle(
    @Body(new ZodValidationPipe(new CreateAreaSchemaValidator()))
    body: CreateAreaRequestDto,
  ) {
    return this.createAreaUseCase.execute(body);
  }
}
