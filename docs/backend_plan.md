# Backend Development Plan: Digital Kudos Wall

This document outlines the plan for developing the backend of the Digital Kudos Wall application, based on the PRD and the selected NPM packages.

## Core Technologies

*   **Runtime/Framework:** Node.js with Express.js
*   **Language:** TypeScript
*   **ORM:** Prisma
*   **Database:** PostgreSQL (assumed, as `pg` is a dependency)
*   **Authentication:** JWT with Passport.js (`passport-jwt`)
*   **Validation:** Zod
*   **Testing:** Jest with `ts-jest`
*   **Linting/Formatting:** ESLint, Prettier
*   **Logging:** Pino
*   **Environment Variables:** `dotenv`

## Development Phases

### Phase 1: Setup & Core Infrastructure (Basic Express Focus)

1.  **Initial Project & Express Server Setup (`express`, `typescript`, `dotenv`, `cors`)**
    *   Verify `package.json`: Ensure it exists and core dependencies like `express`, `typescript`, `ts-node` (or `ts-node-dev`), `@types/express`, `@types/node`, `dotenv`, `cors`, `@types/cors` are listed and installed. Add any missing ones.
    *   Verify `tsconfig.json`: Ensure it exists and is correctly configured (e.g., `outDir: "./dist"`, `rootDir: "./src"`, `esModuleInterop: true`, `moduleResolution: "node"`). Adjust as necessary.
    *   Create/Update `.env` file: Ensure it exists and contains at least an initial `PORT` (e.g., `PORT=3000`).
    *   Create `src/` directory if it doesn't exist.
    *   Create `src/server.ts` (if it doesn't exist or is incomplete):
        *   Import `express`, `cors`, `dotenv`.
        *   Call `dotenv.config()` at the top.
        *   Initialize the Express app: `const app = express();`.
        *   Apply `cors()` middleware: `app.use(cors());`.
        *   Add body parsing middleware: `app.use(express.json());`.
        *   Add a health check endpoint (e.g., `GET /health` that returns a 200 status).
        *   Start the server using the port from `.env` or a default: `const port = process.env.PORT || 3001; app.listen(port, () => console.log(\`Server running on port ${port}\`));` (logging will be improved in the next step).
    *   Verify/Configure `build` script in `package.json` (e.g., `"build": "tsc"` or `"build": "rimraf ./dist && tsc"`). Install `rimraf` if used.
    *   Verify/Configure `dev` script in `package.json` (e.g., `"dev": "ts-node-dev --respawn --transpile-only src/server.ts"` or `"dev": "nodemon src/server.ts"`). Ensure `ts-node-dev` or `nodemon` with `ts-node` is set up.
    *   Ensure `npm run build` and `npm run dev` scripts work and the server is accessible.

2.  **Logging Integration (`pino`)**
    *   Verify/Install logging dependencies: `pino`, `pino-pretty` (for development). Add to `package.json` if missing.
    *   Create `src/shared/` directory if it doesn't exist.
    *   Create `src/shared/logger.ts` (if it doesn't exist or is incomplete) to export a pre-configured `pino` instance.
        *   Configure `pino-pretty` for development environment logs.
        *   Example basic logger setup:
            ```typescript
            // src/shared/logger.ts
            import pino from 'pino';
            // Potentially import config for log level if not done via process.env directly
            // import config from '../config'; // if config.ts is in src/config/

            const logger = pino({
              transport: process.env.NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined,
              // level: config.logLevel || process.env.LOG_LEVEL || 'info', // Example using config
              level: process.env.LOG_LEVEL || 'info', // Simpler: rely on .env
            });

            export default logger;
            ```
    *   Integrate basic logging in `src/server.ts`:
        *   Import the logger (e.g., `import logger from './shared/logger';`).
        *   Replace `console.log` for server start with `logger.info(\`Server running on port ${port}\`);`.
        *   (Optional) Add a simple request logging middleware using the logger.

3.  **Expanded Environment & Configuration Management**
    *   Update `.env`: Ensure it includes `DATABASE_URL`, `JWT_SECRET`, and `LOG_LEVEL` (e.g., `DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"`, `JWT_SECRET="your-secret-key"`, `LOG_LEVEL="info"`).
    *   Create `src/config/` directory if it doesn't exist.
    *   Create `src/config/index.ts` (if it doesn't exist or is incomplete) to load, (optionally validate), and export configurations.
        *   Example structure:
            ```typescript
            import dotenv from 'dotenv';

            dotenv.config(); // Ensure .env is read

            const config = {
              port: process.env.PORT || '3001',
              databaseUrl: process.env.DATABASE_URL,
              jwtSecret: process.env.JWT_SECRET,
              nodeEnv: process.env.NODE_ENV || 'development',
              logLevel: process.env.LOG_LEVEL || 'info',
              // Add other configurations as needed
            };

            // Optional: Add validation logic here for critical variables
            if (!config.databaseUrl && config.nodeEnv !== 'test' && config.nodeEnv !== 'development') {
              // Allow missing DB URL in dev/test for initial setup without DB
              console.error("FATAL ERROR: DATABASE_URL is not set in production.");
              // process.exit(1); // Consider exiting in production
            }
            if (!config.jwtSecret && config.nodeEnv !== 'test') {
              console.error("FATAL ERROR: JWT_SECRET is not set.");
              // process.exit(1);
            }

            export default config;
            ```
    *   Refactor `src/server.ts` and `src/shared/logger.ts` to use the centralized configuration from `src/config/index.ts` (e.g., `config.port`, `config.logLevel`, `config.nodeEnv`). (Note: The logger example above already refers to `process.env.LOG_LEVEL` or `config.logLevel`).

4.  **Database Setup with Prisma (`prisma`, `pg`)**
    *   Verify/Install database and ORM dependencies: `prisma`, `pg`. Add to `package.json` if missing.
    *   Verify Prisma setup: The `prisma/` directory and `prisma/schema.prisma` file should exist. If `prisma init` was not run, do so: `npx prisma init --datasource-provider postgresql` and ensure `DATABASE_URL` in `.env` is correctly picked up or set.
    *   Define/Update models in `prisma/schema.prisma` as per the original plan:
        *   `User`: `id`, `email`, `password`, `role` (Enum: `TeamMember`, `TechLead`, `Admin`), `createdAt`, `updatedAt`.
        *   `Team`: `id`, `name`, `createdAt`, `updatedAt`.
        *   `Category`: `id`, `name`, `createdAt`, `updatedAt`.
        *   `KudoCards`: `id`, `message`, `recipientName`, `createdAt`, `updatedAt`.
        *   Define relations: `KudoCards` to `User` (giver), `Team`, `Category`.
    *   Run/Verify initial migration to create tables in the database:
        ```bash
        npx prisma migrate dev --name init
        ```
        (If models/migrations already exist, this might be a different migration or already completed. Adapt as needed.)
    *   Generate/Regenerate Prisma Client based on your schema:
        ```bash
        npx prisma generate
        ```
    *   (Optional but recommended) Create/Verify a Prisma client instance export (e.g., `src/db.ts` or `src/prismaClient.ts`):
        ```typescript
        // src/prismaClient.ts
        import { PrismaClient } from '@prisma/client';

        // Optional: Add logging or other Prisma Client extensions if needed
        const prisma = new PrismaClient({
          log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
        });

        export default prisma;
        ```

### Phase 2: Authentication & User Management

4.  **Authentication Module (`bcrypt`, `jsonwebtoken`, `passport`, `passport-jwt`, `zod`, `prisma`)**
    *   **Directory Structure:** `src/modules/auth/`
        *   `domain/`:
            *   `entities/User.ts` (Leverage Prisma generated types or define explicit domain entity if complex behavior is added)
            *   `interfaces/IUserRepository.ts` (Interface for user data operations)
        *   `application/`:
            *   `useCases/registerUser/`:
                *   `RegisterUserUseCase.ts` (Handles registration logic: hash password, save user with default role)
                *   `RegisterUserRequestDto.ts` (Plain interface defining input data structure)
                *   `RegisterUserResponseDto.ts` (Defines registration output, e.g., user info without password)
            *   `useCases/loginUser/`:
                *   `LoginUserUseCase.ts` (Handles login logic: find user, compare password, generate JWT)
                *   `LoginUserRequestDto.ts` (Plain interface defining input data structure)
                *   `LoginUserResponseDto.ts` (Defines login output, e.g., user info and JWT)
            *   `dtos/` (Shared DTOs for the auth module if any, or keep them specific to use cases)
        *   `presentation/`:
            *   `controllers/auth.controller.ts` (Route handlers for `/register` and `/login`, calls use cases)
            *   `routes/auth.routes.ts` (Defines `POST /auth/register` and `POST /auth/login` routes)
            *   `validation/` (Contains Zod schemas that validate against the application DTOs)
                *   `registerUserSchema.ts` (Zod schema for registration input validation)
                *   `loginUserSchema.ts` (Zod schema for login input validation)
            *   `middleware/validateRequest.ts` (Middleware to validate requests against schemas)
        *   `infrastructure/`:
            *   `repositories/UserPrismaRepository.ts` (Implements `IUserRepository` using Prisma Client)
    *   **Passport JWT Strategy (`src/modules/auth/presentation/middleware/jwtStrategy.ts`):**
        *   Configure `passport-jwt` strategy to extract JWT from `Authorization: Bearer <token>` header.
        *   Create `authenticateJwt` middleware using `passport.authenticate('jwt', { session: false })`.
    *   **User Roles & Management (Admin):**
        *   **Directory Structure:** `src/modules/users/`
            *   `domain/`:
                *   (Potentially share `User.ts` entity and `IUserRepository.ts` from `auth` module or define specific admin-related interfaces if needed)
            *   `application/`:
                *   `useCases/updateUserRole/`:
                    *   `UpdateUserRoleUseCase.ts` (Handles logic to update a user's role)
                    *   `UpdateUserRoleRequestDto.ts` (Plain interface defining input data structure: `userId`, `newRole`)
                    *   `UpdateUserRoleResponseDto.ts` (Defines output: updated user info)
            *   `presentation/`:
                *   `controllers/users.controller.ts` (Route handler for `PUT /users/{userId}/role`)
                *   `routes/users.routes.ts` (Defines the route, protected by `authenticateJwt` and `authorizeRole(['Admin'])`)
                *   `validation/` (Zod schemas for request parameters/body)
                    *   `updateUserRoleSchema.ts` (Zod schema for validating role update requests)
            *   `infrastructure/`:
                *   (Likely uses the same `UserPrismaRepository.ts` from `auth` module)
        *   Create `authorizeRoles(['Admin'])` middleware. This middleware should:
            1.  Come *after* `authenticateJwt`.
            2.  Check `req.user.role` against the allowed roles.
            3.  Return 403 Forbidden if not authorized.

### Phase 3: Core Feature Modules (Layered Architecture)

**General Clean Architecture Module Structure (e.g., for `src/modules/kudos/`)**

*   **`src/modules/[ModuleName]/domain/`**
    *   `entities/`: Core business objects (e.g., `Kudo.ts`). Can leverage Prisma types or be custom classes with logic.
    *   `interfaces/repositories/`: Repository interfaces (e.g., `IKudoRepository.ts`) defining data access contracts.
    *   `(optional) services/`: Domain services for logic spanning multiple entities or complex rules.
    *   `(optional) valueObjects/`: Value objects (e.g., `MessageContent.ts`).
*   **`src/modules/[ModuleName]/application/`**
    *   `useCases/[useCaseName]/`: Each use case gets its own folder.
        *   `[UseCaseName]UseCase.ts`: Implements a specific application task (e.g., `CreateKudoUseCase.ts`).
        *   `[UseCaseName]RequestDto.ts`: Defines the input data structure as a plain interface.
        *   `[UseCaseName]ResponseDto.ts`: Defines the output data structure.
    *   `(optional) services/`: Application services for broader tasks or orchestration.
    *   `dtos/`: Shared DTOs for the module, or DTOs can live within their respective use case folders.
*   **`src/modules/[ModuleName]/presentation/`**
    *   `controllers/`: Express route handlers (e.g., `kudos.controller.ts`). They call application use cases.
    *   `routes/`: Express router definitions (e.g., `kudos.routes.ts`). Applies middleware like `authenticateJwt`, `authorizeRole`, and validation.
    *   `validation/`: Zod schemas that validate against application DTOs.
        *   Each validation schema should be in its own file (e.g., `createKudoSchema.ts`)
        *   Schemas should import the corresponding application DTOs for type checking
    *   `(optional) mappers/`: For transforming data between presentation DTOs and application DTOs if needed.
*   **`src/modules/[ModuleName]/infrastructure/`**
    *   `repositories/`: Concrete repository implementations using Prisma (e.g., `KudoPrismaRepository.ts` implementing `IKudoRepository.ts`).
    *   `(optional) mappers/`: For transforming data between domain entities and Prisma models if complex.

5.  **Teams Module (`src/modules/teams/`)**
    *   Follow the General Clean Architecture Module Structure.
    *   **Domain:** `Team` entity, `ITeamRepository` interface.
    *   **Application:**
        *   `CreateTeamUseCase` (Input: `{ name: string }`)
        *   `ListTeamsUseCase`
        *   `UpdateTeamUseCase`
        *   `DeleteTeamUseCase`
    *   **Presentation:** Controllers and routes for:
        *   `POST /teams` (Admin): Create team.
        *   `GET /teams`: List all teams.
        *   `PUT /teams/{teamId}` (Admin): Update team.
        *   `DELETE /teams/{teamId}` (Admin): Delete team.
    *   **Infrastructure:** `TeamPrismaRepository` implementing `ITeamRepository`.

6.  **Categories Module (`src/modules/categories/`)**
    *   Follow the General Clean Architecture Module Structure.
    *   **Domain:** `Category` entity, `ICategoryRepository` interface.
    *   **Application:**
        *   `CreateCategoryUseCase` (Input: `{ name: string }`)
        *   `ListCategoriesUseCase`
        *   `UpdateCategoryUseCase`
        *   `DeleteCategoryUseCase`
    *   **Presentation:** Controllers and routes for:
        *   `POST /categories` (Tech Lead, Admin): Create category.
        *   `GET /categories`: List all categories.
        *   `PUT /categories/{categoryId}` (Admin): Update category.
        *   `DELETE /categories/{categoryId}` (Admin): Delete category.
    *   **Infrastructure:** `CategoryPrismaRepository` implementing `ICategoryRepository`.

7.  **KudoCards Module (`src/modules/kudoCards/`)**
    *   Follow the General Clean Architecture Module Structure.
    *   **Domain:** `KudoCards` entity, `IKudoCardsRepository` interface. Giver is `userId` from authenticated user.
    *   **Application:**
        *   `CreateKudoCardsUseCase` (Input: `{ recipientName: string, teamId: string, categoryId: string, message: string }`, `giverId` from `req.user`)
        *   `ListKudoCardsUseCase` (Handles filtering, searching, sorting based on query params)
            *   `ListKudoCardsRequestDto` to capture query params: `recipientName?: string`, `teamId?: string`, `categoryId?: string`, `searchTerm?: string`, `sortBy=recent|oldest`.
    *   **Presentation:** Controllers and routes for:
        *   `POST /kudoCards` (Tech Lead, Admin): Create kudoCards.
        *   `GET /kudoCards`: Get all kudoCards with filtering, searching, and sorting.
    *   **Infrastructure:** `KudoCardsPrismaRepository` implementing `IKudoCardsRepository`. Its `findAll` method needs to implement complex Prisma query with conditional `where` clauses and `orderBy`.

8.  **Analytics Module (`src/modules/analytics/`, `date-fns`)**
    *   Follow the General Clean Architecture Module Structure. May rely on repositories from other modules or have its own read-optimized data views/repositories.
    *   Use `date-fns` for date calculations within Application Layer use cases.
    *   **Domain:** May not have its own rich domain entities if primarily aggregating data. Could define interfaces for analytics data structures.
    *   **Application:**
        *   `GetTopRecognitionsUseCase` (Input: `period=<period>`)
            *   Returns: `{ topIndividuals: [{ name: string, count: number }], topTeams: [{ name: string, count: number }] }`.
            *   Logic: Use Prisma `groupBy` and `count` on KudoCards, filtered by date range. This will involve calling `IKudoCardsRepository`.
        *   `GetTrendingWordsUseCase` (Input: `period=<period>`)
            *   Returns: `{ trendingWords: [{ word: string, count: number }] }`.
            *   Logic: Fetch KudoCards messages (via `IKudoCardsRepository`), tokenize, remove stop-words, count frequencies.
        *   `GetTrendingCategoriesUseCase` (Input: `period=<period>`)
            *   Returns: `{ trendingCategories: [{ name: string, count: number }] }`.
            *   Logic: Use Prisma `groupBy` `categoryId` and `count` on KudoCards (via `IKudoCardsRepository`), filtered by date range.
    *   **Presentation:** Controllers and routes for (All GET, viewable by all logged-in users):
        *   `/analytics/top-recognitions?period=<period>`
        *   `/analytics/trending-words?period=<period>`
        *   `/analytics/trending-categories?period=<period>`
    *   **Infrastructure:** May not have its own dedicated repositories if it reuses existing ones (e.g., `KudoPrismaRepository`). If it had specialized views or tables, it would have its own.

### Phase 4: Testing, Refinement & SOPs

9.  **Automated Testing (`jest`, `ts-jest`)**
    *   Write unit tests for Application Layer use cases (mock repository interfaces and other dependencies).
    *   Write integration tests for API endpoints (use a separate test database or Prisma mocking solution).
        *   Test cases for successful operations, validation errors, authorization errors.
    *   Focus on PRD requirements: kudos creation, retrieval, filtering, authentication, analytics.
    *   Setup Jest config (`jest.config.js`) and `test` script in `package.json`.

10. **Error Handling & Middleware**
    *   Implement a global error handling middleware in `src/server.ts` (must be the last `app.use()`):
        ```typescript
        // Example:
        // app.use((err, req, res, next) => {
        //   logger.error(err);
        //   const statusCode = err.statusCode || 500;
        //   res.status(statusCode).json({
        //     message: err.message || 'Internal Server Error',
        //     ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        //   });
        // });
        ```
    *   Define custom error classes if needed (e.g., `ApiError extends Error` with a `statusCode` property).

11. **SOPs (`eslint`, `prettier`, `husky`)**
    *   Configure `.eslintrc.js` (with `@typescript-eslint/parser` and relevant plugins).
    *   Configure `.prettierrc.js` or use `package.json` for Prettier settings.
    *   Ensure `husky` pre-commit hooks in `.husky/pre-commit` run linting, formatting, and potentially tests:
        ```bash
        #!/bin/sh
        . "$(dirname "$0")/_/husky.sh"

        npm run lint
        npm run format
        # npm run test # Optional: can slow down commits
        ```
    *   Document coding standards (naming conventions, file organization as outlined here reflecting Clean Architecture) in a `CONTRIBUTING.md` or similar.

12. **Deployment Preparation**
    *   Create/Refine `Dockerfile` for containerization.
        *   Multi-stage build: one stage for `npm install` and `npm run build`, another for copying `dist`, `node_modules`, `prisma` folder, and `package.json`.
        *   Ensure `prisma generate` is run before starting the app in the Docker container if not part of the build.
    *   Review `build` and `start` scripts. The `start` script should run migrations if necessary: `prisma migrate deploy && node dist/server.js`.

## Main Router Structure

Create `src/routes/index.ts`:

```typescript
import { Router } from 'express';
import authRoutes from '../modules/auth/presentation/routes/auth.routes';
import userRoutes from '../modules/users/presentation/routes/users.routes'; // If user management is separate
import teamRoutes from '../modules/teams/presentation/routes/team.routes';
import categoryRoutes from '../modules/categories/presentation/routes/category.routes';
import kudoCardsRoutes from '../modules/kudoCards/presentation/routes/kudoCards.routes';
import analyticsRoutes from '../modules/analytics/presentation/routes/analytics.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes); // Or merge into auth/admin specific routes
router.use('/teams', teamRoutes);
router.use('/categories', categoryRoutes);
router.use('/kudoCards', kudoCardsRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
```

In `src/server.ts`:

```typescript
// ... other imports
import mainRouter from './routes';
// ...
app.use('/api/v1', mainRouter); // Prefix all routes with /api/v1
// ... global error handler
```

This plan provides a structured approach to building the backend. Each phase and step can be broken down further into smaller, manageable tasks. 