import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateRoomUseCase } from '@app/rooms/application/use-cases/create-room.use-case';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ErrorSchema } from '@app/@common/application/documentations/openapi/swagger/error.schema';
import { CreateRoomDto } from '@app/rooms/interfaces/http/dtos/room.dto';
import { Roles } from '@app/auth/application/docorators/roles.decorator';
import { RoleName } from '@app/auth/infrastructure/roles/roles.enum';

@Controller('rooms')
@ApiTags('Rooms')
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
@ApiNotFoundResponse({ description: 'Not Found', type: ErrorSchema })
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
})
export class CreateRoomController {
  constructor(private readonly createRoomUseCase: CreateRoomUseCase) {}

  @Post()
  @Roles(RoleName.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create room',
    description: 'Create a new room',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Room created',
  })
  @ApiBody({ type: CreateRoomDto })
  async handle(@Body() body: CreateRoomDto) {
    return this.createRoomUseCase.execute(body);
  }
}
