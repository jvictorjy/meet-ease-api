import { GetAllUsersUseCase } from '@app/users/application/use-cases/get-all-users.use-case';
import { GetUserResponseDto } from '@app/users/interfaces/http/dtos/get-user.dto';
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ErrorSchema } from '@app/@common/application/documentations/openapi/swagger/error.schema';

@Controller('users')
@ApiTags('Users')
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
@ApiNotFoundResponse({ description: 'Not Found', type: ErrorSchema })
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
})
export class GetAllUsersController {
  constructor(private readonly getAllUsersUseCase: GetAllUsersUseCase) {}

  @Get()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all users',
    description: 'Get a list of all users',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all users',
    type: [GetUserResponseDto],
  })
  async handle(): Promise<GetUserResponseDto[]> {
    return this.getAllUsersUseCase.execute();
  }
}
