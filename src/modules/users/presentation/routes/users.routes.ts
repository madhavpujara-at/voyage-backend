import { Router } from "express";
import { UsersController } from "../controllers/users.controller";
import { UpdateUserRoleUseCase } from "../../application/useCases/updateUserRole/UpdateUserRoleUseCase";
import { UserPrismaRepository } from "@/modules/auth/infrastructure/repositories/UserPrismaRepository";
import { authenticateJwt, authorizeRoles } from "@/modules/auth/presentation/middleware/jwtStrategy";
import { validateRequest } from "@/modules/auth/presentation/middleware/validateRequest";
import { z } from "zod";

// Initialize router
const router = Router();

// Initialize repositories
const userRepository = new UserPrismaRepository();

// Initialize use cases
const updateUserRoleUseCase = new UpdateUserRoleUseCase(userRepository);

// Initialize controller
const usersController = new UsersController(updateUserRoleUseCase);

// Define routes
router.put(
  "/:userId/role",
  authenticateJwt,
  authorizeRoles(["ADMIN"]),
  (req, res, next) => {
    // Add userId from params to the body for validation
    req.body.userId = req.params.userId;
    next();
  },
  validateRequest(
    z.object({
      userId: z.string().uuid("Invalid user ID format"),
      newRole: z.enum(["TEAM_MEMBER", "TECH_LEAD", "ADMIN"] as const, {
        errorMap: () => ({ message: "Role must be one of: TEAM_MEMBER, TECH_LEAD, ADMIN" }),
      }),
    })
  ),
  usersController.updateRole,
);

export default router;
