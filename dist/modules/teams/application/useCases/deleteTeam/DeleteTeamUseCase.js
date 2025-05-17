"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteTeamUseCase = void 0;
class DeleteTeamUseCase {
    constructor(teamRepository) {
        this.teamRepository = teamRepository;
    }
    async execute(request) {
        // Find the team by ID to ensure it exists
        const team = await this.teamRepository.findById(request.teamId);
        if (!team) {
            throw new Error(`Team with ID '${request.teamId}' not found`);
        }
        // Delete the team
        await this.teamRepository.delete(request.teamId);
        // Return success
        return {
            success: true,
        };
    }
}
exports.DeleteTeamUseCase = DeleteTeamUseCase;
//# sourceMappingURL=DeleteTeamUseCase.js.map