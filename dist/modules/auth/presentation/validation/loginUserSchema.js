"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserSchema = void 0;
const zod_1 = require("zod");
/**
 * Zod schema for validating user login requests
 */
exports.LoginUserSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z.string().min(1, "Password is required"),
});
//# sourceMappingURL=loginUserSchema.js.map