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

// Export a function to create the router (following the same pattern as other modules)
export const createKudoCardRouter = (kudoCardController: KudoCardController) => {
  const router = Router();

  /**
   * @route POST /kudoCards
   * @desc Create a new kudo card
   * @access Tech Lead, Admin only
   */
  router.post(
    "/",
    authenticateJwt,
    authorizeRoles(["TECH_LEAD", "ADMIN"]),
    validateRequest(createKudoCardsSchema),
    (req, res) => kudoCardController.createKudoCard(req, res),
  );

  /**
   * @route GET /kudoCards
   * @desc Get all kudo cards with optional filtering
   * @access All authenticated users
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
