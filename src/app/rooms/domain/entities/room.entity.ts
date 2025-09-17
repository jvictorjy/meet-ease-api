export class Room {
  constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _description: string,
    private readonly _max_capacity: number,
    private readonly _opening_time: string,
    private readonly _closing_time: string,
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

  get maxCapacity(): number {
    return this._max_capacity;
  }

  get openingTime(): string {
    return this._opening_time;
  }

  get closingTime(): string {
    return this._closing_time;
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
    this.validateCapacity();
    this.validateTimes();
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

  private validateCapacity(): void {
    if (!Number.isInteger(this._max_capacity) || this._max_capacity < 1) {
      throw new Error('max_capacity must be a positive integer');
    }
  }

  private validateTimes(): void {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!regex.test(this._opening_time) || !regex.test(this._closing_time)) {
      throw new Error('Invalid time format. Use HH:mm');
    }
    if (this._opening_time >= this._closing_time) {
      throw new Error('opening_time must be less than closing_time');
    }
  }
}
