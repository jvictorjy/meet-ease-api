import { CreateAreaController } from '@app/areas/interfaces/http/controllers/create-area.controller';
import { UpdateAreaController } from '@app/areas/interfaces/http/controllers/update-area.controller';
import { GetAreaByIdController } from '@app/areas/interfaces/http/controllers/get-area-by-id.controller';
import { GetAllAreasController } from '@app/areas/interfaces/http/controllers/get-all-areas.controller';
import { DeleteAreaController } from '@app/areas/interfaces/http/controllers/delete-area.controller';

export const Controllers = [
  CreateAreaController,
  UpdateAreaController,
  GetAreaByIdController,
  GetAllAreasController,
  DeleteAreaController,
];
