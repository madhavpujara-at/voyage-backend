"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePasswords = comparePasswords;
exports.generateToken = generateToken;
exports.extractUserIdFromToken = extractUserIdFromToken;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../../../config"));
/**
 * Hash a password using bcrypt
 */
async function hashPassword(password) {
    const saltRounds = 10;
    return bcrypt_1.default.hash(password, saltRounds);
}
/**
 * Compare a plain text password with a hashed password
 */
async function comparePasswords(plainPassword, hashedPassword) {
    return bcrypt_1.default.compare(plainPassword, hashedPassword);
}
/**
 * Generate JWT token for a user
 */
function generateToken(user) {
    // Create a payload with only the necessary user info
    const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
    };
    // Sign and return the token
    return jsonwebtoken_1.default.sign(payload, config_1.default.jwtSecret, {
        expiresIn: "24h", // Token expires in 24 hours
    });
}
/**
 * Extract user ID from JWT token
 */
function extractUserIdFromToken(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
        return decoded.sub;
    }
    catch (error) {
        return null;
    }
}
//# sourceMappingURL=authUtils.js.map