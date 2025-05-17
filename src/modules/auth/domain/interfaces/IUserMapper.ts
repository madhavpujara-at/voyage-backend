import { User } from "../entities/User";

/**
 * Interface for mapping between domain User entity and persistence models
 * This interface allows the domain layer to define the mapping contract
 * without depending on infrastructure specifics
 */
export interface IUserMapper {
  /**
   * Maps from a persistence model to domain User entity
   */
  toDomain(persistenceModel: unknown): User;
  
  /**
   * Maps from domain User entity to a persistence model
   * Used for create operations where ID, createdAt, and updatedAt are typically not provided
   */
  toPersistence(domainUser: Omit<User, "id" | "createdAt" | "updatedAt">): unknown;
} 