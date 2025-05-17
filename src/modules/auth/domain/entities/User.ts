// This file mostly serves as a pass-through to the Prisma-generated User type
// If we need to add domain-specific logic to the User entity, we can extend it here

import { User as PrismaUser, UserRole } from "../../../../infrastructure/database/generated/prisma";

// Re-export the Prisma User type to be used throughout the domain
export type User = PrismaUser;

// Re-export UserRole enum
export { UserRole };
