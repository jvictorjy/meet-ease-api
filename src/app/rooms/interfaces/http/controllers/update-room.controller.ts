import {
  Controller,
  Put,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UpdateRoomUseCase } from '@app/rooms/application/use-cases/update-room.use-case';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ErrorSchema } from '@app/@common/application/documentations/openapi/swagger/error.schema';
import { UpdateRoomDto } from '@app/rooms/interfaces/http/dtos/room.dto';
import { Roles } from '@app/auth/application/docorators/roles.decorator';
import { RoleName } from '@app/auth/infrastructure/roles/roles.enum';
import { ZodValidationPipe } from '@app/@common/application/pipes/zod-validation.pipe';
import { UUIDSchemaValidation } from '@app/@common/application/validations';

@Controller('rooms')
@ApiTags('Rooms')
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
@ApiNotFoundResponse({ description: 'Not Found', type: ErrorSchema })
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
})
export class UpdateRoomController {
  constructor(private readonly updateRoomUseCase: UpdateRoomUseCase) {}

  @Put(':id')
  @Roles(RoleName.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Update room',
    description: 'Update an existing room',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Room updated',
  })
  @ApiParam({
    name: 'id',
    description: 'Room ID',
    type: String,
  })
  @ApiBody({ type: UpdateRoomDto })
  async handle(
    @Param('id', new ZodValidationPipe(new UUIDSchemaValidation())) id: string,
    @Body() body: UpdateRoomDto,
  ) {
    return this.updateRoomUseCase.execute({ id, ...body });
  }
}
