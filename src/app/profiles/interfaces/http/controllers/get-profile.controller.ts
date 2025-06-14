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

import { ProfileModel } from '@app/profiles/domain/models/profile.model';
import { GetProfileUseCaseResponseDto } from '@app/profiles/interfaces/http/dtos/get-profile.dto';
import { Roles } from '@app/auth/application/docorators/roles.decorator';
import { RoleName } from '@app/auth/infrastructure/roles/roles.enum';

@Controller('profiles')
@ApiTags('Profiles') // Swagger tag for grouping endpoints under "Profiles"
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema }) // Swagger response for 400 errors
@ApiNotFoundResponse({ description: 'Not Found', type: ErrorSchema }) // Swagger response for 404 errors
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
}) // Swagger response for 422 errors
export class GetProfileController {
  constructor(private readonly getProfileUseCase: GetProfileUseCase) {}

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
    type: GetProfileUseCaseResponseDto, // Swagger response type
  })
  @Roles(RoleName.ADMIN)
  async handle(
    @Param('id', new ZodValidationPipe(new UUIDSchemaValidation())) id: string,
  ): Promise<ProfileModel> {
    return this.getProfileUseCase.execute(id);
  }
}
