import { AnalyticsController } from "../../../../../../src/modules/analytics/presentation/controllers/analytics.controller";
import { GetAnalyticsDataUseCase } from "../../../../../../src/modules/analytics/application/useCases/getAnalyticsData/GetAnalyticsDataUseCase";
import { AnalyticsPeriod } from "../../../../../../src/modules/analytics/domain/types/AnalyticsPeriod";
import { AnalyticsData } from "../../../../../../src/modules/analytics/domain/types/AnalyticsData";
import { Request, Response, NextFunction } from "express";

describe("AnalyticsController", () => {
  let analyticsController: AnalyticsController;
  let mockGetAnalyticsDataUseCase: jest.Mocked<GetAnalyticsDataUseCase>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;
  let mockAnalyticsData: AnalyticsData;

  beforeEach(() => {
    // Create mock data
    mockAnalyticsData = {
      topIndividuals: [
        { id: "user-1", name: "User 1", kudosCount: 50 },
        { id: "user-2", name: "User 2", kudosCount: 40 },
      ],
      topTeams: [
        { id: "team-1", name: "Team 1", kudosCount: 100 },
        { id: "team-2", name: "Team 2", kudosCount: 90 },
      ],
      trendingWords: [
        { word: "awesome", frequency: 25 },
        { word: "helpful", frequency: 20 },
      ],
      trendingCategories: [
        { categoryName: "Teamwork", kudosCount: 60 },
        { categoryName: "Innovation", kudosCount: 55 },
      ],
    };

    // Setup mocks
    mockGetAnalyticsDataUseCase = {
      execute: jest.fn().mockResolvedValue(mockAnalyticsData),
    } as unknown as jest.Mocked<GetAnalyticsDataUseCase>;

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();

    // Create controller with mocked use case
    analyticsController = new AnalyticsController(mockGetAnalyticsDataUseCase);
  });

  describe("getAnalyticsData", () => {
    it("should return analytics data with default period when no period is provided", async () => {
      // Arrange
      mockRequest = {
        query: {},
      };

      // Act
      await analyticsController.getAnalyticsData(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockGetAnalyticsDataUseCase.execute).toHaveBeenCalledWith({
        period: AnalyticsPeriod.ALL,
        limit: {
          individuals: undefined,
          teams: undefined,
          words: undefined,
          categories: undefined,
        },
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockAnalyticsData);
    });

    it("should pass query parameters to use case", async () => {
      // Arrange
      mockRequest = {
        query: {
          period: AnalyticsPeriod.WEEKLY,
          individualLimit: "5",
          teamLimit: "3",
          wordLimit: "10",
          categoryLimit: "4",
        },
      };

      // Act
      await analyticsController.getAnalyticsData(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockGetAnalyticsDataUseCase.execute).toHaveBeenCalledWith({
        period: AnalyticsPeriod.WEEKLY,
        limit: {
          individuals: 5,
          teams: 3,
          words: 10,
          categories: 4,
        },
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockAnalyticsData);
    });

    it("should handle errors and pass them to next middleware", async () => {
      // Arrange
      const testError = new Error("Test error");
      mockGetAnalyticsDataUseCase.execute.mockRejectedValue(testError);
      
      mockRequest = {
        query: {
          period: AnalyticsPeriod.MONTHLY,
        },
      };

      // Act
      await analyticsController.getAnalyticsData(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(testError);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it("should handle invalid number parameters", async () => {
      // Arrange
      mockRequest = {
        query: {
          period: AnalyticsPeriod.YEARLY,
          individualLimit: "invalid", // Not a number
          teamLimit: "5",
        },
      };

      // Act
      await analyticsController.getAnalyticsData(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockGetAnalyticsDataUseCase.execute).toHaveBeenCalledWith({
        period: AnalyticsPeriod.YEARLY,
        limit: {
          individuals: NaN, // This would be handled by validation before controller
          teams: 5,
          words: undefined,
          categories: undefined,
        },
      });
    });
  });
}); 