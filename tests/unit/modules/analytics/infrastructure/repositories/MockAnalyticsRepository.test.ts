import { MockAnalyticsRepository } from "../../../../../../src/modules/analytics/infrastructure/repositories/MockAnalyticsRepository";
import { AnalyticsPeriod } from "../../../../../../src/modules/analytics/domain/types/AnalyticsPeriod";

// Import mock data to compare with repository responses
import { 
  mockWeeklyData, 
  mockMonthlyData, 
  mockYearlyData, 
  mockYearlyDataLarge 
} from "../../../../../../src/modules/analytics/infrastructure/mock/MockAnalyticsData";

describe("MockAnalyticsRepository", () => {
  let mockAnalyticsRepository: MockAnalyticsRepository;

  beforeEach(() => {
    mockAnalyticsRepository = new MockAnalyticsRepository();
  });

  describe("getAnalyticsData", () => {
    it("should return weekly data for WEEKLY period", async () => {
      const result = await mockAnalyticsRepository.getAnalyticsData(AnalyticsPeriod.WEEKLY);
      expect(result).toEqual(mockWeeklyData);
    });

    it("should return monthly data for MONTHLY period", async () => {
      const result = await mockAnalyticsRepository.getAnalyticsData(AnalyticsPeriod.MONTHLY);
      expect(result).toEqual(mockMonthlyData);
    });

    it("should return yearly data for YEARLY period", async () => {
      const result = await mockAnalyticsRepository.getAnalyticsData(AnalyticsPeriod.YEARLY);
      expect(result).toEqual(mockYearlyData);
    });

    it("should return yearly large data for ALL period", async () => {
      const result = await mockAnalyticsRepository.getAnalyticsData(AnalyticsPeriod.ALL);
      expect(result).toEqual(mockYearlyDataLarge);
    });
  });

  describe("getTopIndividuals", () => {
    it("should return top individuals with default limit", async () => {
      const result = await mockAnalyticsRepository.getTopIndividuals(AnalyticsPeriod.WEEKLY);
      expect(result).toEqual(mockWeeklyData.topIndividuals.slice(0, 10));
      expect(result.length).toBeLessThanOrEqual(10);
    });

    it("should respect custom limit", async () => {
      const customLimit = 5;
      const result = await mockAnalyticsRepository.getTopIndividuals(AnalyticsPeriod.MONTHLY, customLimit);
      expect(result).toEqual(mockMonthlyData.topIndividuals.slice(0, customLimit));
      expect(result.length).toBeLessThanOrEqual(customLimit);
    });
  });

  describe("getTopTeams", () => {
    it("should return top teams with default limit", async () => {
      const result = await mockAnalyticsRepository.getTopTeams(AnalyticsPeriod.WEEKLY);
      expect(result).toEqual(mockWeeklyData.topTeams.slice(0, 10));
      expect(result.length).toBeLessThanOrEqual(10);
    });

    it("should respect custom limit", async () => {
      const customLimit = 3;
      const result = await mockAnalyticsRepository.getTopTeams(AnalyticsPeriod.YEARLY, customLimit);
      expect(result).toEqual(mockYearlyData.topTeams.slice(0, customLimit));
      expect(result.length).toBeLessThanOrEqual(customLimit);
    });
  });

  describe("getTrendingWords", () => {
    it("should return trending words with default limit", async () => {
      const result = await mockAnalyticsRepository.getTrendingWords(AnalyticsPeriod.WEEKLY);
      expect(result).toEqual(mockWeeklyData.trendingWords.slice(0, 20));
      expect(result.length).toBeLessThanOrEqual(20);
    });

    it("should respect custom limit", async () => {
      const customLimit = 7;
      const result = await mockAnalyticsRepository.getTrendingWords(AnalyticsPeriod.YEARLY, customLimit);
      expect(result).toEqual(mockYearlyData.trendingWords.slice(0, customLimit));
      expect(result.length).toBeLessThanOrEqual(customLimit);
    });
  });

  describe("getTrendingCategories", () => {
    it("should return trending categories with default limit", async () => {
      const result = await mockAnalyticsRepository.getTrendingCategories(AnalyticsPeriod.WEEKLY);
      expect(result).toEqual(mockWeeklyData.trendingCategories.slice(0, 10));
      expect(result.length).toBeLessThanOrEqual(10);
    });

    it("should respect custom limit", async () => {
      const customLimit = 4;
      const result = await mockAnalyticsRepository.getTrendingCategories(AnalyticsPeriod.MONTHLY, customLimit);
      expect(result).toEqual(mockMonthlyData.trendingCategories.slice(0, customLimit));
      expect(result.length).toBeLessThanOrEqual(customLimit);
    });
  });
}); 