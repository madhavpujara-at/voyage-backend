import { PrismaClient } from "@/infrastructure/database/generated/prisma";
import { KudoCardPrismaRepository } from "./infrastructure/repositories/KudoCardsPrismaRepository";
import { CreateKudoCardsUseCase } from "./application/useCases/createKudoCards/CreateKudoCardsUseCase";
import { ListKudoCardsUseCase } from "./application/useCases/listKudoCards/ListKudoCardsUseCase";
import { KudoCardController } from "./presentation/controllers/kudoCards.controller";
import { createKudoCardRouter } from "./presentation/routes/kudoCards.routes";

// Factory function to create and wire up all dependencies
export const createKudoCardsModule = (prisma: PrismaClient) => {
  // Create repository (infrastructure layer)
  const kudoCardRepository = new KudoCardPrismaRepository(prisma);

  // Create use cases (application layer)
  const createKudoCardsUseCase = new CreateKudoCardsUseCase(kudoCardRepository);
  const listKudoCardsUseCase = new ListKudoCardsUseCase(kudoCardRepository);

  // Create controller (presentation layer)
  const kudoCardController = new KudoCardController(createKudoCardsUseCase, listKudoCardsUseCase);

  // Create router
  const kudoCardRouter = createKudoCardRouter(kudoCardController);

  return {
    router: kudoCardRouter,
    repository: kudoCardRepository,
    controller: kudoCardController,
    useCases: {
      createKudoCardsUseCase,
      listKudoCardsUseCase,
    },
  };
};

// Export types for external use
export * from "./domain/entities/KudoCards";
export * from "./domain/interfaces/repositories/IKudoCardsRepository";
export * from "./application/useCases/createKudoCards/CreateKudoCardsRequestDto";
export * from "./application/useCases/createKudoCards/CreateKudoCardsResponseDto";
export * from "./application/useCases/listKudoCards/ListKudoCardsRequestDto";
export * from "./application/useCases/listKudoCards/ListKudoCardsResponseDto";
