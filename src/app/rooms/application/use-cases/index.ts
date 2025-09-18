import { CreateRoomUseCase } from './create-room.use-case';
import { UpdateRoomUseCase } from './update-room.use-case';
import { GetRoomUseCase } from './get-room.use-case';
import { FindAllRoomsUseCase } from './find-all-rooms.use-case';
import { DeleteRoomUseCase } from './delete-room.use-case';
import { AddRoomLayoutUseCase } from './add-room-layout.use-case';
import { UpdateRoomLayoutUseCase } from './update-room-layout.use-case';
import { DeleteRoomLayoutUseCase } from './delete-room-layout.use-case';
import { ListRoomLayoutsUseCase } from './list-room-layouts.use-case';

export const UseCases = [
  CreateRoomUseCase,
  UpdateRoomUseCase,
  GetRoomUseCase,
  FindAllRoomsUseCase,
  DeleteRoomUseCase,
  AddRoomLayoutUseCase,
  UpdateRoomLayoutUseCase,
  DeleteRoomLayoutUseCase,
  ListRoomLayoutsUseCase,
];
