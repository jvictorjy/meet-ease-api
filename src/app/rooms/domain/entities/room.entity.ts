export class Room {
  constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _description: string,
    private readonly _created_at: Date,
    private readonly _updated_at: Date,
    private readonly _deleted_at: Date | null,
  ) {
    this.validateRoom();
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
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

  private validateRoom(): void {
    this.validateId();
    this.validateName();
  }

  private validateId(): void {
    if (!this._id) {
      throw new Error('Room id is required');
    }
  }

  private validateName(): void {
    if (!this._name) {
      throw new Error('Room name is required');
    }
  }
}
