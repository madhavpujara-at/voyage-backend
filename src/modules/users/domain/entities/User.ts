import { UserRole } from "../../../auth/domain/entities/User";

export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public name: string,
    public password: string,
    public role: UserRole,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  getEmail(): string {
    return this.email;
  }

  getName(): string {
    return this.name;
  }

  getRole(): UserRole {
    return this.role;
  }

  getPassword(): string {
    return this.password;
  }

  // Add other getters or methods as needed, e.g., for password checking (isPasswordMatch)
  // Be careful about exposing sensitive data like password hashes directly.
}
