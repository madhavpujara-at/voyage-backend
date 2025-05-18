import { Router } from "express";
import { UserRole } from "../../../auth/domain/entities/User";
import { UsersController } from "../controllers/users.controller";
import { UpdateUserRoleUseCase } from "../../application/useCases/updateUserRole/UpdateUserRoleUseCase";
import { ListUsersByRoleUseCase } from "../../application/useCases/listUsersByRole/ListUsersByRoleUseCase";
import { UserPrismaRepository } from "../../infrastructure/repositories/UserPrismaRepository";
import { authenticateJwt, authorizeRoles } from "../../../auth/presentation/middleware/jwtStrategy";
import { validateRequest } from "../../../auth/presentation/middleware/validateRequest";
import { UpdateUserRoleSchema } from "../validation/updateUserRoleSchema";
import { PrismaClient } from "../../../../infrastructure/database/generated/prisma";

/**
 * @openapi
 * tags:
 *   name: Users
 *   description: User management and operations. Requires ADMIN privileges for some operations.
 */

const router = Router();
const prisma = new PrismaClient();

// Initialize repositories
const userPrismaRepository = new UserPrismaRepository(prisma);

// Initialize use cases
const updateUserRoleUseCase = new UpdateUserRoleUseCase(userPrismaRepository);
const listUsersByRoleUseCase = new ListUsersByRoleUseCase(userPrismaRepository);

// Initialize controller
const usersController = new UsersController(updateUserRoleUseCase, listUsersByRoleUseCase);

/**
 * @openapi
 * /users/{userId}/role:
 *   put:
 *     tags: [Users]
 *     summary: Update a user's role
 *     description: Allows an ADMIN to change the role of a specified user, including upgrading to TECH_LEAD/ADMIN or downgrading to TEAM_MEMBER. Requires JWT authentication.
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
 *           examples:
 *             teamMember:
 *               summary: Downgrade user to team member
 *               value:
 *                 newRole: "TEAM_MEMBER"
 *             techLead:
 *               summary: Set user as tech lead
 *               value:
 *                 newRole: "TECH_LEAD"
 *     responses:
 *       '200':
 *         description: User role updated successfully. Returns the updated user details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       '400':
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 */
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

/**
 * @openapi
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: List users
 *     description: Retrieves a list of users. Can be filtered by role. If no role is provided, all users are listed. Requires ADMIN privileges.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         required: false
 *         schema:
 *           type: string
 *           enum: [TEAM_MEMBER, TECH_LEAD, ADMIN]
 *         description: The role to filter users by. If omitted, all users are listed.
 *     responses:
 *       '200':
 *         description: A list of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserResponse'
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 */
router.get(
  "/",
  authenticateJwt,
  authorizeRoles([UserRole.ADMIN]),
  usersController.listUsersByRole.bind(usersController),
);

export default router;
