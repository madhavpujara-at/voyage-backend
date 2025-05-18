import { Router } from "express";
import { UserRole } from "../../../auth/domain/entities/User";
import { UsersController } from "../controllers/users.controller";
import { UpdateUserRoleUseCase } from "../../application/useCases/updateUserRole/UpdateUserRoleUseCase";
import { ListTeamMembersUseCase } from "../../application/useCases/listTeamMembers/ListTeamMembersUseCase";
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
const listTeamMembersUseCase = new ListTeamMembersUseCase(userPrismaRepository);

// Initialize controller
const usersController = new UsersController(updateUserRoleUseCase, listTeamMembersUseCase);

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
 *           example:
 *             newRole: "TECH_LEAD"
 *           examples:
 *             teamMember:
 *               summary: Set user as team member
 *               value:
 *                 newRole: "TEAM_MEMBER"
 *             techLead:
 *               summary: Set user as tech lead
 *               value:
 *                 newRole: "TECH_LEAD"
 *             admin:
 *               summary: Set user as admin
 *               value:
 *                 newRole: "ADMIN"
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
 * /users/team-members:
 *   get:
 *     tags: [Users]
 *     summary: List all team members
 *     description: Retrieves a list of all users with the role TEAM_MEMBER. Requires ADMIN privileges.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of team members.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 teamMembers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TeamMemberOutput'
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden. Insufficient permissions.
 */
router.get(
  "/team-members",
  authenticateJwt,
  authorizeRoles([UserRole.ADMIN]),
  usersController.listTeamMembers.bind(usersController),
);

export default router;
