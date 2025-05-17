"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTeamUseCase = void 0;
const Team_1 = require("../../../domain/entities/Team");
class CreateTeamUseCase {
    constructor(teamRepository) {
        this.teamRepository = teamRepository;
    }
    async execute(request) {
        // Check if a team with this name already exists
        const existingTeam = await this.teamRepository.findByName(request.name);
        if (existingTeam) {
            throw new Error(`Team with name '${request.name}' already exists`);
        }
        // Create a new team entity
        const now = new Date();
        const team = new Team_1.Team(crypto.randomUUID(), // Generate a UUID for the team
        request.name, now, now);
        // Save the team to the repository
        await this.teamRepository.save(team);
        // Return the team data
        return {
            team: team.toObject(),
        };
    }
}
exports.CreateTeamUseCase = CreateTeamUseCase;
//# sourceMappingURL=CreateTeamUseCase.js.map