import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
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
import { DeleteAreaUseCase } from '@app/areas/application/use-cases/delete-area.use-case';
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
export class DeleteAreaController {
  constructor(private readonly deleteAreaUseCase: DeleteAreaUseCase) {}

  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT) // Sets the HTTP status code to 204 (No Content)
  @ApiOperation({
    summary: 'Delete area', // Swagger summary for the endpoint
    description: 'Delete an area by its ID', // Swagger description for the endpoint
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Area deleted', // Swagger response for 204 status
  })
  @ApiParam({
    name: 'id',
    description: 'Area ID',
    type: String,
    required: true,
  })
  async handle(
    @Param('id', new ZodValidationPipe(new UUIDSchemaValidation())) id: string,
  ): Promise<void> {
    await this.deleteAreaUseCase.execute(id);
  }
}
