import { CreateUserUseCase } from '@app/users/application/use-cases/create-user.use-case';
import { UpdateUserUseCase } from '@app/users/application/use-cases/update-user.use-case';
import { GetUserByIdUseCase } from '@app/users/application/use-cases/get-user-by-id.use-case';

export const UseCases = [
  CreateUserUseCase,
  UpdateUserUseCase,
  GetUserByIdUseCase,
];
