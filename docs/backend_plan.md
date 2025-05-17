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

### Phase 1: Setup & Core Infrastructure

1.  **Environment Configuration (`dotenv`, `pino`)**
    *   Set up `.env` for `DATABASE_URL`, `JWT_SECRET`, `PORT`, etc.
    *   Initialize `pino` for structured logging. Configure `pino-pretty` for development.
    *   Create `src/config/index.ts` to load and export configurations.
    *   Create `src/utils/logger.ts` to export a pre-configured `pino` instance.

2.  **Prisma Schema & Initial Migration (`prisma`, `pg`)**
    *   Define models in `prisma/schema.prisma`:
        *   `User`: `id`, `email`, `password`, `role` (Enum: `TeamMember`, `TechLead`, `Admin`), `createdAt`, `updatedAt`.
        *   `Team`: `id`, `name`, `createdAt`, `updatedAt`.
        *   `Category`: `id`, `name`, `createdAt`, `updatedAt`.
        *   `Kudo`: `id`, `message`, `recipientName`, `createdAt`, `updatedAt`.
        *   Define relations: `Kudo` to `User` (giver), `Team`, `Category`.
    *   Run initial migration:
        ```bash
        npx prisma migrate dev --name init
        ```
    *   Generate Prisma Client:
        ```bash
        npx prisma generate
        ```

3.  **Basic Express Server Setup (`express`, `cors`, `typescript`)**
    *   Create `src/server.ts` to initialize the Express app.
    *   Apply `cors` middleware: `app.use(cors());`
    *   Add body parsing middleware: `app.use(express.json());`
    *   Add a health check endpoint (e.g., `GET /health`).
    *   Ensure `tsconfig.json` is configured (e.g., `outDir: "./dist"`).
    *   Verify `npm run build` and `npm run dev` scripts.

### Phase 2: Authentication & User Management

4.  **Authentication Module (`bcrypt`, `jsonwebtoken`, `passport`, `passport-jwt`, `zod`, `prisma`)**
    *   **Directory:** `src/modules/auth/`
    *   **Validation (`auth.validation.ts`):** Zod schemas for registration (`UserCreateInput`) and login (`UserLoginInput`) request bodies.
    *   **Service (`auth.service.ts`):**
        *   `registerUser(data: UserCreateInput)`: Hash password with `bcrypt`, save user using Prisma Client (default role: `TeamMember`).
        *   `loginUser(data: UserLoginInput)`: Find user by email, compare password with `bcrypt.compare()`, generate JWT using `jsonwebtoken.sign()`.
    *   **Controller (`auth.controller.ts`):**
        *   Route handlers for `POST /auth/register` and `POST /auth/login`.
        *   Use a validation middleware (see Phase 5) with Zod schemas.
    *   **Passport JWT Strategy (`src/middleware/auth.middleware.ts` or `src/config/passport.ts`):**
        *   Configure `passport-jwt` strategy to extract JWT from `Authorization: Bearer <token>` header.
        *   Create `authenticateJwt` middleware using `passport.authenticate('jwt', { session: false })`.
    *   **User Roles & Management (Admin):**
        *   Directory: `src/modules/users/` (or extend auth)
        *   Service method to update user role.
        *   Controller for `PUT /users/{userId}/role` (Admin only).
        *   Create `authorizeRole(['Admin'])` middleware. This middleware should:
            1.  Come *after* `authenticateJwt`.
            2.  Check `req.user.role` against the allowed roles.
            3.  Return 403 Forbidden if not authorized.

### Phase 3: Core Feature Modules (Layered Architecture)

**General Module Structure (e.g., for `src/modules/kudos/`)**

*   **`kudos.model.ts` (or use Prisma generated types):** TypeScript interfaces/types for Kudo objects, API payloads.
*   **`kudos.validation.ts` (`zod`):** Zod schemas for request validation (e.g., kudo creation payload, query parameters).
*   **`kudos.repository.ts` (`@prisma/client`):**
    *   Handles all database interactions using Prisma Client.
    *   Example functions: `create(data)`, `findById(id)`, `findAll(params)`, `update(id, data)`, `delete(id)`.
*   **`kudos.service.ts`:**
    *   Contains business logic.
    *   Calls repository methods.
    *   Handles authorization logic specific to the module (e.g., checking if user is Tech Lead/Admin for kudo creation).
*   **`kudos.controller.ts` (`express`):**
    *   Defines Express route handlers.
    *   Uses validation middleware (for body, params, query).
    *   Calls appropriate service methods.
    *   Formats and sends HTTP responses (data and status codes).
