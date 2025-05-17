import { PrismaClient } from "@/infrastructure/database/generated/prisma";
import { TeamPrismaRepository } from "./infrastructure/repositories/TeamPrismaRepository";
import { CreateTeamUseCase } from "./application/useCases/createTeam/CreateTeamUseCase";
import { ListTeamsUseCase } from "./application/useCases/listTeams/ListTeamsUseCase";
import { UpdateTeamUseCase } from "./application/useCases/updateTeam/UpdateTeamUseCase";
import { DeleteTeamUseCase } from "./application/useCases/deleteTeam/DeleteTeamUseCase";
import { TeamsController } from "./presentation/controllers/teams.controller";
import { createTeamsRouter } from "./presentation/routes/teams.routes";

// Factory function to create and wire up all dependencies
export const createTeamsModule = (prisma: PrismaClient) => {
  // Create repository (infrastructure layer)
  const teamRepository = new TeamPrismaRepository(prisma);

  // Create use cases (application layer)
  const createTeamUseCase = new CreateTeamUseCase(teamRepository);
  const listTeamsUseCase = new ListTeamsUseCase(teamRepository);
  const updateTeamUseCase = new UpdateTeamUseCase(teamRepository);
  const deleteTeamUseCase = new DeleteTeamUseCase(teamRepository);

  // Create controller (presentation layer)
  const teamsController = new TeamsController(
    createTeamUseCase,
    listTeamsUseCase,
    updateTeamUseCase,
    deleteTeamUseCase,
  );

  // Create router
  const teamsRouter = createTeamsRouter(teamsController);

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
