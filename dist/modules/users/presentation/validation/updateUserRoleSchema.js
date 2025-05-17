"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserRoleSchema = void 0;
const zod_1 = require("zod");
/**
 * Zod schema for validating user role update requests
 */
exports.UpdateUserRoleSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid("Invalid user ID format"),
    newRole: zod_1.z.enum(["TEAM_MEMBER", "TECH_LEAD", "ADMIN"], {
        errorMap: () => ({ message: "Role must be one of: TEAM_MEMBER, TECH_LEAD, ADMIN" }),
    }),
});
//# sourceMappingURL=updateUserRoleSchema.js.map