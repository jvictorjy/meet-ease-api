import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateProfileUseCase } from '@app/profiles/application/use-cases/create-profiele.use-case';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ErrorSchema } from '@app/common/application/documentations/openapi/swagger/error.schema';
import { CreateProfileDtoSwagger } from '@app/profiles/interfaces/http/dtos/profile-response.dto';
import { ZodValidationPipe } from '@app/common/application/pipes/zod-validation.pipe';
import { CreateProfileSchemaValidation } from '@app/profiles/interfaces/http/validators/create-profile-schema.validation';

@Controller('profiles')
@ApiTags('Profiles')
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
@ApiNotFoundResponse({ description: 'Not Found', type: ErrorSchema })
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
})
export class CreateProfileController {
  constructor(private readonly createProfileUseCase: CreateProfileUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Profile created',
    type: CreateProfileDtoSwagger,
  })
  @ApiBody({ type: CreateProfileDtoSwagger })
  async handle(
    @Body(new ZodValidationPipe(new CreateProfileSchemaValidation()))
    body: {
      userId: string;
      role: string;
      description: string | null;
    },
  ) {
    return this.createProfileUseCase.execute(body.role, body.description);
  }
}
