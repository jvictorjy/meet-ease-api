import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { FindAllRoomsUseCase } from '@app/rooms/application/use-cases/find-all-rooms.use-case';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ErrorSchema } from '@app/@common/application/documentations/openapi/swagger/error.schema';
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
export class GetRoomsController {
  constructor(private readonly findAllRoomsUseCase: FindAllRoomsUseCase) {}

  @Get()
  @Roles(RoleName.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List rooms',
    description: 'Get a list of all rooms',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Rooms retrieved successfully',
  })
  async handle() {
    return this.findAllRoomsUseCase.execute();
  }
}
