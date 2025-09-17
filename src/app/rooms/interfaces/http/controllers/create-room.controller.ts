import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { CreateRoomUseCase } from '@app/rooms/application/use-cases/create-room.use-case';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ErrorSchema } from '@app/@common/application/documentations/openapi/swagger/error.schema';
import {
  CreateRoomDto,
  RoomResponseDto,
} from '@app/rooms/interfaces/http/dtos/room.dto';
import { Roles } from '@app/auth/application/docorators/roles.decorator';
import { RoleName } from '@app/auth/infrastructure/roles/roles.enum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ZodValidationPipe } from '@app/@common/application/pipes/zod-validation.pipe';
import { CreateRoomSchemaValidator } from '@app/rooms/application/validators/create-room-schema.validator';

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
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create room',
    description: 'Create a new room with multiple layouts',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Room created',
    type: RoomResponseDto,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateRoomDto,
    description:
      'Create a room with multiple layouts. Each layout can have a description and an image.',
  })
  @UseInterceptors(FilesInterceptor('files'))
  async handle(
    @Body(new ZodValidationPipe(new CreateRoomSchemaValidator()))
    body: CreateRoomDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)/ }),
        ],
        fileIsRequired: false,
      }),
    )
    files?: Express.Multer.File[],
  ) {
    return this.createRoomUseCase.execute(body, files);
  }
}
