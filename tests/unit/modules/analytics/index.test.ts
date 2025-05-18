import { createAnalyticsModule } from "../../../../src/modules/analytics";
import { GetAnalyticsDataUseCase } from "../../../../src/modules/analytics/application/useCases/getAnalyticsData/GetAnalyticsDataUseCase";
import { MockAnalyticsRepository } from "../../../../src/modules/analytics/infrastructure/repositories/MockAnalyticsRepository";
import { AnalyticsController } from "../../../../src/modules/analytics/presentation/controllers/analytics.controller";
import { Router } from "express";

// Mock the dependencies
jest.mock("../../../../src/modules/analytics/infrastructure/repositories/MockAnalyticsRepository");
jest.mock("../../../../src/modules/analytics/application/useCases/getAnalyticsData/GetAnalyticsDataUseCase");
jest.mock("../../../../src/modules/analytics/presentation/controllers/analytics.controller");
jest.mock("../../../../src/modules/analytics/presentation/routes/analytics.routes", () => ({
  createAnalyticsRouter: jest.fn().mockReturnValue({}),
}));

describe("Analytics Module", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create and wire up all components", () => {
    // Arrange
    const mockGetAnalyticsDataUseCase = GetAnalyticsDataUseCase as jest.Mock;
    const mockAnalyticsController = AnalyticsController as jest.Mock;
    const mockMockAnalyticsRepository = MockAnalyticsRepository as jest.Mock;
    const { createAnalyticsRouter } = require("../../../../src/modules/analytics/presentation/routes/analytics.routes");

    // Act
    const result = createAnalyticsModule();

    // Assert
    // Should create a repository instance
    expect(mockMockAnalyticsRepository).toHaveBeenCalledTimes(1);
    const repositoryInstance = mockMockAnalyticsRepository.mock.instances[0];
    
    // Should create a use case with repository dependency
    expect(mockGetAnalyticsDataUseCase).toHaveBeenCalledTimes(1);
    expect(mockGetAnalyticsDataUseCase).toHaveBeenCalledWith(repositoryInstance);
    const useCaseInstance = mockGetAnalyticsDataUseCase.mock.instances[0];
    
    // Should create a controller with use case dependency
    expect(mockAnalyticsController).toHaveBeenCalledTimes(1);
    expect(mockAnalyticsController).toHaveBeenCalledWith(useCaseInstance);
    const controllerInstance = mockAnalyticsController.mock.instances[0];
    
    // Should create a router with controller dependency
    expect(createAnalyticsRouter).toHaveBeenCalledTimes(1);
    expect(createAnalyticsRouter).toHaveBeenCalledWith(controllerInstance);
    
    // Should return the router
    expect(result).toHaveProperty("router");
  });
}); 