import { Request, Response, NextFunction } from "express";
import { TeamsController } from "../../../../../../src/modules/teams/presentation/controllers/teams.controller";
import { CreateTeamUseCase } from "../../../../../../src/modules/teams/application/useCases/createTeam/CreateTeamUseCase";
import { ListTeamsUseCase } from "../../../../../../src/modules/teams/application/useCases/listTeams/ListTeamsUseCase";
import { UpdateTeamUseCase } from "../../../../../../src/modules/teams/application/useCases/updateTeam/UpdateTeamUseCase";
import { DeleteTeamUseCase } from "../../../../../../src/modules/teams/application/useCases/deleteTeam/DeleteTeamUseCase";

describe("TeamsController", () => {
  let teamsController: TeamsController;
  let mockCreateTeamUseCase: jest.Mocked<CreateTeamUseCase>;
  let mockListTeamsUseCase: jest.Mocked<ListTeamsUseCase>;
  let mockUpdateTeamUseCase: jest.Mocked<UpdateTeamUseCase>;
  let mockDeleteTeamUseCase: jest.Mocked<DeleteTeamUseCase>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  // Helper to create a mock response object with common methods
  const createMockResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    // Setup use case mocks
    mockCreateTeamUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CreateTeamUseCase>;

    mockListTeamsUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<ListTeamsUseCase>;

    mockUpdateTeamUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<UpdateTeamUseCase>;

    mockDeleteTeamUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<DeleteTeamUseCase>;

    // Create the controller with mocked use cases
    teamsController = new TeamsController(
      mockCreateTeamUseCase,
      mockListTeamsUseCase,
      mockUpdateTeamUseCase,
      mockDeleteTeamUseCase,
    );

    // Setup request, response, and next function mocks
    mockRequest = {};
    mockResponse = createMockResponse();
    mockNext = jest.fn();
  });

  describe("createTeam", () => {
    it("should call createTeamUseCase and return result", async () => {
      // Arrange
      const teamData = { name: "Engineering Team" };
      const useCaseResult = {
        team: {
          id: "team-123",
          name: "Engineering Team",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
      mockRequest.body = teamData;
      mockCreateTeamUseCase.execute.mockResolvedValue(useCaseResult);

      // Act
      await teamsController.createTeam(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockCreateTeamUseCase.execute).toHaveBeenCalledWith(teamData);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(useCaseResult);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with error when createTeamUseCase throws", async () => {
      // Arrange
      const teamData = { name: "Engineering Team" };
      const error = new Error("Team already exists");
      mockRequest.body = teamData;
      mockCreateTeamUseCase.execute.mockRejectedValue(error);

      // Act
      await teamsController.createTeam(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockCreateTeamUseCase.execute).toHaveBeenCalledWith(teamData);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("listTeams", () => {
    it("should call listTeamsUseCase and return results", async () => {
      // Arrange
      const useCaseResult = {
        teams: [
          {
            id: "team-123",
            name: "Engineering Team",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "team-456",
            name: "Product Team",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      };
      mockListTeamsUseCase.execute.mockResolvedValue(useCaseResult);

      // Act
      await teamsController.listTeams(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockListTeamsUseCase.execute).toHaveBeenCalledWith({});
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(useCaseResult);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with error when listTeamsUseCase throws", async () => {
      // Arrange
      const error = new Error("Database error");
      mockListTeamsUseCase.execute.mockRejectedValue(error);

      // Act
      await teamsController.listTeams(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockListTeamsUseCase.execute).toHaveBeenCalledWith({});
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("updateTeam", () => {
    it("should call updateTeamUseCase and return result", async () => {
      // Arrange
      const updateData = { teamId: "team-123", name: "Updated Team Name" };
      const useCaseResult = {
        team: {
          id: "team-123",
          name: "Updated Team Name",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
      mockRequest.body = updateData;
      mockUpdateTeamUseCase.execute.mockResolvedValue(useCaseResult);

      // Act
      await teamsController.updateTeam(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockUpdateTeamUseCase.execute).toHaveBeenCalledWith(updateData);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(useCaseResult);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with error when updateTeamUseCase throws", async () => {
      // Arrange
      const updateData = { teamId: "team-123", name: "Updated Team Name" };
      const error = new Error("Team not found");
      mockRequest.body = updateData;
      mockUpdateTeamUseCase.execute.mockRejectedValue(error);

      // Act
      await teamsController.updateTeam(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockUpdateTeamUseCase.execute).toHaveBeenCalledWith(updateData);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("deleteTeam", () => {
    it("should call deleteTeamUseCase and return result", async () => {
      // Arrange
      const deleteData = { teamId: "team-123" };
      const useCaseResult = { success: true };
      mockRequest.body = deleteData;
      mockDeleteTeamUseCase.execute.mockResolvedValue(useCaseResult);

      // Act
      await teamsController.deleteTeam(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockDeleteTeamUseCase.execute).toHaveBeenCalledWith(deleteData);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(useCaseResult);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with error when deleteTeamUseCase throws", async () => {
      // Arrange
      const deleteData = { teamId: "team-123" };
      const error = new Error("Team not found");
      mockRequest.body = deleteData;
      mockDeleteTeamUseCase.execute.mockRejectedValue(error);

      // Act
      await teamsController.deleteTeam(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockDeleteTeamUseCase.execute).toHaveBeenCalledWith(deleteData);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
