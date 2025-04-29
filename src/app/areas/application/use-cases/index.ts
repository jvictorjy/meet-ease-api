import { CreateAreaUseCase } from '@app/areas/application/use-cases/create-area.use-case';
import { UpdateAreaUseCase } from '@app/areas/application/use-cases/update-area.use-case';
import { GetAreaByIdUseCase } from '@app/areas/application/use-cases/get-area-by-id.use-case';
import { GetAllAreasUseCase } from '@app/areas/application/use-cases/get-all-areas.use-case';
import { DeleteAreaUseCase } from '@app/areas/application/use-cases/delete-area.use-case';

export const UseCases = [
  CreateAreaUseCase,
  UpdateAreaUseCase,
  GetAreaByIdUseCase,
  GetAllAreasUseCase,
  DeleteAreaUseCase,
];
