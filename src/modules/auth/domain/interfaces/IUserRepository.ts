import { User } from "../../../../infrastructure/database/generated/prisma";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User>;
  findById(id: string): Promise<User | null>;
  updateRole(userId: string, newRole: User["role"]): Promise<User>;
  countUsers(): Promise<number>;
} 