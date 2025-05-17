import { User as DomainUser, UserRole } from "../../domain/entities/User";
import { BaseUserMapper } from "../../domain/mappers/BaseUserMapper";
import { User as PrismaUser, Prisma } from "../../../../infrastructure/database/generated/prisma";

/**
 * Implements IUserMapper to translate between domain User entity and Prisma User model
 * Extends BaseUserMapper to inherit common domain-level mapper functionality
 */
export class UserPrismaMapper extends BaseUserMapper {
  /**
   * Maps from Prisma User model to domain User entity
   */
  toDomain(persistenceModel: PrismaUser): DomainUser {
    return {
      id: persistenceModel.id,
      email: persistenceModel.email,
      password: persistenceModel.password,
      name: persistenceModel.name,
      role: persistenceModel.role as UserRole,
      createdAt: persistenceModel.createdAt,
      updatedAt: persistenceModel.updatedAt,
    };
  }

  /**
   * Maps from domain User entity to Prisma User model
   * Used for create operations where ID, createdAt, and updatedAt are typically not provided
   */
  toPersistence(domainUser: Omit<DomainUser, "id" | "createdAt" | "updatedAt">): Prisma.UserCreateInput {
    return {
      email: domainUser.email,
      password: domainUser.password,
      name: domainUser.name,
      role: domainUser.role,
    };
  }
} 