import { 
  AnalyticsData,
  IndividualKudos,
  TeamKudos,
  WordFrequency,
  CategoryKudos 
} from "../../../../../../src/modules/analytics/domain/types/AnalyticsData";

describe("AnalyticsData", () => {
  it("should correctly type IndividualKudos objects", () => {
    const individual: IndividualKudos = {
      id: "user-123",
      name: "John Doe",
      kudosCount: 42
    };
    
    expect(individual.id).toBe("user-123");
    expect(individual.name).toBe("John Doe");
    expect(individual.kudosCount).toBe(42);
  });

  it("should correctly type TeamKudos objects", () => {
    const team: TeamKudos = {
      id: "team-abc",
      name: "Development Team",
      kudosCount: 150
    };
    
    expect(team.id).toBe("team-abc");
    expect(team.name).toBe("Development Team");
    expect(team.kudosCount).toBe(150);
  });

  it("should correctly type WordFrequency objects", () => {
    const word: WordFrequency = {
      word: "excellent",
      frequency: 25
    };
    
    expect(word.word).toBe("excellent");
    expect(word.frequency).toBe(25);
  });

  it("should correctly type CategoryKudos objects", () => {
    const category: CategoryKudos = {
      categoryName: "Leadership",
      kudosCount: 75
    };
    
    expect(category.categoryName).toBe("Leadership");
    expect(category.kudosCount).toBe(75);
  });

  it("should correctly type a complete AnalyticsData object", () => {
    const analyticsData: AnalyticsData = {
      topIndividuals: [
        { id: "user-1", name: "User 1", kudosCount: 100 },
        { id: "user-2", name: "User 2", kudosCount: 80 }
      ],
      topTeams: [
        { id: "team-1", name: "Team 1", kudosCount: 200 },
        { id: "team-2", name: "Team 2", kudosCount: 180 }
      ],
      trendingWords: [
        { word: "brilliant", frequency: 30 },
        { word: "helpful", frequency: 25 }
      ],
      trendingCategories: [
        { categoryName: "Innovation", kudosCount: 120 },
        { categoryName: "Teamwork", kudosCount: 100 }
      ]
    };
    
    expect(analyticsData.topIndividuals.length).toBe(2);
    expect(analyticsData.topTeams.length).toBe(2);
    expect(analyticsData.trendingWords.length).toBe(2);
    expect(analyticsData.trendingCategories.length).toBe(2);
  });
}); 