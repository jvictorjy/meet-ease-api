import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';
import { ZodValidationPipe } from '@app/@common/application/pipes/zod-validation.pipe';
import { UpdateAreaSchemaValidator } from '@app/areas/application/validators/update-area-schema.validator';
import { UpdateAreaRequestDto } from '@app/areas/interfaces/http/dtos/update-area.dto';
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
import { UpdateAreaUseCase } from '@app/areas/application/use-cases/update-area.use-case';
import { UUIDSchemaValidation } from '@app/@common/application/validations';

@Controller('areas')
@ApiTags('Areas') // Swagger tag for grouping endpoints under "Areas"
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema }) // Swagger response for 400 errors
@ApiNotFoundResponse({ description: 'Not Found', type: ErrorSchema }) // Swagger response for 404 errors
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
}) // Swagger response for 422 errors
export class UpdateAreaController {
  constructor(private readonly updateAreaUseCase: UpdateAreaUseCase) {}

  @Patch(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK) // Sets the HTTP status code to 200
  @ApiOperation({
    summary: 'Update area', // Swagger summary for the endpoint
    description: 'Update an existing area', // Swagger description for the endpoint
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Area updated', // Swagger response for 200 status
  })
  @ApiBody({ type: UpdateAreaRequestDto }) // Swagger body schema for the request
  async handle(
    @Param('id', new ZodValidationPipe(new UUIDSchemaValidation())) id: string, // Validates the `id` parameter as a UUID
    @Body(new ZodValidationPipe(new UpdateAreaSchemaValidator()))
    body: UpdateAreaRequestDto,
  ) {
    return this.updateAreaUseCase.execute(id, body);
  }
}
