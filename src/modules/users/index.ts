import { PrismaClient } from "../../infrastructure/database/generated/prisma";
import { ListUsersByRoleUseCase } from "./application/useCases/listUsersByRole/ListUsersByRoleUseCase";
import { UpdateUserRoleUseCase } from "./application/useCases/updateUserRole/UpdateUserRoleUseCase";
import { UserPrismaRepository } from "./infrastructure/repositories/UserPrismaRepository";
import { UsersController } from "./presentation/controllers/users.controller";
import { Router } from "express";
import { UserRole } from "../auth/domain/entities/User";
import { authenticateJwt, authorizeRoles } from "../auth/presentation/middleware/jwtStrategy";
import { validateRequest } from "../auth/presentation/middleware/validateRequest";
import { UpdateUserRoleSchema } from "./presentation/validation/updateUserRoleSchema";

// This module factory provides instances of the user module's core components.
// The router itself is set up and exported directly from users.routes.ts for now.

export const createUsersModule = (prisma: PrismaClient) => {
  const userRepository = new UserPrismaRepository(prisma);
  const listUsersByRoleUseCase = new ListUsersByRoleUseCase(userRepository);
  const updateUserRoleUseCase = new UpdateUserRoleUseCase(userRepository);

  const usersController = new UsersController(updateUserRoleUseCase, listUsersByRoleUseCase);

  // Create and configure the router
  const router = Router();

  // Update user role endpoint (supports upgrading to TECH_LEAD/ADMIN or downgrading to TEAM_MEMBER)
  router.patch(
    "/:userId/role",
    authenticateJwt,
    authorizeRoles([UserRole.ADMIN]),
    (req, res, next) => {
      req.body.userId = req.params.userId;
      next();
    },
    validateRequest(UpdateUserRoleSchema),
    usersController.updateRole,
  );

  // List users by role endpoint
  router.get(
    "/",
    authenticateJwt,
    authorizeRoles([UserRole.ADMIN]),
    usersController.listUsersByRole.bind(usersController),
  );

  return {
    userRepository,
    listUsersByRoleUseCase,
    updateUserRoleUseCase,
    usersController,
    router,
  };
};

// For backward compatibility with existing imports
export const createUsersModuleComponents = (prisma: PrismaClient) => {
  const userRepository = new UserPrismaRepository(prisma);
  const listUsersByRoleUseCase = new ListUsersByRoleUseCase(userRepository);
  const updateUserRoleUseCase = new UpdateUserRoleUseCase(userRepository);

  // Note: UpdateUserRoleUseCase and UsersController are currently instantiated
  // within users.routes.ts and use dependencies which might be from the auth module.
  // A fuller refactor would make the Users module more self-contained.

  return {
    userRepository,
    listUsersByRoleUseCase,
    updateUserRoleUseCase,
  };
};
