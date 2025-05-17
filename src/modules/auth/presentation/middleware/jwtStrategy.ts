import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptionsWithRequest } from "passport-jwt";
import { Request } from "express";
import config from "../../../../config";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { ITokenBlacklistService } from "../../domain/interfaces/ITokenBlacklistService";
import pinoLoggerFactory from "../../../../shared/logger/pino-logger";

const logger = pinoLoggerFactory.createLogger("JwtStrategy");

/**
 * Initialize and configure the JWT strategy for Passport
 */
export function initializeJwtStrategy(
  userRepository: IUserRepository,
  tokenBlacklistService: ITokenBlacklistService,
): void {
  const options: StrategyOptionsWithRequest = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret,
    passReqToCallback: true,
  };

  passport.use(
    new JwtStrategy(options, async (req: Request, jwtPayload: any, done: any) => {
      try {
        // First check if token is blacklisted
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        if (token && (await tokenBlacklistService.isBlacklisted(token))) {
          logger.warn(`Rejected blacklisted token for user: ${jwtPayload.sub}`);
          return done(null, false, { message: "Token has been revoked" });
        }

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
      } catch (error: unknown) {
        logger.error("Error authenticating user with JWT", error);
        return done(error, false);
      }
    }),
  );
}

/**
 * Middleware to authenticate requests using JWT
 * Usage: app.use(authenticateJwt)
 */
export const authenticateJwt = passport.authenticate("jwt", { session: false });

/**
 * Middleware to authorize access based on user roles
 * Usage: app.use(authorizeRoles(['ADMIN', 'TECH_LEAD']))
 */
export const authorizeRoles = (allowedRoles: string[]) => {
  return (req: any, res: any, next: any) => {
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
