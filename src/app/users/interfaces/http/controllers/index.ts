import { CreateUserController } from '@app/users/interfaces/http/controllers/create-user.controller';
import { UpdateUserController } from '@app/users/interfaces/http/controllers/update-user.controller';
import { GetUserByIdController } from '@app/users/interfaces/http/controllers/get-user-by-id.controller';

export const Controllers = [
  CreateUserController,
  UpdateUserController,
  GetUserByIdController,
];
