import { CreateTeamUseCase } from "../../../../../../../src/modules/teams/application/useCases/createTeam/CreateTeamUseCase";
import { CreateTeamRequestDto } from "../../../../../../../src/modules/teams/application/useCases/createTeam/CreateTeamRequestDto";
import { ITeamRepository } from "../../../../../../../src/modules/teams/domain/interfaces/repositories/ITeamRepository";
import { Team } from "../../../../../../../src/modules/teams/domain/entities/Team";

// Mock the randomUUID function
jest.mock("crypto", () => ({
  randomUUID: jest.fn().mockReturnValue("mock-uuid"),
}));

describe("CreateTeamUseCase", () => {
  let createTeamUseCase: CreateTeamUseCase;
  let mockTeamRepository: jest.Mocked<ITeamRepository>;

  // Create a test factory function for a Team
  const createTestTeam = (overrides = {}) => {
    const defaults = {
      id: "team-id-123",
      name: "Engineering Team",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const data = { ...defaults, ...overrides };

    return new Team(data.id, data.name, data.createdAt, data.updatedAt);
  };

  beforeEach(() => {
    // Setup the mock repository
    mockTeamRepository = {
      findById: jest.fn(),
      findByName: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    // Create the use case with the mocked repository
    createTeamUseCase = new CreateTeamUseCase(mockTeamRepository);

    // Reset the mock call counts before each test
    jest.clearAllMocks();
  });

  it("should create a team successfully", async () => {
    // Arrange
    const request: CreateTeamRequestDto = {
      name: "Engineering Team",
    };
    mockTeamRepository.findByName.mockResolvedValue(null); // No existing team with this name

    // Act
    const result = await createTeamUseCase.execute(request);

    // Assert
    expect(mockTeamRepository.findByName).toHaveBeenCalledWith(request.name);
    expect(mockTeamRepository.save).toHaveBeenCalled();

    // Verify that returned team has expected properties
    expect(result.team).toHaveProperty("id", "mock-uuid");
    expect(result.team).toHaveProperty("name", request.name);
    expect(result.team).toHaveProperty("createdAt");
    expect(result.team).toHaveProperty("updatedAt");
  });

  it("should throw an error if team with the same name already exists", async () => {
    // Arrange
    const request: CreateTeamRequestDto = {
      name: "Engineering Team",
    };
    const existingTeam = createTestTeam();
    mockTeamRepository.findByName.mockResolvedValue(existingTeam); // Existing team found

    // Act & Assert
    await expect(createTeamUseCase.execute(request)).rejects.toThrow(
      "Team with name 'Engineering Team' already exists",
    );
    expect(mockTeamRepository.findByName).toHaveBeenCalledWith(request.name);
    expect(mockTeamRepository.save).not.toHaveBeenCalled();
  });

  it("should propagate error if repository findByName throws", async () => {
    // Arrange
    const request: CreateTeamRequestDto = {
      name: "Engineering Team",
    };
    const repositoryError = new Error("Database connection error");
    mockTeamRepository.findByName.mockRejectedValue(repositoryError);

    // Act & Assert
    await expect(createTeamUseCase.execute(request)).rejects.toThrow(repositoryError);
    expect(mockTeamRepository.findByName).toHaveBeenCalledWith(request.name);
    expect(mockTeamRepository.save).not.toHaveBeenCalled();
  });

  it("should propagate error if repository save throws", async () => {
    // Arrange
    const request: CreateTeamRequestDto = {
      name: "Engineering Team",
    };
    mockTeamRepository.findByName.mockResolvedValue(null); // No existing team
    const saveError = new Error("Failed to save team");
    mockTeamRepository.save.mockRejectedValue(saveError);

    // Act & Assert
    await expect(createTeamUseCase.execute(request)).rejects.toThrow(saveError);
    expect(mockTeamRepository.findByName).toHaveBeenCalledWith(request.name);
    expect(mockTeamRepository.save).toHaveBeenCalled();
  });
});
