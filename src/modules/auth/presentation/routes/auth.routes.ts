import { Router } from "express";
import { validateRequest } from "../middleware/validateRequest";
import { RegisterUserSchema } from "../validation/registerUserSchema";
import { LoginUserSchema } from "../validation/loginUserSchema";
import { LogoutUserSchema } from "../validation/logoutUserSchema";
import { authenticateJwt } from "../middleware/jwtStrategy";
import { AuthController } from "../controllers/auth.controller";
import { UserPrismaRepository } from "../../infrastructure/repositories/UserPrismaRepository";
import { UserPrismaMapper } from "../../infrastructure/mappers/UserMapper";
import { RegisterUserUseCase } from "../../application/useCases/registerUser/RegisterUserUseCase";
import { LoginUserUseCase } from "../../application/useCases/loginUser/LoginUserUseCase";
import { LogoutUserUseCase } from "../../application/useCases/logoutUser/LogoutUserUseCase";
import { InMemoryTokenBlacklistService } from "../../infrastructure/services/InMemoryTokenBlacklistService";

// Component schemas and security schemes are now defined in src/presentation/schemas/openapi.schemas.ts

// Initialize router
const router = Router();

// Create dependencies directly
const userMapper = new UserPrismaMapper();
const userRepository = new UserPrismaRepository(userMapper);
const tokenBlacklistService = new InMemoryTokenBlacklistService();

// Create use cases
const registerUserUseCase = new RegisterUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository);
const logoutUserUseCase = new LogoutUserUseCase(tokenBlacklistService);

// Create controller
const authController = new AuthController(registerUserUseCase, loginUserUseCase, logoutUserUseCase);

// Initialize JWT strategy
import { initializeJwtStrategy } from "../middleware/jwtStrategy";
initializeJwtStrategy(userRepository, tokenBlacklistService);

/**
 * @openapi
 * tags:
 *   name: Authentication
 *   description: API endpoints for user registration and login.
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new user
 *     description: Creates a new user account with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUserInput'
 *     responses:
 *       '200':
 *         description: User registered successfully. Returns the created user's details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       '400':
 *         description: Invalid input data. The request body does not match the required schema.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 */
router.post("/register", validateRequest(RegisterUserSchema), authController.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Log in an existing user
 *     description: Authenticates a user with their email and password, returning an access token and user details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUserInput'
 *     responses:
 *       '200':
 *         description: User logged in successfully. Returns an access token and user details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginSuccessResponse'
 *       '400':
 *         description: Invalid input data. The request body does not match the required schema for login.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       '401':
 *         description: Unauthorized. Invalid email or password.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *             examples:
 *               InvalidCredentialsError:
 *                 value:
 *                   status: "error"
 *                   message: "Invalid email or password"
 *                 summary: Example of an invalid credentials error
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 */
router.post("/login", validateRequest(LoginUserSchema), authController.login);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags: [Authentication]
 *     summary: Log out a user
 *     description: Invalidates the user's JWT token by adding it to a blacklist
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Successfully logged out
 *       '401':
 *         description: Unauthorized. No valid authentication token provided.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseErrorResponse'
 */
router.post("/logout", authenticateJwt, validateRequest(LogoutUserSchema), authController.logout);

export default router;
