export class RoomLayout {
  constructor(
    private readonly _id: string,
    private readonly _description: string,
    private readonly _image_url: string,
    private readonly _room_id: string,
    private readonly _created_at: Date,
    private readonly _updated_at: Date,
    private readonly _deleted_at: Date | null,
  ) {
    this.validateRoomLayout();
  }

  get id(): string {
    return this._id;
  }

  get description(): string {
    return this._description;
  }

  get imageUrl(): string {
    return this._image_url;
  }

  get roomId(): string {
    return this._room_id;
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

  private validateRoomLayout(): void {
    this.validateId();
    this.validateImageUrl();
    this.validateRoomId();
  }

  private validateId(): void {
    if (!this._id) {
      throw new Error('RoomLayout id is required');
    }
  }

  private validateImageUrl(): void {
    if (!this._image_url) {
      throw new Error('RoomLayout image URL is required');
    }
  }

  private validateRoomId(): void {
    if (!this._room_id) {
      throw new Error('RoomLayout room id is required');
    }
  }
}
