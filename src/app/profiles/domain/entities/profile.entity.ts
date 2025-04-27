import { RoleName } from '@app/auth/infrastructure/roles/roles.enum';

export class Profile {
  constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _description: string,
    private readonly _role: RoleName,
    private readonly _created_at: Date,
    private readonly _updated_at: Date,
  ) {
    this.validateProfile();
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

  get role(): RoleName {
    return this._role;
  }

  get createdAt(): Date {
    return this._created_at;
  }

  get updatedAt(): Date {
    return this._updated_at;
  }

  private validateProfile(): void {
    this.validateId();
    this.validateName();
    this.validateRole();
  }

  private validateId(): void {
    if (!this._id) {
      throw new Error('Profile id is required');
    }
  }

  private validateName(): void {
    if (!this._name) {
      throw new Error('Profile name is required');
    }
  }

  private validateRole(): void {
    if (!this._role) {
      throw new Error('Profile role is required');
    }
  }
}
