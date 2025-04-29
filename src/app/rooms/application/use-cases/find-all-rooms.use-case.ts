import { RoomRepository } from '@app/rooms/domain/repositories/room.repository';
import { RoomModel } from '@app/rooms/domain/models/room.model';
import { Inject, Injectable } from '@nestjs/common';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';

@Injectable()
export class FindAllRoomsUseCase {
  constructor(
    @Inject('RoomRepository')
    private readonly roomRepository: RoomRepository,
  ) {}

  async execute(): Promise<RoomModel[]> {
    try {
      return await this.roomRepository.findAll();
    } catch (error) {
      if (error instanceof Exception) {
        throw error;
      }

      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: 'An unexpected error occurred while retrieving rooms',
      });
    }
  }
}