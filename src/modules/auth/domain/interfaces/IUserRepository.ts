import { User, UserRole } from "../entities/User";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User>;
  findById(id: string): Promise<User | null>;
  updateRole(userId: string, newRole: UserRole): Promise<User>;
  countUsers(): Promise<number>;
}
