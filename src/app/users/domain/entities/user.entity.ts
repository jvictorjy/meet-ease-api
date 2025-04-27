export class User {
  constructor(
    public readonly _id: string,
    public readonly _name: string,
    public readonly _email: string,
    public readonly _phone: string,
    public readonly _password: string,
    public readonly _profile_id: string,
    public readonly _created_at: Date,
    public readonly _updated_at: Date,
  ) {
    this.validateUser();
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get phone(): string {
    return this._phone;
  }

  get password(): string {
    return this._password;
  }

  get profile_id(): string {
    return this._profile_id;
  }

  get createdAt(): Date {
    return this._created_at;
  }

  get updatedAt(): Date {
    return this._updated_at;
  }

  private validateUser(): void {
    this.validateId();
    this.validateName();
    this.validateEmail();
    this.validatePhone();
    this.validatePassword();
    this.validateProfile();
  }

  private validateId(): void {
    if (!this._id) {
      throw new Error('User id is required');
    }
  }

  private validateName(): void {
    if (!this._name) {
      throw new Error('User name is required');
    }
  }

  private validateEmail(): void {
    if (!this._email) {
      throw new Error('User email is required');
    }
  }

  private validatePhone(): void {
    if (!this.phone) {
      throw new Error('User phone is required');
    }
  }

  private validatePassword(): void {
    if (!this._password) {
      throw new Error('User password is required');
    }
  }

  private validateProfile(): void {
    if (!this.profile_id) {
      throw new Error('User profile is required');
    }
  }
}
