"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
/**
 * Middleware to validate incoming requests against a Zod schema
 */
const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            // Only validate the request body against the schema
            await schema.parseAsync(req.body);
            return next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return res.status(400).json({
                    status: "error",
                    message: "Validation failed",
                    errors: error.errors,
                });
            }
            return next(error);
        }
    };
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=validateRequest.js.map