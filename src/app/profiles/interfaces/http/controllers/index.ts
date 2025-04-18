import { CreateProfileController } from '@app/profiles/interfaces/http/controllers/create-profile.controller';
import { FindAllProfileController } from '@app/profiles/interfaces/http/controllers/find-all-profile.controller';
import { GetProfileController } from '@app/profiles/interfaces/http/controllers/get-profile.controller';
import { UpdateProfileController } from '@app/profiles/interfaces/http/controllers/update-profile.controller';

export const Controllers = [
  CreateProfileController,
  FindAllProfileController,
  GetProfileController,
  UpdateProfileController,
];
