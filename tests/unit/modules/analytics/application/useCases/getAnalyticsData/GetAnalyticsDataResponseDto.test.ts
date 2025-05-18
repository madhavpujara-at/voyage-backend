import { GetAnalyticsDataResponseDto } from "../../../../../../../src/modules/analytics/application/useCases/getAnalyticsData/GetAnalyticsDataResponseDto";
import { AnalyticsData } from "../../../../../../../src/modules/analytics/domain/types/AnalyticsData";

describe("GetAnalyticsDataResponseDto", () => {
  it("should have the same structure as AnalyticsData", () => {
    // Arrange
    const analyticsData: AnalyticsData = {
      topIndividuals: [
        { id: "user-1", name: "John Doe", kudosCount: 45 },
        { id: "user-2", name: "Jane Smith", kudosCount: 38 }
      ],
      topTeams: [
        { id: "team-1", name: "Engineering", kudosCount: 120 },
        { id: "team-2", name: "Product", kudosCount: 95 }
      ],
      trendingWords: [
        { word: "helpful", frequency: 28 },
        { word: "teamwork", frequency: 22 }
      ],
      trendingCategories: [
        { categoryName: "Collaboration", kudosCount: 75 },
        { categoryName: "Innovation", kudosCount: 65 }
      ]
    };
    
    // Act
    const responseDto: GetAnalyticsDataResponseDto = analyticsData;
    
    // Assert - The types should be compatible without any transformation
    expect(responseDto).toEqual(analyticsData);
    expect(responseDto.topIndividuals).toEqual(analyticsData.topIndividuals);
    expect(responseDto.topTeams).toEqual(analyticsData.topTeams);
    expect(responseDto.trendingWords).toEqual(analyticsData.trendingWords);
    expect(responseDto.trendingCategories).toEqual(analyticsData.trendingCategories);
  });

  it("should allow empty arrays for each section", () => {
    // Arrange
    const analyticsData: AnalyticsData = {
      topIndividuals: [],
      topTeams: [],
      trendingWords: [],
      trendingCategories: []
    };
    
    // Act
    const responseDto: GetAnalyticsDataResponseDto = analyticsData;
    
    // Assert
    expect(responseDto.topIndividuals).toEqual([]);
    expect(responseDto.topTeams).toEqual([]);
    expect(responseDto.trendingWords).toEqual([]);
    expect(responseDto.trendingCategories).toEqual([]);
  });
}); 