export class Team {
  constructor(
    public readonly id: string,
    private name: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {
    this.validateName(name);
  }

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error("Team name cannot be empty");
    }

    if (name.length > 100) {
      throw new Error("Team name cannot exceed 100 characters");
    }
  }

  public getName(): string {
    return this.name;
  }

  public updateName(name: string): void {
    this.validateName(name);
    this.name = name;
  }

  public toObject() {
    return {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
