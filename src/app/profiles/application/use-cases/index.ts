import { CreateProfileUseCase } from '@app/profiles/application/use-cases/create-profiele.use-case';
import { FindAllProfileUseCase } from '@app/profiles/application/use-cases/find-all-profile.use-case';
import { GetProfileUseCase } from '@app/profiles/application/use-cases/get-profile.use-case';
import { UpdateProfileUseCase } from '@app/profiles/application/use-cases/update-profile.use-case';

export const UseCases = [
  CreateProfileUseCase,
  FindAllProfileUseCase,
  GetProfileUseCase,
  UpdateProfileUseCase,
];
