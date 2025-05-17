"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTeamsRouter = void 0;
const express_1 = require("express");
const validationMiddleware_1 = require("../validation/validationMiddleware");
const jwtStrategy_1 = require("../../../auth/presentation/middleware/jwtStrategy");
const teamValidationSchemas_1 = require("../validation/teamValidationSchemas");
// We'll inject the controller instance when registering routes
const createTeamsRouter = (controller) => {
    const router = (0, express_1.Router)();
    // Create team (Admin only)
    router.post("/", jwtStrategy_1.authenticateJwt, (0, jwtStrategy_1.authorizeRoles)(["Admin"]), (0, validationMiddleware_1.validateRequest)(teamValidationSchemas_1.createTeamSchema), controller.createTeam.bind(controller));
    // Get all teams (Any authenticated user)
    router.get("/", jwtStrategy_1.authenticateJwt, controller.listTeams.bind(controller));
    // Update team (Admin only)
    router.put("/:teamId", jwtStrategy_1.authenticateJwt, (0, jwtStrategy_1.authorizeRoles)(["Admin"]), (0, validationMiddleware_1.validateRequest)(teamValidationSchemas_1.updateTeamWithParamsSchema), controller.updateTeam.bind(controller));
    // Delete team (Admin only)
    router.delete("/:teamId", jwtStrategy_1.authenticateJwt, (0, jwtStrategy_1.authorizeRoles)(["Admin"]), (0, validationMiddleware_1.validateRequest)(teamValidationSchemas_1.deleteTeamSchema), controller.deleteTeam.bind(controller));
    return router;
};
exports.createTeamsRouter = createTeamsRouter;
//# sourceMappingURL=teams.routes.js.map