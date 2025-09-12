import { CreateUserController } from '@app/users/interfaces/http/controllers/create-user.controller';
import { UpdateUserController } from '@app/users/interfaces/http/controllers/update-user.controller';
import { GetUserByIdController } from '@app/users/interfaces/http/controllers/get-user-by-id.controller';
import { GetAllUsersController } from '@app/users/interfaces/http/controllers/get-all-users.controller';
import { DeleteUserController } from '@app/users/interfaces/http/controllers/delete-user.controller';
import { ChangePasswordController } from '@app/users/interfaces/http/controllers/change-password.controller';

export const Controllers = [
  CreateUserController,
  UpdateUserController,
  GetUserByIdController,
  GetAllUsersController,
  DeleteUserController,
  ChangePasswordController,
];
