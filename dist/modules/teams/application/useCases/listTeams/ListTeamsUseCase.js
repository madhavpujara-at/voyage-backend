"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListTeamsUseCase = void 0;
class ListTeamsUseCase {
    constructor(teamRepository) {
        this.teamRepository = teamRepository;
    }
    async execute(_request) {
        // Fetch all teams from the repository
        const teams = await this.teamRepository.findAll();
        // Map domain entities to DTOs
        const teamDtos = teams.map((team) => ({
            id: team.id,
            name: team.getName(),
            createdAt: team.createdAt,
            updatedAt: team.updatedAt,
        }));
        // Return the teams
        return {
            teams: teamDtos,
        };
    }
}
exports.ListTeamsUseCase = ListTeamsUseCase;
//# sourceMappingURL=ListTeamsUseCase.js.map