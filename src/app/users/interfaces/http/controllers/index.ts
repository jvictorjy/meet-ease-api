import { CreateUserController } from '@app/users/interfaces/http/controllers/create-user.controller';
import { UpdateUserController } from '@app/users/interfaces/http/controllers/update-user.controller';
import { GetUserByIdController } from '@app/users/interfaces/http/controllers/get-user-by-id.controller';
import { GetAllUsersController } from '@app/users/interfaces/http/controllers/get-all-users.controller';

export const Controllers = [
  CreateUserController,
  UpdateUserController,
  GetUserByIdController,
  GetAllUsersController,
];
