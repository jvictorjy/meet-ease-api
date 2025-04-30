import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Inject,
} from '@nestjs/common';
import { CreateRoomUseCase } from '@app/rooms/application/use-cases/create-room.use-case';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from '@app/@common/infrastructure/adapters/storage/storage.interface';
import { v4 as uuid } from 'uuid';

@Controller('rooms')
@ApiTags('Rooms')
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
@ApiNotFoundResponse({ description: 'Not Found', type: ErrorSchema })
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
})
export class CreateRoomController {
  constructor(
    private readonly createRoomUseCase: CreateRoomUseCase,
    @Inject('StorageService')
    private readonly storageService: StorageService,
  ) {}

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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        description: {
          type: 'string',
          nullable: true,
        },
        layoutDescription: {
          type: 'string',
          nullable: true,
        },
        layoutImage: {
          type: 'string',
          format: 'binary',
          nullable: true,
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('layoutImage'))
  async handle(
    @Body()
    body: { name: string; description?: string; layoutDescription?: string },
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)/ }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    const dto: CreateRoomDto = {
      name: body.name,
      description: body.description,
    };

    if (file) {
      const fileExtension = file.originalname.split('.').pop();
      const fileName = `${uuid()}.${fileExtension}`;

      const imageUrl = await this.storageService.uploadFile(
        file.buffer,
        fileName,
        file.mimetype,
      );

      dto.layout = {
        description: body.layoutDescription,
        imageUrl,
      };
    }

    return this.createRoomUseCase.execute(dto);
  }
}
