import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ListRoomLayoutsUseCase } from '@app/rooms/application/use-cases/list-room-layouts.use-case';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ErrorSchema } from '@app/@common/application/documentations/openapi/swagger/error.schema';
import { Roles } from '@app/auth/application/docorators/roles.decorator';
import { RoleName } from '@app/auth/infrastructure/roles/roles.enum';
import { ZodValidationPipe } from '@app/@common/application/pipes/zod-validation.pipe';
import { UUIDSchemaValidation } from '@app/@common/application/validations';
import { RoomLayoutResponseDto } from '@app/rooms/interfaces/http/dtos/room.dto';

@Controller('rooms/:roomId/layouts')
@ApiTags('Room Layouts')
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
@ApiNotFoundResponse({ description: 'Not Found', type: ErrorSchema })
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
})
export class GetRoomLayoutsController {
  constructor(
    private readonly listRoomLayoutsUseCase: ListRoomLayoutsUseCase,
  ) {}

  @Get()
  @Roles(RoleName.ADMIN, RoleName.CORE, RoleName.LEADER, RoleName.SCHEDULER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List room layouts',
    description: 'List all layouts linked to the specified room',
  })
  @ApiParam({
    name: 'roomId',
    description: 'Room ID',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Room layouts listed successfully',
    type: RoomLayoutResponseDto,
    isArray: true,
  })
  async handle(
    @Param('roomId', new ZodValidationPipe(new UUIDSchemaValidation()))
    roomId: string,
  ) {
    return this.listRoomLayoutsUseCase.execute(roomId);
  }
}
