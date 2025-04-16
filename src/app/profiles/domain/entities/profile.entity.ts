export class Profile {
  constructor(
    public readonly id: string,
    public role: string,
    public description: string | null,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  updateDescription(newDescription: string) {
    this.description = newDescription;
  }

  hasRole(role: string): boolean {
    return this.role === role;
  }
}
