"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
class ValidationError extends Error {
    constructor(message, errors) {
        super(message);
        this.statusCode = 400;
        this.name = 'ValidationError';
        this.errors = errors;
    }
}
exports.ValidationError = ValidationError;
//# sourceMappingURL=ValidationError.js.map