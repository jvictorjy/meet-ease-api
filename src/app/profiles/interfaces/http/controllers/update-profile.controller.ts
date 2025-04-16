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
  ApiBody,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ErrorSchema } from '@app/common/application/documentations/openapi/swagger/error.schema';
import { ZodValidationPipe } from '@app/common/application/pipes/zod-validation.pipe';
import { UpdateProfileUseCase } from '@app/profiles/application/use-cases/update-profile.use-case';
import {
  UpdateProfileRequestDto,
  UpdateProfileResponseDto,
} from '@app/profiles/interfaces/http/dtos/update-profile-request.dto';
import { UUIDSchemaValidation } from '@app/common/application/validations';
import { UpdateProfileSchemaValidation } from '@app/profiles/application/validators/update-profile-schema.validation';

@Controller('profiles')
@ApiTags('Profiles')
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
@ApiNotFoundResponse({ description: 'Not Found', type: ErrorSchema })
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
})
export class UpdateProfileController {
  constructor(private readonly updateProfileUseCase: UpdateProfileUseCase) {}

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile updated',
    type: UpdateProfileResponseDto,
  })
  @ApiBody({ type: UpdateProfileRequestDto })
  async handle(
    @Param('id', new ZodValidationPipe(new UUIDSchemaValidation())) id: string,
    @Body(new ZodValidationPipe(new UpdateProfileSchemaValidation()))
    body: {
      description: string | null;
    },
  ) {
    return this.updateProfileUseCase.execute(id, body.description);
  }
}
