export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public phone: string,
    public password: string,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  updateName(newName: string) {
    if (!newName || newName.trim().length === 0) {
      throw new Error('Name cannot be empty');
    }
    this.name = newName;
  }
}
