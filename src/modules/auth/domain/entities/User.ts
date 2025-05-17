// Pure domain entity without infrastructure dependencies

/**
 * User entity representing a user in the system
 */
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Enum representing possible user roles
 * Must align with the Prisma schema definition
 */
export enum UserRole {
  TEAM_MEMBER = "TEAM_MEMBER",
  TECH_LEAD = "TECH_LEAD",
  ADMIN = "ADMIN"
}
