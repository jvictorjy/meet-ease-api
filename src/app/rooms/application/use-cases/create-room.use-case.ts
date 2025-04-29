import { v4 as uuid } from 'uuid';
import { Room } from '@app/rooms/domain/entities/room.entity';
import { RoomRepository } from '@app/rooms/domain/repositories/room.repository';
import { Inject, Injectable } from '@nestjs/common';
import { Exception } from '@core/@shared/domain/exception/Exception';
import { Code } from '@core/@shared/domain/error/Code';

export interface CreateRoomDto {
  name: string;
  description?: string;
}

@Injectable()
export class CreateRoomUseCase {
  constructor(
    @Inject('RoomRepository')
    private readonly roomRepository: RoomRepository,
  ) {}

  async execute(payload: CreateRoomDto): Promise<void> {
    try {
      const room = new Room(
        uuid(), // Generates a unique ID for the room
        payload.name,
        payload.description ?? '',
        new Date(),
        new Date(),
        null,
      );
      await this.roomRepository.create(room); // Persists the room to the repository
    } catch (error) {
      if (error instanceof Exception) {
        throw error;
      }

      throw Exception.new({
        code: Code.INTERNAL_SERVER_ERROR.code,
        overrideMessage: 'An unexpected error occurred while creating the room',
      });
    }
  }
}