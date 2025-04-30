import {
  Controller,
  Put,
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
import { UpdateRoomLayoutUseCase } from '@app/rooms/application/use-cases/update-room-layout.use-case';
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
import { UpdateRoomLayoutDto } from '@app/rooms/interfaces/http/dtos/room.dto';
import { Roles } from '@app/auth/application/docorators/roles.decorator';
import { RoleName } from '@app/auth/infrastructure/roles/roles.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { Inject } from '@nestjs/common';
import { StorageService } from '@app/@common/infrastructure/adapters/storage/storage.interface';
import { v4 as uuid } from 'uuid';
import { RoomRepository } from '@app/rooms/domain/repositories/room.repository';

@Controller('rooms/layouts/:id')
@ApiTags('Room Layouts')
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
@ApiNotFoundResponse({ description: 'Not Found', type: ErrorSchema })
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
})
export class UpdateRoomLayoutController {
  constructor(
    private readonly updateRoomLayoutUseCase: UpdateRoomLayoutUseCase,
    @Inject('StorageService')
    private readonly storageService: StorageService,
    @Inject('RoomRepository')
    private readonly roomRepository: RoomRepository,
  ) {}

  @Put()
  @Roles(RoleName.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update room layout',
    description: 'Update an existing room layout',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Room layout updated',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the layout to update',
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
          nullable: true,
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  async handle(
    @Param('id') id: string,
    @Body() body: { description?: string },
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
    // Create the DTO
    const dto: UpdateRoomLayoutDto & { id: string } = {
      id,
      description: body.description,
    };

    // If a new image was uploaded, update the image URL
    if (file) {
      // Get the existing layout to get the current image URL
      const existingLayout = await this.roomRepository.findLayoutById(id);
      if (existingLayout && existingLayout.imageUrl) {
        // Delete the old image from S3
        try {
          await this.storageService.deleteFile(existingLayout.imageUrl);
        } catch (error) {
          console.error('Failed to delete old image from S3:', error);
          // Continue with the update even if the deletion fails
        }
      }

      // Generate a unique filename
      const fileExtension = file.originalname.split('.').pop();
      const fileName = `${uuid()}.${fileExtension}`;

      // Upload the new file to S3
      const imageUrl = await this.storageService.uploadFile(
        file.buffer,
        fileName,
        file.mimetype,
      );

      // Add the image URL to the DTO
      dto.imageUrl = imageUrl;
    }

    // Update the layout
    return this.updateRoomLayoutUseCase.execute(dto);
  }
}
