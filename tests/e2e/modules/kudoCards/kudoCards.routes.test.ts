import request from "supertest";
import express from "express";
import { createKudoCardRouter } from "../../../../src/modules/kudoCards/presentation/routes/kudoCards.routes";
import { KudoCardController } from "../../../../src/modules/kudoCards/presentation/controllers/kudoCards.controller";
import { KudoCardPrismaRepository } from "../../../../src/modules/kudoCards/infrastructure/repositories/KudoCardsPrismaRepository";
import { CreateKudoCardsUseCase } from "../../../../src/modules/kudoCards/application/useCases/createKudoCards/CreateKudoCardsUseCase";
import { ListKudoCardsUseCase } from "../../../../src/modules/kudoCards/application/useCases/listKudoCards/ListKudoCardsUseCase";

// Mock Prisma module with the necessary classes
jest.mock("../../../../src/infrastructure/database/generated/prisma", () => {
  // Create a mock for PrismaClientKnownRequestError
  class MockPrismaClientKnownRequestError extends Error {
    code: string;
    clientVersion: string;

    constructor(message: string, { code, clientVersion }: { code: string; clientVersion: string }) {
      super(message);
      this.name = "PrismaClientKnownRequestError";
      this.code = code;
      this.clientVersion = clientVersion;
    }
  }

  // Create a mock PrismaClient class
  class MockPrismaClient {
    kudo: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
    };

    constructor() {
      this.kudo = {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      };
    }
  }

  return {
    PrismaClient: MockPrismaClient,
    Prisma: {
      PrismaClientKnownRequestError: MockPrismaClientKnownRequestError,
      SortOrder: {
        asc: "asc",
        desc: "desc",
      },
    },
  };
});

// Import Prisma after mocking
import { PrismaClient, Prisma } from "../../../../src/infrastructure/database/generated/prisma";

// Mock authentication middleware
jest.mock("../../../../src/modules/auth/presentation/middleware/jwtStrategy", () => ({
  authenticateJwt: (req: any, res: any, next: any) => {
    // Add mock authenticated user
    req.user = {
      id: "mock-user-id",
      email: "user@example.com",
      role: "TECH_LEAD",
    };
    next();
  },
  authorizeRoles: (roles: string[]) => (req: any, res: any, next: any) => {
    // For simplicity, we'll just allow the role we set above
    next();
  },
}));

// Mock validation middleware
jest.mock("../../../../src/modules/kudoCards/presentation/middleware/validateRequest", () => ({
  validateRequest: () => (req: any, res: any, next: any) => {
    next();
  },
}));

