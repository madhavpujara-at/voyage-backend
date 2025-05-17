import { User, UserRole } from "../entities/User";
import { IUserMapper } from "../interfaces/IUserMapper";

/**
 * Base abstract class for implementing User mappers
 * Acts as a template for concrete infrastructure-specific mapper implementations
 * This class stays in the domain layer and only depends on domain entities
 */
export abstract class BaseUserMapper implements IUserMapper {
  /**
   * Maps from a persistence model to domain User entity
   * Must be implemented by concrete mapper classes
   */
  abstract toDomain(persistenceModel: unknown): User;
  
  /**
   * Maps from domain User entity to a persistence model
   * Must be implemented by concrete mapper classes
   */
  abstract toPersistence(domainUser: Omit<User, "id" | "createdAt" | "updatedAt">): unknown;
  
  /**
   * Helper method to create a new User entity
   * This method is shared by all mapper implementations
   */
  createNewUser(
    id: string,
    email: string,
    name: string,
    hashedPassword: string,
    role: UserRole = UserRole.TEAM_MEMBER
  ): User {
    const now = new Date();
    
    return {
      id,
      email,
      name,
      password: hashedPassword,
      role,
      createdAt: now,
      updatedAt: now
    };
  }
} 