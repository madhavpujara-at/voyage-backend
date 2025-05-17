"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTeamUseCase = void 0;
class UpdateTeamUseCase {
    constructor(teamRepository) {
        this.teamRepository = teamRepository;
    }
    async execute(request) {
        // Find the team by ID
        const team = await this.teamRepository.findById(request.teamId);
        if (!team) {
            throw new Error(`Team with ID '${request.teamId}' not found`);
        }
        // Check if the new name already exists for another team
        if (team.getName() !== request.name) {
            const existingTeamWithName = await this.teamRepository.findByName(request.name);
            if (existingTeamWithName && existingTeamWithName.id !== team.id) {
                throw new Error(`Team with name '${request.name}' already exists`);
            }
        }
        // Update the team name
        team.updateName(request.name);
        // Save the updated team
        await this.teamRepository.save(team);
        // Return the updated team data
        return {
            team: team.toObject(),
        };
    }
}
exports.UpdateTeamUseCase = UpdateTeamUseCase;
//# sourceMappingURL=UpdateTeamUseCase.js.map