*   **`kudos.routes.ts` (`express`):**
    *   Defines an Express `Router` for the module (e.g., `kudosRouter`).
    *   Applies `authenticateJwt` and relevant `authorizeRole` middleware.
    *   Mount this router in `src/server.ts` or `src/routes/index.ts`.

5.  **Teams Module (`src/modules/teams/`)**
    *   Follow the general module structure.
    *   **Endpoints:**
        *   `POST /teams` (Admin): Create team (body: `{ name: string }`).
        *   `GET /teams`: List all teams (for dropdowns, Admin management).
        *   `PUT /teams/{teamId}` (Admin): Update team.
        *   `DELETE /teams/{teamId}` (Admin): Delete team (consider cascading or disallowing if kudos are linked).
    *   Service methods should interact with `prisma.team`.

6.  **Categories Module (`src/modules/categories/`)**
    *   Follow the general module structure.
    *   **Endpoints:**
        *   `POST /categories` (Tech Lead, Admin): Create category (body: `{ name: string }`).
        *   `GET /categories`: List all categories.
        *   `PUT /categories/{categoryId}` (Admin): Update category.
        *   `DELETE /categories/{categoryId}` (Admin): Delete category.
    *   Service methods should interact with `prisma.category`.

7.  **Kudos Module (`src/modules/kudos/`)**
    *   Follow the general module structure.
    *   **Endpoints:**
        *   `POST /kudos` (Tech Lead, Admin): Create kudo (body: `{ recipientName: string, teamId: string, categoryId: string, message: string }`). The giver is `req.user.id`.
        *   `GET /kudos`: Get all kudos.
            *   Query params for filtering: `recipientName?: string`, `teamId?: string`, `categoryId?: string`.
            *   Query param for searching: `searchTerm?: string` (search across `recipientName`, `team.name`, `category.name`).
            *   Query param for sorting: `sortBy=recent|oldest` (default: `recent`).
    *   Repository `findAll` method needs to implement complex Prisma query with conditional `where` clauses and `orderBy`.

8.  **Analytics Module (`src/modules/analytics/`, `date-fns`)**
    *   Follow the general module structure (mostly service and controller).
    *   Use `date-fns` for calculating date ranges for period filters (`weekly`, `monthly`, `quarterly`, `yearly`).
    *   **Endpoints (All GET, viewable by all logged-in users):**
        *   `/analytics/top-recognitions?period=<period>`:
            *   Returns: `{ topIndividuals: [{ name: string, count: number }], topTeams: [{ name: string, count: number }] }`.
            *   Service logic: Use Prisma `groupBy` and `count` on Kudos, filtered by date range.
        *   `/analytics/trending-words?period=<period>`:
            *   Returns: `{ trendingWords: [{ word: string, count: number }] }`.
            *   Service logic: Fetch Kudos messages, tokenize, remove stop-words (simple array of common words), count frequencies.
        *   `/analytics/trending-categories?period=<period>`:
            *   Returns: `{ trendingCategories: [{ name: string, count: number }] }`.
            *   Service logic: Use Prisma `groupBy` `categoryId` and `count` on Kudos, filtered by date range.

### Phase 4: Testing, Refinement & SOPs

9.  **Automated Testing (`jest`, `ts-jest`)**
    *   Write unit tests for service methods (mock repositories and dependencies).
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
    *   Document coding standards (naming conventions, file organization as outlined here) in a `CONTRIBUTING.md` or similar.

12. **Deployment Preparation**
    *   Create/Refine `Dockerfile` for containerization.
        *   Multi-stage build: one stage for `npm install` and `npm run build`, another for copying `dist`, `node_modules`, `prisma` folder, and `package.json`.
        *   Ensure `prisma generate` is run before starting the app in the Docker container if not part of the build.
    *   Review `build` and `start` scripts. The `start` script should run migrations if necessary: `prisma migrate deploy && node dist/server.js`.

## Main Router Structure

Create `src/routes/index.ts`:

```typescript
import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import userRoutes from '../modules/users/user.routes'; // If user management is separate
import teamRoutes from '../modules/teams/team.routes';
import categoryRoutes from '../modules/categories/category.routes';
import kudoRoutes from '../modules/kudos/kudo.routes';
import analyticsRoutes from '../modules/analytics/analytics.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes); // Or merge into auth/admin specific routes
router.use('/teams', teamRoutes);
router.use('/categories', categoryRoutes);
router.use('/kudos', kudoRoutes);
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