describe("KudoCard Routes (E2E)", () => {
  let app: express.Application;
  let mockPrisma: PrismaClient;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup express app
    app = express();
    app.use(express.json());

    // Create new mock Prisma instance
    mockPrisma = new PrismaClient();

    // Setup repository and use cases
    const repository = new KudoCardPrismaRepository(mockPrisma);
    const createUseCase = new CreateKudoCardsUseCase(repository);
    const listUseCase = new ListKudoCardsUseCase(repository);

    // Setup controller and router
    const controller = new KudoCardController(createUseCase, listUseCase);
    const kudoCardRouter = createKudoCardRouter(controller);

    // Add router to app
    app.use("/api/kudoCards", kudoCardRouter);
  });

  describe("POST /api/kudoCards", () => {
    it("should create a new kudo card", async () => {
      // Mock the Prisma create method to return a successful response
      const mockKudoCard = {
        id: "card-123",
        message: "Great job!",
        recipientName: "John Doe",
        giverId: "mock-user-id",
        teamId: "team-123",
        categoryId: "category-123",
        createdAt: new Date(),
        updatedAt: new Date(),
        team: { id: "team-123", name: "Engineering" },
        category: { id: "category-123", name: "Teamwork" },
        giver: { id: "mock-user-id", email: "user@example.com" },
      };

      // Setup the prisma mock to return null for findUnique (new entity)
      (mockPrisma.kudo.findUnique as jest.Mock).mockResolvedValue(null);

      // Setup the prisma mock to return the expected results
      (mockPrisma.kudo.create as jest.Mock).mockResolvedValue(mockKudoCard);

      // Send the request
      const response = await request(app).post("/api/kudoCards").send({
        message: "Great job!",
        recipientName: "John Doe",
        teamId: "team-123",
        categoryId: "category-123",
      });

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("success", true);
    }, 10000); // Increase timeout to 10 seconds

    it("should handle database errors when creating a kudo card", async () => {
      // Setup the prisma mock to throw an error
      const databaseError = new Error("Database connection failed");
      (mockPrisma.kudo.findUnique as jest.Mock).mockRejectedValue(databaseError);

      // Send the request
      const response = await request(app).post("/api/kudoCards").send({
        message: "Great job!",
        recipientName: "John Doe",
        teamId: "team-123",
        categoryId: "category-123",
      });

      // Assertions
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message", "Failed to create kudo card");
      expect(response.body.error).toBeDefined();
    });

    it("should handle resource not found errors when creating a kudo card", async () => {
      // Setup the prisma mock to throw a not found error
      const notFoundError = new Prisma.PrismaClientKnownRequestError("Record not found", {
        code: "P2025",
        clientVersion: "4.0.0",
      });
      (mockPrisma.kudo.findUnique as jest.Mock).mockResolvedValue(null);
      (mockPrisma.kudo.create as jest.Mock).mockRejectedValue(notFoundError);

      // Send the request
      const response = await request(app).post("/api/kudoCards").send({
        message: "Great job!",
        recipientName: "John Doe",
        teamId: "non-existent-team",
        categoryId: "category-123",
      });

      // Assertions
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message", "Resource not found");
    });

    it("should handle foreign key constraint failures when creating a kudo card", async () => {
      // Setup the prisma mock to throw a foreign key constraint error
      const foreignKeyError = new Prisma.PrismaClientKnownRequestError("Foreign key constraint failed", {
        code: "P2003",
        clientVersion: "4.0.0",
      });
      foreignKeyError.meta = { field_name: "teamId" };
      (mockPrisma.kudo.findUnique as jest.Mock).mockResolvedValue(null);
      (mockPrisma.kudo.create as jest.Mock).mockRejectedValue(foreignKeyError);

      // Send the request
      const response = await request(app).post("/api/kudoCards").send({
        message: "Great job!",
        recipientName: "John Doe",
        teamId: "invalid-team-id",
        categoryId: "category-123",
      });

      // Assertions
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message", "Invalid reference");
      expect(response.body.error).toBeDefined();
    });
  });

  describe("GET /api/kudoCards", () => {
    it("should return a list of kudo cards", async () => {
      // Mock the Prisma findMany method to return kudo cards
      const mockKudoCards = [
        {
          id: "card-123",
          message: "Great job!",
          recipientName: "John Doe",
          giverId: "user-123",
          teamId: "team-123",
          categoryId: "category-123",
          createdAt: new Date(),
          updatedAt: new Date(),
          team: { id: "team-123", name: "Engineering" },
          category: { id: "category-123", name: "Teamwork" },
          giver: { id: "user-123", email: "user@example.com" },
        },
        {
          id: "card-456",
          message: "Excellent work!",
          recipientName: "Jane Smith",
          giverId: "user-456",
          teamId: "team-123",
          categoryId: "category-123",
          createdAt: new Date(),
          updatedAt: new Date(),
          team: { id: "team-123", name: "Engineering" },
          category: { id: "category-123", name: "Teamwork" },
          giver: { id: "user-456", email: "user2@example.com" },
        },
      ];

      // Setup the prisma mock
      (mockPrisma.kudo.findMany as jest.Mock).mockResolvedValue(mockKudoCards);

      // Send the request
      const response = await request(app).get("/api/kudoCards").query({
        recipientName: "John",
        teamId: "team-123",
        sortBy: "recent",
      });

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("kudoCards");
      expect(response.body).toHaveProperty("total");
      expect(Array.isArray(response.body.kudoCards)).toBe(true);
    }, 10000); // Increase timeout to 10 seconds

    it("should return an empty list when no cards match criteria", async () => {
      // Mock the Prisma findMany method to return empty array
      (mockPrisma.kudo.findMany as jest.Mock).mockResolvedValue([]);

      // Send the request
      const response = await request(app).get("/api/kudoCards").query({
        recipientName: "NonExistentUser",
      });

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("kudoCards");
      expect(response.body.kudoCards).toHaveLength(0);
      expect(response.body.total).toBe(0);
    }, 10000); // Increase timeout to 10 seconds

    it("should handle database errors when listing kudo cards", async () => {
      // Setup the prisma mock to throw an error
      const databaseError = new Error("Database query failed");
      (mockPrisma.kudo.findMany as jest.Mock).mockRejectedValue(databaseError);

      // Send the request
      const response = await request(app).get("/api/kudoCards");

      // Assertions
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message", "Failed to list kudo cards");
      expect(response.body.error).toBeDefined();
    });
  });
});
