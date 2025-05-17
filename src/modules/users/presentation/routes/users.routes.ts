import { Router } from "express";
import { UserRole } from "../../../auth/domain/entities/User";
import { UsersController } from "../controllers/users.controller";
import { UpdateUserRoleUseCase } from "../../application/useCases/updateUserRole/UpdateUserRoleUseCase";
import { UserPrismaRepository } from "../../../auth/infrastructure/repositories/UserPrismaRepository";
import { authenticateJwt, authorizeRoles } from "../../../auth/presentation/middleware/jwtStrategy";
import { validateRequest } from "../../../auth/presentation/middleware/validateRequest";
import { UpdateUserRoleSchema } from "../validation/updateUserRoleSchema";

/**
 * @openapi
 * tags:
 *   name: Users
 *   description: User management and operations. Requires ADMIN privileges for some operations.
 */

// Initialize router
const router = Router();

// Initialize repositories
const userPrismaRepository = new UserPrismaRepository();

// Initialize use cases
const updateUserRoleUseCase = new UpdateUserRoleUseCase(userPrismaRepository);

// Initialize controller
const usersController = new UsersController(updateUserRoleUseCase);

/**
 * @openapi
 * /users/{userId}/role:
 *   put:
 *     tags: [Users]
 *     summary: Update a user's role
 *     description: Allows an ADMIN to change the role of a specified user. Requires JWT authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the user whose role is to be updated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRoleInput'
 *     responses:
 *       '200':
 *         description: User role updated successfully. Returns the updated user details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       '401':
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *       '403':
 *         description: 'Forbidden: Insufficient permissions.'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *       '404':
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 */
// Define routes
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

export default router;
