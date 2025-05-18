import { Router } from "express";
import { TeamsController } from "../controllers/teams.controller";
import { validateRequest } from "../validation/validationMiddleware";
import { authenticateJwt, authorizeRoles } from "../../../auth/presentation/middleware/jwtStrategy";
import { createTeamSchema, updateTeamWithParamsSchema, deleteTeamSchema } from "../validation/teamValidationSchemas";

/**
 * @openapi
 * tags:
 *   name: Teams
 *   description: API endpoints for teams management
 */

// We'll inject the controller instance when registering routes
export const createTeamsRouter = (controller: TeamsController) => {
  const router = Router();

  /**
   * @openapi
   * /teams:
   *   post:
   *     tags: [Teams]
   *     summary: Create a new team
   *     description: Creates a new team with the provided details. Only accessible to Admin role.
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateTeamInput'
   *     responses:
   *       '200':
   *         description: Team created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TeamResponse'
   *       '400':
   *         description: Invalid input data
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ValidationErrorResponse'
   */
  router.post(
    "/",
    authenticateJwt,
    authorizeRoles(["ADMIN"]),
    validateRequest(createTeamSchema),
    controller.createTeam.bind(controller),
  );

  /**
   * @openapi
   * /teams:
   *   get:
   *     tags: [Teams]
   *     summary: List all teams
   *     description: Retrieves a list of all teams. Accessible to all authenticated users.
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       '200':
   *         description: List of teams retrieved successfully
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
   *                     $ref: '#/components/schemas/TeamResponse'
   *       '400':
   *         description: Bad request
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ValidationErrorResponse'
   */
  router.get("/", authenticateJwt, controller.listTeams.bind(controller));

  /**
   * @openapi
   * /teams/{teamId}:
   *   put:
   *     tags: [Teams]
   *     summary: Update a team
   *     description: Updates an existing team with the provided details. Only accessible to Admin role.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: teamId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Unique identifier of the team to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateTeamInput'
   *     responses:
   *       '200':
   *         description: Team updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TeamResponse'
   *       '400':
   *         description: Invalid input data
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ValidationErrorResponse'
   */
  router.put(
    "/:teamId",
    authenticateJwt,
    authorizeRoles(["ADMIN"]),
    validateRequest(updateTeamWithParamsSchema),
    controller.updateTeam.bind(controller),
  );

  /**
   * @openapi
   * /teams/{teamId}:
   *   delete:
   *     tags: [Teams]
   *     summary: Delete a team
   *     description: Deletes an existing team. Only accessible to Admin role.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: teamId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Unique identifier of the team to delete
   *     responses:
   *       '200':
   *         description: Team deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 message:
   *                   type: string
   *                   example: Team deleted successfully
   *       '400':
   *         description: Invalid request
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ValidationErrorResponse'
   */
  router.delete(
    "/:teamId",
    authenticateJwt,
    authorizeRoles(["ADMIN"]),
    validateRequest(deleteTeamSchema),
    controller.deleteTeam.bind(controller),
  );

  return router;
};
