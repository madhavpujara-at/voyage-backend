"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.authenticateJwt = void 0;
exports.initializeJwtStrategy = initializeJwtStrategy;
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const config_1 = __importDefault(require("../../../../config"));
const pino_logger_1 = __importDefault(require("../../../../shared/logger/pino-logger"));
const logger = pino_logger_1.default.createLogger("JwtStrategy");
/**
 * Initialize and configure the JWT strategy for Passport
 */
function initializeJwtStrategy(userRepository) {
    const options = {
        jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config_1.default.jwtSecret,
    };
    passport_1.default.use(new passport_jwt_1.Strategy(options, async (jwtPayload, done) => {
        try {
            // Find the user based on the JWT sub (subject) which is the user ID
            const user = await userRepository.findById(jwtPayload.sub);
            if (!user) {
                logger.warn(`User not found for JWT payload: ${jwtPayload.sub}`);
                return done(null, false);
            }
            // Return the user without the password
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...userWithoutPassword } = user;
            return done(null, userWithoutPassword);
        }
        catch (error) {
            logger.error("Error authenticating user with JWT", error);
            return done(error, false);
        }
    }));
}
/**
 * Middleware to authenticate requests using JWT
 * Usage: app.use(authenticateJwt)
 */
exports.authenticateJwt = passport_1.default.authenticate("jwt", { session: false });
/**
 * Middleware to authorize access based on user roles
 * Usage: app.use(authorizeRoles(['ADMIN', 'TECH_LEAD']))
 */
const authorizeRoles = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            logger.warn("Authorization check called without authenticated user");
            return res.status(401).json({ status: "error", message: "Unauthorized" });
        }
        if (!allowedRoles.includes(req.user.role)) {
            logger.warn(`User ${req.user.id} with role ${req.user.role} attempted to access restricted route`);
            return res.status(403).json({ status: "error", message: "Forbidden: Insufficient permissions" });
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
//# sourceMappingURL=jwtStrategy.js.map