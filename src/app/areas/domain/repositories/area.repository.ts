import { AreaModel } from '@app/areas/domain/models/area.model';

export interface AreaUpdatePayload {
  name?: string;
  description?: string;
  parent_id?: string;
}

export interface AreaRepository {
  create(
    area: Omit<
      AreaModel,
      'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'parent' | 'children'
    >,
  ): Promise<AreaModel>;
  update(id: string, area: AreaUpdatePayload): Promise<AreaModel>;
  findById(id: string): Promise<AreaModel | null>;
  findAll(): Promise<AreaModel[]>;
  delete(id: string): Promise<void>;
}
