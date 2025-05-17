import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validateRequest } from "../middleware/validateRequest";
import { RegisterUserSchema } from "../validation/registerUserSchema";
import { LoginUserSchema } from "../validation/loginUserSchema";
import { RegisterUserUseCase } from "../../application/useCases/registerUser/RegisterUserUseCase";
import { LoginUserUseCase } from "../../application/useCases/loginUser/LoginUserUseCase";
import { UserPrismaRepository } from "../../infrastructure/repositories/UserPrismaRepository";

// Component schemas and security schemes are now defined in src/presentation/schemas/openapi.schemas.ts

// Initialize router
const router = Router();

// Initialize repositories
const userRepository = new UserPrismaRepository();

// Initialize use cases
const registerUserUseCase = new RegisterUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository);

// Initialize controller with use cases
const authController = new AuthController(registerUserUseCase, loginUserUseCase);

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
 *       '201':
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

export default router;
 