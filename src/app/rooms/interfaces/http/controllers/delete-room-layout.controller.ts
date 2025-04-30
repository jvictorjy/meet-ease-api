import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Inject,
} from '@nestjs/common';
import { DeleteRoomLayoutUseCase } from '@app/rooms/application/use-cases/delete-room-layout.use-case';
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
import { StorageService } from '@app/@common/infrastructure/adapters/storage/storage.interface';
import { RoomRepository } from '@app/rooms/domain/repositories/room.repository';
import { ZodValidationPipe } from '@app/@common/application/pipes/zod-validation.pipe';
import { UUIDSchemaValidation } from '@app/@common/application/validations';

@Controller('rooms/layouts/:id')
@ApiTags('Room Layouts')
@ApiBadRequestResponse({ description: 'Bad Request', type: ErrorSchema })
@ApiNotFoundResponse({ description: 'Not Found', type: ErrorSchema })
@ApiUnprocessableEntityResponse({
  description: 'Unprocessable Entity',
  type: ErrorSchema,
})
export class DeleteRoomLayoutController {
  constructor(
    private readonly deleteRoomLayoutUseCase: DeleteRoomLayoutUseCase,
    @Inject('StorageService')
    private readonly storageService: StorageService,
    @Inject('RoomRepository')
    private readonly roomRepository: RoomRepository,
  ) {}

  @Delete()
  @Roles(RoleName.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete room layout',
    description: 'Delete an existing room layout',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Room layout deleted',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the layout to delete',
    type: String,
  })
  async handle(
    @Param('id', new ZodValidationPipe(new UUIDSchemaValidation())) id: string,
  ) {
    const layout = await this.roomRepository.findLayoutById(id);

    if (layout && layout.imageUrl) {
      try {
        await this.storageService.deleteFile(layout.imageUrl);
      } catch (error) {
        console.error('Failed to delete image from S3:', error);
      }
    }

    return this.deleteRoomLayoutUseCase.execute(id);
  }
}
