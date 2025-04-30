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
import { AddRoomLayoutUseCase } from '@app/rooms/application/use-cases/add-room-layout.use-case';
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
import { AddRoomLayoutDto } from '@app/rooms/interfaces/http/dtos/room.dto';
import { Roles } from '@app/auth/application/docorators/roles.decorator';
import { RoleName } from '@app/auth/infrastructure/roles/roles.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { Inject } from '@nestjs/common';
import { StorageService } from '@app/@common/infrastructure/adapters/storage/storage.interface';
import { v4 as uuid } from 'uuid';

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
    @Inject('StorageService')
    private readonly storageService: StorageService,
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
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
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
    // Generate a unique filename
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${uuid()}.${fileExtension}`;

    // Upload the file to S3
    const imageUrl = await this.storageService.uploadFile(
      file.buffer,
      fileName,
      file.mimetype,
    );

    // Create the DTO
    const dto: AddRoomLayoutDto = {
      roomId,
      description: body.description,
      imageUrl,
    };

    return this.addRoomLayoutUseCase.execute(dto);
  }
}
