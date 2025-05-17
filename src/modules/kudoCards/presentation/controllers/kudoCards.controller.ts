import { Request, Response } from "express";
import { CreateKudoCardsUseCase } from "../../application/useCases/createKudoCards/CreateKudoCardsUseCase";
import { ListKudoCardsUseCase } from "../../application/useCases/listKudoCards/ListKudoCardsUseCase";
import { CreateKudoCardsRequestDto } from "../../application/useCases/createKudoCards/CreateKudoCardsRequestDto";
import { ListKudoCardsRequestDto } from "../../application/useCases/listKudoCards/ListKudoCardsRequestDto";
import { Prisma } from "../../../../infrastructure/database/generated/prisma";

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
      // Verify user authentication
      const authenticatedReq = req as AuthenticatedRequest;
      if (!authenticatedReq.user || !authenticatedReq.user.id) {
        res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      // Get user ID from authenticated user
      const { id: giverId } = authenticatedReq.user;

      // Execute use case
      const result = await this.createKudoCardsUseCase.execute(req.body as CreateKudoCardsRequestDto, giverId);

      // Return success response with 200 Created status
      res.status(200).json(result);
    } catch (error) {
      // Handle errors
      console.error("Error creating kudo card:", error);
      
      // Check for validation errors from the domain
      if (
        error instanceof Error &&
        (error.message.includes("name") ||
          error.message.includes("Message") ||
          error.message.includes("empty") ||
          error.message.includes("exceed"))
      ) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          error: error.message,
        });
        return;
      }
      
      // Check for Prisma-specific errors
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002 is for unique constraint violations
        if (error.code === 'P2002') {
          res.status(409).json({
            success: false,
            message: "Resource already exists",
            error: "A kudo card with this identifier already exists",
          });
          return;
        }
        
        // P2025 is for records not found
        if (error.code === 'P2025') {
          res.status(404).json({
            success: false,
            message: "Resource not found",
            error: "The referenced record could not be found",
          });
          return;
        }
        
        // P2003 is for foreign key constraint failures
        if (error.code === 'P2003') {
          res.status(400).json({
            success: false,
            message: "Invalid reference",
            error: "One of the referenced entities does not exist",
          });
          return;
        }
      }
      
      // Generic error handling for other cases
      res.status(500).json({
        success: false,
        message: "Failed to create kudo card",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async listKudoCards(req: Request, res: Response): Promise<void> {
    try {
      // Verify user authentication
      const authenticatedReq = req as AuthenticatedRequest;
      if (!authenticatedReq.user || !authenticatedReq.user.id) {
        res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

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
    } catch (error) {
      // Handle errors
      console.error("Error listing kudo cards:", error);
      
      // Check for Prisma-specific errors
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          res.status(404).json({
            success: false,
            message: "Resource not found",
            error: "The requested record could not be found",
          });
          return;
        }
      }
      
      res.status(500).json({
        success: false,
        message: "Failed to list kudo cards",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
