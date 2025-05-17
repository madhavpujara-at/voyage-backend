"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../controllers/users.controller");
const UpdateUserRoleUseCase_1 = require("../../application/useCases/updateUserRole/UpdateUserRoleUseCase");
const UserPrismaRepository_1 = require("@/modules/auth/infrastructure/repositories/UserPrismaRepository");
const jwtStrategy_1 = require("@/modules/auth/presentation/middleware/jwtStrategy");
const validateRequest_1 = require("@/modules/auth/presentation/middleware/validateRequest");
const zod_1 = require("zod");
// Initialize router
const router = (0, express_1.Router)();
// Initialize repositories
const userRepository = new UserPrismaRepository_1.UserPrismaRepository();
// Initialize use cases
const updateUserRoleUseCase = new UpdateUserRoleUseCase_1.UpdateUserRoleUseCase(userRepository);
// Initialize controller
const usersController = new users_controller_1.UsersController(updateUserRoleUseCase);
// Define routes
router.put("/:userId/role", jwtStrategy_1.authenticateJwt, (0, jwtStrategy_1.authorizeRoles)(["ADMIN"]), (req, res, next) => {
    // Add userId from params to the body for validation
    req.body.userId = req.params.userId;
    next();
}, (0, validateRequest_1.validateRequest)(zod_1.z.object({
    userId: zod_1.z.string().uuid("Invalid user ID format"),
    newRole: zod_1.z.enum(["TEAM_MEMBER", "TECH_LEAD", "ADMIN"], {
        errorMap: () => ({ message: "Role must be one of: TEAM_MEMBER, TECH_LEAD, ADMIN" }),
    }),
})), usersController.updateRole);
exports.default = router;
//# sourceMappingURL=users.routes.js.map