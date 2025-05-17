"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTeamsModule = void 0;
const TeamPrismaRepository_1 = require("./infrastructure/repositories/TeamPrismaRepository");
const CreateTeamUseCase_1 = require("./application/useCases/createTeam/CreateTeamUseCase");
const ListTeamsUseCase_1 = require("./application/useCases/listTeams/ListTeamsUseCase");
const UpdateTeamUseCase_1 = require("./application/useCases/updateTeam/UpdateTeamUseCase");
const DeleteTeamUseCase_1 = require("./application/useCases/deleteTeam/DeleteTeamUseCase");
const teams_controller_1 = require("./presentation/controllers/teams.controller");
const teams_routes_1 = require("./presentation/routes/teams.routes");
// Factory function to create and wire up all dependencies
const createTeamsModule = (prisma) => {
    // Create repository (infrastructure layer)
    const teamRepository = new TeamPrismaRepository_1.TeamPrismaRepository(prisma);
    // Create use cases (application layer)
    const createTeamUseCase = new CreateTeamUseCase_1.CreateTeamUseCase(teamRepository);
    const listTeamsUseCase = new ListTeamsUseCase_1.ListTeamsUseCase(teamRepository);
    const updateTeamUseCase = new UpdateTeamUseCase_1.UpdateTeamUseCase(teamRepository);
    const deleteTeamUseCase = new DeleteTeamUseCase_1.DeleteTeamUseCase(teamRepository);
    // Create controller (presentation layer)
    const teamsController = new teams_controller_1.TeamsController(createTeamUseCase, listTeamsUseCase, updateTeamUseCase, deleteTeamUseCase);
    // Create router
    const teamsRouter = (0, teams_routes_1.createTeamsRouter)(teamsController);
    return {
        router: teamsRouter,
        repository: teamRepository,
        controller: teamsController,
        useCases: {
            createTeamUseCase,
            listTeamsUseCase,
            updateTeamUseCase,
            deleteTeamUseCase,
        },
    };
};
exports.createTeamsModule = createTeamsModule;
//# sourceMappingURL=index.js.map