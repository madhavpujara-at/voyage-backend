import { Request, Response } from "express";
import { mock, mockReset } from "jest-mock-extended";
import { KudoCardController } from "../../../../../../src/modules/kudoCards/presentation/controllers/kudoCards.controller";
import { CreateKudoCardsUseCase } from "../../../../../../src/modules/kudoCards/application/useCases/createKudoCards/CreateKudoCardsUseCase";
import { ListKudoCardsUseCase } from "../../../../../../src/modules/kudoCards/application/useCases/listKudoCards/ListKudoCardsUseCase";
import { CreateKudoCardsRequestDto } from "../../../../../../src/modules/kudoCards/application/useCases/createKudoCards/CreateKudoCardsRequestDto";
import { ListKudoCardsRequestDto } from "../../../../../../src/modules/kudoCards/application/useCases/listKudoCards/ListKudoCardsRequestDto";
import { Prisma } from "../../../../../../src/infrastructure/database/generated/prisma";

// Define the authenticated request type to match controller's expected authentication
interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

describe("KudoCardController", () => {
  // Setup mocks
  const mockCreateUseCase = mock<CreateKudoCardsUseCase>();
  const mockListUseCase = mock<ListKudoCardsUseCase>();

  // Response and request mocks
  const mockRequest = mock<AuthenticatedRequest>();
  const mockResponse = mock<Response>();

  // Create controller with mocked dependencies
  const controller = new KudoCardController(mockCreateUseCase, mockListUseCase);

  // Standard authenticated user for tests
  const authenticatedUser = {
    id: "user-123",
    email: "user@example.com",
    role: "TECH_LEAD",
  };

  // Reset mocks before each test
  beforeEach(() => {
    mockReset(mockCreateUseCase);
    mockReset(mockListUseCase);
    mockReset(mockRequest);
    mockReset(mockResponse);

    // Setup standard response methods
    mockResponse.status.mockReturnThis();
    mockResponse.json.mockReturnThis();

    // Setup authenticated user for each test
    mockRequest.user = authenticatedUser;
  });

  describe("createKudoCard", () => {
    it("should return 401 if user is not authenticated", async () => {
      // Setup unauthenticated request
      mockRequest.user = undefined as any;

      // Call the controller method
      await controller.createKudoCard(mockRequest, mockResponse);

      // Verify response
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "User not authenticated",
        }),
      );

      // Verify use case was not called
      expect(mockCreateUseCase.execute).not.toHaveBeenCalled();
    });

    it("should create a kudo card successfully", async () => {
      // Setup valid request data
      const validRequestBody: CreateKudoCardsRequestDto = {
        message: "Great teamwork!",
        recipientName: "John Doe",
        teamId: "team-123",
        categoryId: "category-123",
      };

      mockRequest.body = validRequestBody;

      // Setup successful use case response
      const successResponse = {
        id: "card-123",
        success: true,
      };

      mockCreateUseCase.execute.mockResolvedValue(successResponse);

      // Call the controller method
      await controller.createKudoCard(mockRequest, mockResponse);

      // Verify use case was called with correct parameters
      expect(mockCreateUseCase.execute).toHaveBeenCalledWith(validRequestBody, authenticatedUser.id);

      // Verify response
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(successResponse);
    });

    it("should handle validation errors", async () => {
      // Setup invalid request data
      const invalidRequestBody: CreateKudoCardsRequestDto = {
        message: "", // Invalid: empty message
        recipientName: "John Doe",
        teamId: "team-123",
        categoryId: "category-123",
      };

      mockRequest.body = invalidRequestBody;

      // Setup validation error from use case
      const validationError = new Error("Message cannot be empty");
      mockCreateUseCase.execute.mockRejectedValue(validationError);

      // Call the controller method
      await controller.createKudoCard(mockRequest, mockResponse);

      // Verify response
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Validation error",
          error: validationError.message,
        }),
      );
    });

    it("should handle resource not found errors", async () => {
      // Setup request body
      const requestBody: CreateKudoCardsRequestDto = {
        message: "Great job!",
        recipientName: "John Doe",
        teamId: "non-existent-team",
        categoryId: "category-123",
      };

      mockRequest.body = requestBody;

      // Setup Prisma error for resource not found
      const prismaError = new Prisma.PrismaClientKnownRequestError("Record not found", {
        code: "P2025",
        clientVersion: "4.0.0",
      });
      mockCreateUseCase.execute.mockRejectedValue(prismaError);

      // Call the controller method
      await controller.createKudoCard(mockRequest, mockResponse);

      // Verify response
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Resource not found",
        }),
      );
    });

    it("should handle server errors", async () => {
      // Setup request body
      const requestBody: CreateKudoCardsRequestDto = {
        message: "Great job!",
        recipientName: "John Doe",
        teamId: "team-123",
        categoryId: "category-123",
      };

      mockRequest.body = requestBody;

      // Setup a generic server error
      const serverError = new Error("Database connection failed");
      mockCreateUseCase.execute.mockRejectedValue(serverError);

      // Call the controller method
      await controller.createKudoCard(mockRequest, mockResponse);

      // Verify response
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Failed to create kudo card",
          error: serverError.message,
        }),
      );
    });

    it("should handle unique constraint violations", async () => {
      // Setup request body
      const requestBody: CreateKudoCardsRequestDto = {
        message: "Great job!",
        recipientName: "John Doe",
        teamId: "team-123",
        categoryId: "category-123",
      };

      mockRequest.body = requestBody;

      // Setup Prisma error for unique constraint violation
      const uniqueConstraintError = new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
        code: "P2002",
        clientVersion: "4.0.0",
      });
      uniqueConstraintError.meta = { target: ["teamId", "recipientName"] };
      mockCreateUseCase.execute.mockRejectedValue(uniqueConstraintError);

      // Call the controller method
      await controller.createKudoCard(mockRequest, mockResponse);

      // Verify response
      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Resource already exists",
          error: "A kudo card with this identifier already exists",
        }),
      );
    });

    it("should handle foreign key constraint failures", async () => {
      // Setup request body
      const requestBody: CreateKudoCardsRequestDto = {
        message: "Great job!",
        recipientName: "John Doe",
        teamId: "team-123",
        categoryId: "category-123",
      };

      mockRequest.body = requestBody;

      // Setup Prisma error for foreign key constraint failure
      const foreignKeyError = new Prisma.PrismaClientKnownRequestError("Foreign key constraint failed", {
        code: "P2003",
        clientVersion: "4.0.0",
      });
      foreignKeyError.meta = { field_name: "teamId" };
      mockCreateUseCase.execute.mockRejectedValue(foreignKeyError);

      // Call the controller method
      await controller.createKudoCard(mockRequest, mockResponse);

      // Verify response
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Invalid reference",
          error: "One of the referenced entities does not exist",
        }),
      );
    });
  });

  describe("listKudoCards", () => {
    it("should return 401 if user is not authenticated", async () => {
      // Setup unauthenticated request
      mockRequest.user = undefined as any;

      // Call the controller method
      await controller.listKudoCards(mockRequest, mockResponse);

      // Verify response
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "User not authenticated",
        }),
      );

      // Verify use case was not called
      expect(mockListUseCase.execute).not.toHaveBeenCalled();
    });

    it("should list kudo cards successfully with filters", async () => {
      // Setup query parameters
      mockRequest.query = {
        recipientName: "John",
        teamId: "team-123",
        sortBy: "recent",
      };

      // Expected DTO based on query params
      const expectedDto: ListKudoCardsRequestDto = {
        recipientName: "John",
        teamId: "team-123",
        sortBy: "recent",
        categoryId: undefined,
        searchTerm: undefined,
      };

      // Mock response from use case
      const mockResponseData = {
        kudoCards: [
          {
            id: "card-123",
            message: "Great teamwork!",
            recipientName: "John Doe",
            giverId: "user-123",
            teamId: "team-123",
            categoryId: "category-123",
            createdAt: new Date(),
          },
        ],
        total: 1,
      };

      mockListUseCase.execute.mockResolvedValue(mockResponseData);

      // Call the controller method
      await controller.listKudoCards(mockRequest, mockResponse);

      // Verify use case was called with correct parameters
      expect(mockListUseCase.execute).toHaveBeenCalledWith(expectedDto);

      // Verify response
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResponseData);
    });

    it("should handle empty results", async () => {
      // Setup query parameters
      mockRequest.query = {};

      // Mock empty response from use case
      const emptyResponse = {
        kudoCards: [],
        total: 0,
      };

      mockListUseCase.execute.mockResolvedValue(emptyResponse);

      // Call the controller method
      await controller.listKudoCards(mockRequest, mockResponse);

      // Verify response
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(emptyResponse);
    });

    it("should handle server errors", async () => {
      // Setup query parameters
      mockRequest.query = {};

      // Setup a generic server error
      const serverError = new Error("Database query failed");
      mockListUseCase.execute.mockRejectedValue(serverError);

      // Call the controller method
      await controller.listKudoCards(mockRequest, mockResponse);

      // Verify response
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Failed to list kudo cards",
          error: serverError.message,
        }),
      );
    });

    it("should handle resource not found in list", async () => {
      // Setup query parameters that would trigger a not found error
      // For example, looking for a specific team or category that doesn't exist
      mockRequest.query = {
        teamId: "non-existent-team",
      };

      // Setup Prisma error for resource not found
      const notFoundError = new Prisma.PrismaClientKnownRequestError("Record not found", {
        code: "P2025",
        clientVersion: "4.0.0",
      });
      mockListUseCase.execute.mockRejectedValue(notFoundError);

      // Call the controller method
      await controller.listKudoCards(mockRequest, mockResponse);

      // Verify response
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Resource not found",
        }),
      );
    });
  });
});
