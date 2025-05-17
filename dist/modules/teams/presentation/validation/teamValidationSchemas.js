"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTeamSchema = exports.updateTeamWithParamsSchema = exports.teamIdSchema = exports.updateTeamSchema = exports.createTeamSchema = void 0;
const zod_1 = require("zod");
// Schema for creating a team
exports.createTeamSchema = zod_1.z.object({
    name: zod_1.z.string()
        .min(1, 'Team name is required')
        .max(100, 'Team name cannot exceed 100 characters')
        .trim()
});
// Schema for updating a team
exports.updateTeamSchema = zod_1.z.object({
    name: zod_1.z.string()
        .min(1, 'Team name is required')
        .max(100, 'Team name cannot exceed 100 characters')
        .trim()
});
// Schema for team ID parameter
exports.teamIdSchema = zod_1.z.object({
    teamId: zod_1.z.string()
        .uuid('Invalid team ID format')
});
// Combined schema for update operation (params + body)
exports.updateTeamWithParamsSchema = exports.teamIdSchema.merge(exports.updateTeamSchema);
// Combined schema for delete operation (params only)
exports.deleteTeamSchema = exports.teamIdSchema;
//# sourceMappingURL=teamValidationSchemas.js.map