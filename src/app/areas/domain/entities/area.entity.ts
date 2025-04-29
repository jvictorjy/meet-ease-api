export class Area {
  constructor(
    public readonly _id: string,
    public readonly _name: string,
    public readonly _description: string | null,
    public readonly _parent_id: string | null,
    public readonly _created_at: Date,
    public readonly _updated_at: Date,
    public readonly _deleted_at: Date | null,
  ) {
    this.validateArea();
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string | null {
    return this._description;
  }

  get parent_id(): string | null {
    return this._parent_id;
  }

  get createdAt(): Date {
    return this._created_at;
  }

  get updatedAt(): Date {
    return this._updated_at;
  }

  get deletedAt(): Date | null {
    return this._deleted_at;
  }

  private validateArea(): void {
    this.validateId();
    this.validateName();
  }

  private validateId(): void {
    if (!this._id) {
      throw new Error('Area id is required');
    }
  }

  private validateName(): void {
    if (!this._name) {
      throw new Error('Area name is required');
    }
  }
}