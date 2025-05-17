import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { IUserMapper } from "../../domain/interfaces/IUserMapper";
import { User, UserRole } from "../../domain/entities/User";
import { UserPrismaMapper } from "../mappers/UserMapper";
import prisma from "../../../../infrastructure/database/prisma-client";
import { Prisma } from "../../../../infrastructure/database/generated/prisma";
import pinoLoggerFactory from "../../../../shared/logger/pino-logger";

export class UserPrismaRepository implements IUserRepository {
  private logger = pinoLoggerFactory.createLogger("UserPrismaRepository");
  private mapper: IUserMapper;

  constructor(mapper?: IUserMapper) {
    // Allow mapper injection for testing or use default
    this.mapper = mapper || new UserPrismaMapper();
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const prismaUser = await prisma.user.findUnique({
        where: { email },
      });

      return prismaUser ? this.mapper.toDomain(prismaUser) : null;
    } catch (error: unknown) {
      this.logger.error(`Error finding user by email: ${email}`, error);
      throw error;
    }
  }

  async create(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    try {
      const prismaUserData = this.mapper.toPersistence(userData) as Prisma.UserCreateInput;
      const createdUser = await prisma.user.create({
        data: prismaUserData,
      });

      return this.mapper.toDomain(createdUser);
    } catch (error: unknown) {
      this.logger.error(`Error creating user with email: ${userData.email}`, error);
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const prismaUser = await prisma.user.findUnique({
        where: { id },
      });

      return prismaUser ? this.mapper.toDomain(prismaUser) : null;
    } catch (error: unknown) {
      this.logger.error(`Error finding user by ID: ${id}`, error);
      throw error;
    }
  }

  async updateRole(userId: string, newRole: UserRole): Promise<User> {
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role: newRole },
      });

      return this.mapper.toDomain(updatedUser);
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
