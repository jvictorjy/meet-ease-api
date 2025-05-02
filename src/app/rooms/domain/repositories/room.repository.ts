import { Room } from '@app/rooms/domain/entities/room.entity';
import {
  RoomModel,
  RoomLayoutModel,
} from '@app/rooms/domain/models/room.model';
import { RoomLayout } from '@app/rooms/domain/entities/room-layout.entity';

export interface RoomRepository {
  create(room: Room, layouts?: RoomLayout[]): Promise<void>;
  update(room: Room): Promise<void>;
  findById(id: string): Promise<RoomModel | null>;
  findAll(): Promise<RoomModel[]>;
  delete(id: string): Promise<void>;

  // Room Layout operations
  addLayout(layout: RoomLayout): Promise<void>;
  updateLayout(layout: RoomLayout): Promise<void>;
  deleteLayout(id: string): Promise<void>;
  findLayoutById(id: string): Promise<RoomLayoutModel | null>;
  findLayoutsByRoomId(roomId: string): Promise<RoomLayoutModel[]>;
}
