import { mock } from "jest-mock-extended";
import { IAnalyticsRepository } from "../../../../../../../src/modules/analytics/domain/types/IAnalyticsRepository";
import { GetAnalyticsDataUseCase } from "../../../../../../../src/modules/analytics/application/useCases/getAnalyticsData/GetAnalyticsDataUseCase";
import { AnalyticsPeriod } from "../../../../../../../src/modules/analytics/domain/types/AnalyticsPeriod";
import { GetAnalyticsDataRequestDto } from "../../../../../../../src/modules/analytics/application/useCases/getAnalyticsData/GetAnalyticsDataRequestDto";
import { AnalyticsData } from "../../../../../../../src/modules/analytics/domain/types/AnalyticsData";

describe("GetAnalyticsDataUseCase", () => {
  let getAnalyticsDataUseCase: GetAnalyticsDataUseCase;
  let mockAnalyticsRepository: jest.Mocked<IAnalyticsRepository>;
  let mockAnalyticsData: AnalyticsData;

  beforeEach(() => {
    // Create mock repository
    mockAnalyticsRepository = mock<IAnalyticsRepository>();
    
    // Create mock analytics data
    mockAnalyticsData = {
      topIndividuals: Array(20).fill(0).map((_, i) => ({
        id: `user-${i}`,
        name: `User ${i}`,
        kudosCount: 100 - i
      })),
      topTeams: Array(15).fill(0).map((_, i) => ({
        id: `team-${i}`,
        name: `Team ${i}`,
        kudosCount: 50 - i
      })),
      trendingWords: Array(30).fill(0).map((_, i) => ({
        word: `word${i}`,
        frequency: 200 - i
      })),
      trendingCategories: Array(12).fill(0).map((_, i) => ({
        categoryName: `Category ${i}`,
        kudosCount: 80 - i
      }))
    };
    
    // Mock repository getAnalyticsData method
    mockAnalyticsRepository.getAnalyticsData.mockResolvedValue(mockAnalyticsData);
    
    // Create use case with mocked repository
    getAnalyticsDataUseCase = new GetAnalyticsDataUseCase(mockAnalyticsRepository);
  });

  it("should call repository with correct period", async () => {
    // Arrange
    const requestDto: GetAnalyticsDataRequestDto = {
      period: AnalyticsPeriod.WEEKLY
    };
    
    // Act
    await getAnalyticsDataUseCase.execute(requestDto);
    
    // Assert
    expect(mockAnalyticsRepository.getAnalyticsData).toHaveBeenCalledWith(AnalyticsPeriod.WEEKLY);
  });

  it("should apply default limits when not provided", async () => {
    // Arrange
    const requestDto: GetAnalyticsDataRequestDto = {
      period: AnalyticsPeriod.MONTHLY
    };
    
    // Act
    const result = await getAnalyticsDataUseCase.execute(requestDto);
    
    // Assert
    expect(result.topIndividuals.length).toBe(10); // Default limit
    expect(result.topTeams.length).toBe(10); // Default limit
    expect(result.trendingWords.length).toBe(20); // Default limit
    expect(result.trendingCategories.length).toBe(10); // Default limit
  });

  it("should apply custom limits when provided", async () => {
    // Arrange
    const requestDto: GetAnalyticsDataRequestDto = {
      period: AnalyticsPeriod.YEARLY,
      limit: {
        individuals: 5,
        teams: 3,
        words: 8,
        categories: 2
      }
    };
    
    // Act
    const result = await getAnalyticsDataUseCase.execute(requestDto);
    
    // Assert
    expect(result.topIndividuals.length).toBe(5);
    expect(result.topTeams.length).toBe(3);
    expect(result.trendingWords.length).toBe(8);
    expect(result.trendingCategories.length).toBe(2);
  });

  it("should preserve ordering of items from repository", async () => {
    // Arrange
    const requestDto: GetAnalyticsDataRequestDto = {
      period: AnalyticsPeriod.ALL,
      limit: {
        individuals: 3
      }
    };
    
    // Act
    const result = await getAnalyticsDataUseCase.execute(requestDto);
    
    // Assert
    expect(result.topIndividuals).toEqual([
      { id: "user-0", name: "User 0", kudosCount: 100 },
      { id: "user-1", name: "User 1", kudosCount: 99 },
      { id: "user-2", name: "User 2", kudosCount: 98 }
    ]);
  });
}); 