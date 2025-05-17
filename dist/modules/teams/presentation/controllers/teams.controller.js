"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamsController = void 0;
/**
 * Teams Controller
 *
 * Handles HTTP requests related to team operations.
 * Request validation occurs in middleware before reaching these methods.
 * By the time these methods are called, request data is already validated
 * against the schemas defined in teamValidationSchemas.ts.
 */
class TeamsController {
    constructor(createTeamUseCase, listTeamsUseCase, updateTeamUseCase, deleteTeamUseCase) {
        this.createTeamUseCase = createTeamUseCase;
        this.listTeamsUseCase = listTeamsUseCase;
        this.updateTeamUseCase = updateTeamUseCase;
        this.deleteTeamUseCase = deleteTeamUseCase;
    }
    /**
     * Create a new team
     * Expects validated request body: { name: string }
     */
    async createTeam(req, res, next) {
        try {
            const result = await this.createTeamUseCase.execute(req.body);
            res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * List all teams
     * No request validation needed
     */
    async listTeams(req, res, next) {
        try {
            const result = await this.listTeamsUseCase.execute({});
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Update an existing team
     * Expects validated data: { teamId: string, name: string }
     * Where teamId comes from URL params and name from request body
     */
    async updateTeam(req, res, next) {
        try {
            // By this point, req.body contains validated teamId and name from the combined schema
            const result = await this.updateTeamUseCase.execute(req.body);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Delete a team by ID
     * Expects validated teamId from URL params
     */
    async deleteTeam(req, res, next) {
        try {
            const result = await this.deleteTeamUseCase.execute(req.body);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.TeamsController = TeamsController;
//# sourceMappingURL=teams.controller.js.map