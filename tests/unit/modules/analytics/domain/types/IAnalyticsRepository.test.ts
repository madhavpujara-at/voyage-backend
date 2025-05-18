import { mock } from "jest-mock-extended";
import { IAnalyticsRepository } from "../../../../../../src/modules/analytics/domain/types/IAnalyticsRepository";
import { AnalyticsPeriod } from "../../../../../../src/modules/analytics/domain/types/AnalyticsPeriod";
import { 
  AnalyticsData, 
  IndividualKudos, 
  TeamKudos, 
  WordFrequency, 
  CategoryKudos 
} from "../../../../../../src/modules/analytics/domain/types/AnalyticsData";

describe("IAnalyticsRepository", () => {
  let mockRepository: jest.Mocked<IAnalyticsRepository>;
  let mockAnalyticsData: AnalyticsData;

  beforeEach(() => {
    // Initialize mock data
    mockAnalyticsData = {
      topIndividuals: [
        { id: "user-1", name: "User 1", kudosCount: 50 }
      ],
      topTeams: [
        { id: "team-1", name: "Team 1", kudosCount: 100 }
      ],
      trendingWords: [
        { word: "excellent", frequency: 30 }
      ],
      trendingCategories: [
        { categoryName: "Innovation", kudosCount: 80 }
      ]
    };

    // Create a mock repository instance
    mockRepository = mock<IAnalyticsRepository>();
    
    // Setup default behavior for mocked methods
    mockRepository.getAnalyticsData.mockResolvedValue(mockAnalyticsData);
    mockRepository.getTopIndividuals.mockResolvedValue(mockAnalyticsData.topIndividuals);
    mockRepository.getTopTeams.mockResolvedValue(mockAnalyticsData.topTeams);
    mockRepository.getTrendingWords.mockResolvedValue(mockAnalyticsData.trendingWords);
    mockRepository.getTrendingCategories.mockResolvedValue(mockAnalyticsData.trendingCategories);
  });

  it("should define getAnalyticsData method", async () => {
    // Act
    const result = await mockRepository.getAnalyticsData(AnalyticsPeriod.WEEKLY);
    
    // Assert
    expect(mockRepository.getAnalyticsData).toHaveBeenCalledWith(AnalyticsPeriod.WEEKLY);
    expect(result).toBe(mockAnalyticsData);
  });

  it("should define getTopIndividuals method with optional limit parameter", async () => {
    // Act - without limit
    await mockRepository.getTopIndividuals(AnalyticsPeriod.MONTHLY);
    
    // Assert
    expect(mockRepository.getTopIndividuals).toHaveBeenCalledWith(AnalyticsPeriod.MONTHLY);
    
    // Act - with limit
    await mockRepository.getTopIndividuals(AnalyticsPeriod.MONTHLY, 5);
    
    // Assert
    expect(mockRepository.getTopIndividuals).toHaveBeenCalledWith(AnalyticsPeriod.MONTHLY, 5);
  });

  it("should define getTopTeams method with optional limit parameter", async () => {
    // Act - without limit
    await mockRepository.getTopTeams(AnalyticsPeriod.YEARLY);
    
    // Assert
    expect(mockRepository.getTopTeams).toHaveBeenCalledWith(AnalyticsPeriod.YEARLY);
    
    // Act - with limit
    await mockRepository.getTopTeams(AnalyticsPeriod.YEARLY, 10);
    
    // Assert
    expect(mockRepository.getTopTeams).toHaveBeenCalledWith(AnalyticsPeriod.YEARLY, 10);
  });

  it("should define getTrendingWords method with optional limit parameter", async () => {
    // Act - without limit
    await mockRepository.getTrendingWords(AnalyticsPeriod.ALL);
    
    // Assert
    expect(mockRepository.getTrendingWords).toHaveBeenCalledWith(AnalyticsPeriod.ALL);
    
    // Act - with limit
    await mockRepository.getTrendingWords(AnalyticsPeriod.ALL, 20);
    
    // Assert
    expect(mockRepository.getTrendingWords).toHaveBeenCalledWith(AnalyticsPeriod.ALL, 20);
  });

  it("should define getTrendingCategories method with optional limit parameter", async () => {
    // Act - without limit
    await mockRepository.getTrendingCategories(AnalyticsPeriod.WEEKLY);
    
    // Assert
    expect(mockRepository.getTrendingCategories).toHaveBeenCalledWith(AnalyticsPeriod.WEEKLY);
    
    // Act - with limit
    await mockRepository.getTrendingCategories(AnalyticsPeriod.WEEKLY, 7);
    
    // Assert
    expect(mockRepository.getTrendingCategories).toHaveBeenCalledWith(AnalyticsPeriod.WEEKLY, 7);
  });
}); 