import { PrismaClient } from "../../infrastructure/database/generated/prisma";
import { UserPrismaRepository } from "./infrastructure/repositories/UserPrismaRepository";
import { ListTeamMembersUseCase } from "./application/useCases/listTeamMembers/ListTeamMembersUseCase";

// This module factory provides instances of the user module's core components.
// The router itself is set up and exported directly from users.routes.ts for now.

export const createUsersModuleComponents = (prisma: PrismaClient) => {
  const userRepository = new UserPrismaRepository(prisma);
  const listTeamMembersUseCase = new ListTeamMembersUseCase(userRepository);

  // Note: UpdateUserRoleUseCase and UsersController are currently instantiated
  // within users.routes.ts and use dependencies which might be from the auth module.
  // A fuller refactor would make the Users module more self-contained.

  return {
    userRepository,
    listTeamMembersUseCase,
  };
};
