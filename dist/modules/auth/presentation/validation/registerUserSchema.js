"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserSchema = void 0;
const zod_1 = require("zod");
/**
 * Zod schema for validating user registration requests
 */
exports.RegisterUserSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format").max(255, "Email must be less than 255 characters"),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password must be less than 100 characters")
        // Require at least one uppercase letter, one lowercase letter, one number, and one special character
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).+$/, "Password must include uppercase, lowercase, number, and special character"),
});
//# sourceMappingURL=registerUserSchema.js.map