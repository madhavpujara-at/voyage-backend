import { Router } from "express";
import { PrismaClient } from "../../../../infrastructure/database/generated/prisma";
import { KudoCardController } from "../controllers/kudoCards.controller";
import { CreateKudoCardsUseCase } from "../../application/useCases/createKudoCards/CreateKudoCardsUseCase";
import { ListKudoCardsUseCase } from "../../application/useCases/listKudoCards/ListKudoCardsUseCase";
import { KudoCardPrismaRepository } from "../../infrastructure/repositories/KudoCardsPrismaRepository";
import { validateRequest } from "../middleware/validateRequest";
import { createKudoCardsSchema } from "../validation/createKudoCardsSchema";
import { listKudoCardsSchema } from "../validation/listKudoCardsSchema";
import { authenticateJwt, authorizeRoles } from "../../../auth/presentation/middleware/jwtStrategy";

/**
 * @openapi
 * tags:
 *   name: KudoCards
 *   description: API endpoints for kudo cards management
 */

// Export a function to create the router (following the same pattern as other modules)
export const createKudoCardRouter = (kudoCardController: KudoCardController) => {
  const router = Router();

  /**
   * @openapi
   * /kudoCards:
   *   post:
   *     tags: [KudoCards]
   *     summary: Create a new kudo card
   *     description: Creates a new kudo card with the provided details. Only accessible to Tech Lead and Admin roles.
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateKudoCardInput'
   *     responses:
   *       '200':
   *         description: Kudo card created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/KudoCardResponse'
   *       '400':
   *         description: Invalid input data
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ValidationErrorResponse'
   */
  router.post(
    "/",
    authenticateJwt,
    authorizeRoles(["TECH_LEAD", "ADMIN"]),
    validateRequest(createKudoCardsSchema),
    (req, res) => kudoCardController.createKudoCard(req, res),
  );

  /**
   * @openapi
   * /kudoCards:
   *   get:
   *     tags: [KudoCards]
   *     summary: List all kudo cards
   *     description: Retrieves a list of kudo cards with optional filtering. Accessible to all authenticated users.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: category
   *         schema:
   *           type: string
   *         description: Filter by category ID
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [DRAFT, PUBLISHED]
   *         description: Filter by kudo card status
   *     responses:
   *       '200':
   *         description: List of kudo cards retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/KudoCardResponse'
   *       '400':
   *         description: Bad request
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ValidationErrorResponse'
   */
  router.get("/", authenticateJwt, validateRequest(listKudoCardsSchema, true), (req, res) =>
    kudoCardController.listKudoCards(req, res),
  );

  return router;
};

// For direct usage and backward compatibility
const router = Router();
const prisma = new PrismaClient();
const kudoCardRepository = new KudoCardPrismaRepository(prisma);
const createKudoCardsUseCase = new CreateKudoCardsUseCase(kudoCardRepository);
const listKudoCardsUseCase = new ListKudoCardsUseCase(kudoCardRepository);
const kudoCardController = new KudoCardController(createKudoCardsUseCase, listKudoCardsUseCase);

export default createKudoCardRouter(kudoCardController);
