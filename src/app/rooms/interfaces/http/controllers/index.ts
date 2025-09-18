import { CreateRoomController } from '@app/rooms/interfaces/http/controllers/create-room.controller';
import { UpdateRoomController } from '@app/rooms/interfaces/http/controllers/update-room.controller';
import { GetRoomsController } from '@app/rooms/interfaces/http/controllers/get-rooms.controller';
import { GetRoomController } from '@app/rooms/interfaces/http/controllers/get-room.controller';
import { DeleteRoomController } from '@app/rooms/interfaces/http/controllers/delete-room.controller';
import { AddRoomLayoutController } from '@app/rooms/interfaces/http/controllers/add-room-layout.controller';
import { UpdateRoomLayoutController } from '@app/rooms/interfaces/http/controllers/update-room-layout.controller';
import { DeleteRoomLayoutController } from '@app/rooms/interfaces/http/controllers/delete-room-layout.controller';
import { GetRoomLayoutsController } from '@app/rooms/interfaces/http/controllers/get-room-layouts.controller';

export const Controllers = [
  CreateRoomController,
  UpdateRoomController,
  GetRoomsController,
  GetRoomController,
  DeleteRoomController,
  AddRoomLayoutController,
  UpdateRoomLayoutController,
  DeleteRoomLayoutController,
  GetRoomLayoutsController,
];
