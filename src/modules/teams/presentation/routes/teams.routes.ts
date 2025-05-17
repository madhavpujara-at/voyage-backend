import { Router } from "express";
import { TeamsController } from "../controllers/teams.controller";
import { validateRequest } from "../validation/validationMiddleware";
import { authenticateJwt, authorizeRoles } from "../../../auth/presentation/middleware/jwtStrategy";
import { createTeamSchema, updateTeamWithParamsSchema, deleteTeamSchema } from "../validation/teamValidationSchemas";

// We'll inject the controller instance when registering routes
export const createTeamsRouter = (controller: TeamsController) => {
  const router = Router();

  // Create team (Admin only)
  router.post(
    "/",
    authenticateJwt,
    authorizeRoles(["ADMIN"]),
    validateRequest(createTeamSchema),
    controller.createTeam.bind(controller),
  );

  // Get all teams (Any authenticated user)
  router.get("/", authenticateJwt, controller.listTeams.bind(controller));

  // Update team (Admin only)
  router.put(
    "/:teamId",
    authenticateJwt,
    authorizeRoles(["ADMIN"]),
    validateRequest(updateTeamWithParamsSchema),
    controller.updateTeam.bind(controller),
  );

  // Delete team (Admin only)
  router.delete(
    "/:teamId",
    authenticateJwt,
    authorizeRoles(["ADMIN"]),
    validateRequest(deleteTeamSchema),
    controller.deleteTeam.bind(controller),
  );

  return router;
};
