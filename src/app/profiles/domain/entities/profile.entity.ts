export class Profile {
  constructor(
    public readonly id: string,
    public role: string,
    public description: string | null,
    public created_at: Date,
    public updated_at: Date,
  ) {}

  updateDescription(newDescription: string | null) {
    this.description = newDescription;
  }

  hasRole(role: string): boolean {
    return this.role === role;
  }
}
