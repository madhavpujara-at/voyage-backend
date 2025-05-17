import { IUserRepository } from "@/modules/auth/domain/interfaces/IUserRepository";
import { User, UserRole } from "@/modules/auth/domain/entities/User";
import prisma from "@/infrastructure/database/prisma-client";
import pinoLoggerFactory from "@/shared/logger/pino-logger";

export class UserPrismaRepository implements IUserRepository {
  private logger = pinoLoggerFactory.createLogger("UserPrismaRepository");

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
        where: { email },
      });
    } catch (error: unknown) {
      this.logger.error(`Error finding user by email: ${email}`, error);
      throw error;
    }
  }

  async create(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    try {
      return await prisma.user.create({
        data: userData,
      });
    } catch (error: unknown) {
      this.logger.error(`Error creating user with email: ${userData.email}`, error);
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
        where: { id },
      });
    } catch (error: unknown) {
      this.logger.error(`Error finding user by ID: ${id}`, error);
      throw error;
    }
  }

  async updateRole(userId: string, newRole: UserRole): Promise<User> {
    try {
      return await prisma.user.update({
        where: { id: userId },
        data: { role: newRole },
      });
    } catch (error: unknown) {
      this.logger.error(`Error updating role for user ID: ${userId}`, error);
      throw error;
    }
  }
  async countUsers(): Promise<number> {
    try {
      return await prisma.user.count();
    } catch (error: unknown) {
      this.logger.error("Error counting users", error);
      throw error;
    }
  }
} 