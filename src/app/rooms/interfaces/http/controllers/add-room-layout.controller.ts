import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import {
  AddRoomLayoutUseCase,
  IAddRoomLayoutDto,
} from '@app/rooms/application/use-cases/add-room-layout.use-case';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from '@app/@common/infrastructure/services/file-upload.service';

@Controller('rooms/:roomId/layouts')
@ApiTags('Room Layouts')
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
@ApiNotFoundResponse({ description: 'Not Found', type: ErrorSchema })
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
})
export class AddRoomLayoutController {
  constructor(
    private readonly addRoomLayoutUseCase: AddRoomLayoutUseCase,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post()
  @Roles(RoleName.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Add room layout',
    description: 'Add a new layout to a room',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Room layout added',
  })
  @ApiParam({
    name: 'roomId',
    description: 'The ID of the room to add the layout to',
    type: String,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        description: {
          type: 'string',
          nullable: true,
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @Param('roomId') roomId: string,
    @Body() body: { description?: string },
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const dto: IAddRoomLayoutDto = {
      roomId,
      description: body.description,
    };

    return this.addRoomLayoutUseCase.execute(dto, file);
  }
}
