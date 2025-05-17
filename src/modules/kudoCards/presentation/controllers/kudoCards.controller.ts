import { Request, Response } from "express";
import { CreateKudoCardsUseCase } from "../../application/useCases/createKudoCards/CreateKudoCardsUseCase";
import { ListKudoCardsUseCase } from "../../application/useCases/listKudoCards/ListKudoCardsUseCase";
import { CreateKudoCardsRequestDto } from "../../application/useCases/createKudoCards/CreateKudoCardsRequestDto";
import { ListKudoCardsRequestDto } from "../../application/useCases/listKudoCards/ListKudoCardsRequestDto";

// Define custom interface for authenticated requests
interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export class KudoCardController {
  constructor(
    private readonly createKudoCardsUseCase: CreateKudoCardsUseCase,
    private readonly listKudoCardsUseCase: ListKudoCardsUseCase,
  ) {}

  async createKudoCard(req: Request, res: Response): Promise<void> {
    try {
      // Get user ID from authenticated user - cast to AuthenticatedRequest
      const { id: giverId } = (req as AuthenticatedRequest).user;

      // Execute use case
      const result = await this.createKudoCardsUseCase.execute(req.body as CreateKudoCardsRequestDto, giverId);

      // Return success response
      res.status(200).json(result);
    } catch (error: unknown) {
      // Handle errors
      console.error("Error creating kudo card:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create kudo card",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async listKudoCards(req: Request, res: Response): Promise<void> {
    try {
      // Convert query parameters to request DTO
      const requestDto: ListKudoCardsRequestDto = {
        recipientName: req.query.recipientName as string | undefined,
        teamId: req.query.teamId as string | undefined,
        categoryId: req.query.categoryId as string | undefined,
        searchTerm: req.query.searchTerm as string | undefined,
        sortBy: req.query.sortBy as "recent" | "oldest" | undefined,
      };

      // Execute use case
      const result = await this.listKudoCardsUseCase.execute(requestDto);

      // Return success response
      res.status(200).json(result);
    } catch (error: unknown) {
      // Handle errors
      console.error("Error listing kudo cards:", error);
      res.status(500).json({
        message: "Failed to list kudo cards",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
