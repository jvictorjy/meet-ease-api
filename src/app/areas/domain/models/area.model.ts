export class AreaModel {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  parent?: AreaModel;
  children?: AreaModel[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
