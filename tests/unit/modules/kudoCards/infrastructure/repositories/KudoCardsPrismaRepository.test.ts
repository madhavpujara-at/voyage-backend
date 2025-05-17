import { PrismaClient } from "../../../../../../src/infrastructure/database/generated/prisma";
import { KudoCardPrismaRepository } from "../../../../../../src/modules/kudoCards/infrastructure/repositories/KudoCardsPrismaRepository";
import { KudoCard } from "../../../../../../src/modules/kudoCards/domain/entities/KudoCards";
import { FindAllKudoCardsOptions } from "../../../../../../src/modules/kudoCards/domain/interfaces/repositories/IKudoCardsRepository";

// Define a proper type for our mocked Prisma client
type MockPrismaClient = {
  kudo: {
    create: jest.Mock;
    findMany: jest.Mock;
    findUnique: jest.Mock;
    update: jest.Mock;
  };
};

// Create mock PrismaClient with proper typing
const mockPrismaClient = {
  kudo: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
} as MockPrismaClient;

describe("KudoCardPrismaRepository", () => {
  let repository: KudoCardPrismaRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new KudoCardPrismaRepository(mockPrismaClient as unknown as PrismaClient);
  });

  describe("saveEntity", () => {
    it("should save a kudo card entity correctly", async () => {
      // Create a sample kudo card entity
      const kudoCard = new KudoCard(
        "card-123",
        "Great job!",
        "John Doe",
        "giver-123",
        "team-123",
        "category-123",
        new Date("2023-01-01T00:00:00Z"),
        new Date("2023-01-01T00:00:00Z"),
      );

      // Mock the Prisma findUnique method to return null (new entity)
      mockPrismaClient.kudo.findUnique.mockResolvedValue(null);

      // Mock the Prisma create method
      mockPrismaClient.kudo.create.mockResolvedValue({
        id: "card-123",
        message: "Great job!",
        recipientName: "John Doe",
        giverId: "giver-123",
        teamId: "team-123",
        categoryId: "category-123",
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date("2023-01-01T00:00:00Z"),
        team: { id: "team-123", name: "Engineering" },
        category: { id: "category-123", name: "Teamwork" },
        giver: { id: "giver-123", email: "giver@example.com" },
      });

      // Call the repository method
      const result = await repository.saveEntity(kudoCard);

      // Verify the result
      expect(result).toBeInstanceOf(KudoCard);
      expect(result.getId()).toBe("card-123");
      expect(result.getMessage()).toBe("Great job!");
      expect(result.getTeamName()).toBe("Engineering");

      // Verify that Prisma findUnique was called
      expect(mockPrismaClient.kudo.findUnique).toHaveBeenCalledWith({
        where: { id: "card-123" },
      });

      // Verify that Prisma create was called with the correct data
      expect(mockPrismaClient.kudo.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          id: "card-123",
          message: "Great job!",
          recipientName: "John Doe",
          giver: {
            connect: { id: "giver-123" },
          },
          team: {
            connect: { id: "team-123" },
          },
          category: {
            connect: { id: "category-123" },
          },
        }),
        include: expect.objectContaining({
          team: expect.any(Object),
          category: expect.any(Object),
          giver: expect.any(Object),
        }),
      });
    });

    it("should update an existing kudo card", async () => {
      // Create a sample kudo card entity
      const kudoCard = new KudoCard(
        "card-123",
        "Updated message",
        "John Doe",
        "giver-123",
        "team-123",
        "category-123",
        new Date("2023-01-01T00:00:00Z"),
        new Date("2023-01-01T00:00:00Z"),
      );

      // Mock the Prisma findUnique method to return existing entity
      mockPrismaClient.kudo.findUnique.mockResolvedValue({
        id: "card-123",
        message: "Old message",
        recipientName: "John Doe",
        giverId: "giver-123",
        teamId: "team-123",
        categoryId: "category-123",
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date("2023-01-01T00:00:00Z"),
      });

      // Mock the Prisma update method
      mockPrismaClient.kudo.update.mockResolvedValue({
        id: "card-123",
        message: "Updated message",
        recipientName: "John Doe",
        giverId: "giver-123",
        teamId: "team-123",
        categoryId: "category-123",
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date("2023-01-01T00:00:00Z"),
        team: { id: "team-123", name: "Engineering" },
        category: { id: "category-123", name: "Teamwork" },
        giver: { id: "giver-123", email: "giver@example.com" },
      });

      // Call the repository method
      const result = await repository.saveEntity(kudoCard);

      // Verify the result
      expect(result).toBeInstanceOf(KudoCard);
      expect(result.getMessage()).toBe("Updated message");

      // Verify update was called
      expect(mockPrismaClient.kudo.update).toHaveBeenCalledWith({
        where: { id: "card-123" },
        data: expect.objectContaining({
          message: "Updated message",
          recipientName: "John Doe",
        }),
        include: expect.any(Object),
      });
    });

    it("should propagate errors from database", async () => {
      // Create a sample kudo card entity
      const kudoCard = new KudoCard(
        "card-123",
        "Great job!",
        "John Doe",
        "giver-123",
        "team-123",
        "category-123",
        new Date(),
        new Date(),
      );

      // Mock the Prisma findUnique method to throw an error
      const databaseError = new Error("Database error");
      mockPrismaClient.kudo.findUnique.mockRejectedValue(databaseError);

      // Call the repository method and expect it to throw
      await expect(repository.saveEntity(kudoCard)).rejects.toThrow("Database error");
    });

    it("should create a new kudo card with empty ID", async () => {
      // Create a sample kudo card entity with empty ID
      const kudoCard = new KudoCard(
        "", // empty ID
        "New card message",
        "Jane Smith",
        "giver-123",
        "team-123",
        "category-123",
        new Date(),
        new Date()
      );
      
      // Mock the Prisma findUnique method to return null (new entity)
      mockPrismaClient.kudo.findUnique.mockResolvedValue(null);
      
      // Mock the Prisma create method
      mockPrismaClient.kudo.create.mockResolvedValue({
        id: "generated-uuid",
        message: "New card message",
        recipientName: "Jane Smith",
        giverId: "giver-123",
        teamId: "team-123",
        categoryId: "category-123",
        createdAt: new Date(),
        updatedAt: new Date(),
        team: { id: "team-123", name: "Engineering" },
        category: { id: "category-123", name: "Teamwork" },
        giver: { id: "giver-123", email: "giver@example.com" },
      });
      
      // Call the repository method
      const result = await repository.saveEntity(kudoCard);
      
      // Verify the result
      expect(result).toBeInstanceOf(KudoCard);
      expect(result.getId()).toBe("generated-uuid");
      
      // Verify that create was called with correct data and WITHOUT id in the data object
      expect(mockPrismaClient.kudo.create).toHaveBeenCalled();
      const createCall = mockPrismaClient.kudo.create.mock.calls[0][0];
      expect(createCall.data).not.toHaveProperty("id");
    });
  });

  describe("findAll", () => {
    // Sample database response with related data
    const mockDbResponse = [
      {
        id: "card-123",
        message: "Great teamwork!",
        recipientName: "John Doe",
        giverId: "giver-123",
        teamId: "team-123",
        categoryId: "category-123",
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date("2023-01-01T00:00:00Z"),
        team: { id: "team-123", name: "Engineering" },
        category: { id: "category-123", name: "Teamwork" },
        giver: { id: "giver-123", email: "giver@example.com" },
      },
      {
        id: "card-456",
        message: "Excellent presentation!",
        recipientName: "Jane Smith",
        giverId: "giver-456",
        teamId: "team-456",
        categoryId: "category-456",
        createdAt: new Date("2023-01-02T00:00:00Z"),
        updatedAt: new Date("2023-01-02T00:00:00Z"),
        team: { id: "team-456", name: "Product" },
        category: { id: "category-456", name: "Leadership" },
        giver: { id: "giver-456", email: "another@example.com" },
      },
    ];

    it("should find all kudo cards with default options", async () => {
      // Mock the Prisma findMany method
      mockPrismaClient.kudo.findMany.mockResolvedValue(mockDbResponse);

      // Call the repository method without options
      const result = await repository.findAll();

      // Verify the result
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(KudoCard);
      expect(result[0].getId()).toBe("card-123");
      expect(result[0].getTeamName()).toBe("Engineering");
      expect(result[0].getCategoryName()).toBe("Teamwork");
      expect(result[0].getGiverEmail()).toBe("giver@example.com");

      // Verify Prisma was called with the expected structure
      expect(mockPrismaClient.kudo.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.any(Object),
          orderBy: {
            createdAt: "desc",
          },
          include: expect.objectContaining({
            team: expect.any(Object),
            category: expect.any(Object),
            giver: expect.any(Object),
          }),
        }),
      );
    });

    it("should apply filters correctly", async () => {
      // Create filter options
      const options: FindAllKudoCardsOptions = {
        recipientName: "John",
        teamId: "team-123",
        categoryId: "category-123",
        searchTerm: "teamwork",
        sortBy: "oldest",
      };

      // Mock the Prisma findMany method
      mockPrismaClient.kudo.findMany.mockResolvedValue([mockDbResponse[0]]);

      // Call the repository method with options
      const result = await repository.findAll(options);

      // Verify the result
      expect(result).toHaveLength(1);
      expect(result[0].getId()).toBe("card-123");

      // Verify Prisma was called with correct parameters including all filters
      expect(mockPrismaClient.kudo.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          recipientName: {
            contains: "John",
            mode: "insensitive",
          },
          teamId: "team-123",
          categoryId: "category-123",
          OR: expect.any(Array),
        }),
        include: expect.any(Object),
        orderBy: {
          createdAt: "asc", // oldest first
        },
      });
    });

    it("should handle empty result set", async () => {
      // Mock the Prisma findMany method to return empty array
      mockPrismaClient.kudo.findMany.mockResolvedValue([]);

      // Call the repository method
      const result = await repository.findAll();

      // Verify empty array result
      expect(result).toEqual([]);
    });

    it("should search with searchTerm across multiple fields", async () => {
      // Create filter options with just search term
      const options: FindAllKudoCardsOptions = {
        searchTerm: "engineering", // This will match team name
      };
      
      // Mock the Prisma findMany method
      mockPrismaClient.kudo.findMany.mockResolvedValue([mockDbResponse[0]]);
      
      // Call the repository method with options
      const result = await repository.findAll(options);
      
      // Verify the result
      expect(result).toHaveLength(1);
      
      // Verify Prisma was called with the search in the OR clause
      expect(mockPrismaClient.kudo.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({
                message: expect.any(Object),
              }),
              expect.objectContaining({
                recipientName: expect.any(Object),
              }),
              expect.objectContaining({
                team: expect.objectContaining({
                  name: expect.objectContaining({
                    contains: "engineering",
                    mode: "insensitive",
                  }),
                }),
              }),
              expect.objectContaining({
                category: expect.objectContaining({
                  name: expect.any(Object),
                }),
              }),
            ]),
          }),
        })
      );
    });
  });

  describe("findById", () => {
    it("should find a kudo card by id", async () => {
      // Mock database response
      const mockDbResponse = {
        id: "card-123",
        message: "Great job!",
        recipientName: "John Doe",
        giverId: "giver-123",
        teamId: "team-123",
        categoryId: "category-123",
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date("2023-01-01T00:00:00Z"),
        team: { id: "team-123", name: "Engineering" },
        category: { id: "category-123", name: "Teamwork" },
        giver: { id: "giver-123", email: "giver@example.com" },
      };

      // Mock the Prisma findUnique method
      mockPrismaClient.kudo.findUnique.mockResolvedValue(mockDbResponse);

      // Call the repository method
      const result = await repository.findById("card-123");

      // Verify result
      expect(result).not.toBeNull();
      expect(result?.getId()).toBe("card-123");
      expect(result?.getMessage()).toBe("Great job!");
      expect(result?.getTeamName()).toBe("Engineering");

      // Verify Prisma was called with correct parameters
      expect(mockPrismaClient.kudo.findUnique).toHaveBeenCalledWith({
        where: { id: "card-123" },
        include: expect.any(Object),
      });
    });

    it("should return null when kudo card is not found", async () => {
      // Mock the Prisma findUnique method to return null
      mockPrismaClient.kudo.findUnique.mockResolvedValue(null);

      // Call the repository method
      const result = await repository.findById("non-existent-id");

      // Verify result is null
      expect(result).toBeNull();
    });
  });
});
