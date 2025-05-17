"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const ValidationError_1 = require("../../../../shared/errors/ValidationError");
const validateRequest = (schema) => {
    return (req, _res, next) => {
        try {
            const result = schema.parse({
                ...req.body,
                ...req.params,
                ...req.query,
            });
            // Replace request data with validated data
            req.body = result;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const validationErrors = error.errors.map((err) => ({
                    path: err.path.join("."),
                    message: err.message,
                }));
                next(new ValidationError_1.ValidationError("Validation failed", validationErrors));
            }
            else {
                next(error);
            }
        }
    };
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=validationMiddleware.js.map