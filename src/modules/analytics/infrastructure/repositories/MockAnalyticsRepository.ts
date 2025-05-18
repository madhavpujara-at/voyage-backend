import { IAnalyticsRepository } from "../../domain/types/IAnalyticsRepository";
import {
  AnalyticsData,
  IndividualKudos,
  TeamKudos,
  WordFrequency,
  CategoryKudos,
} from "../../domain/types/AnalyticsData";
import { AnalyticsPeriod } from "../../domain/types/AnalyticsPeriod";
import { mockWeeklyData, mockMonthlyData, mockYearlyData, mockYearlyDataLarge } from "../mock/MockAnalyticsData";

/**
 * Mock implementation of IAnalyticsRepository for development and testing
 */
export class MockAnalyticsRepository implements IAnalyticsRepository {
  /**
   * Get all analytics data for a specific time period
   * @param period - The time period to get analytics for
   * @returns Complete analytics data
   */
  async getAnalyticsData(period: AnalyticsPeriod): Promise<AnalyticsData> {
    switch (period) {
      case AnalyticsPeriod.WEEKLY:
        return mockWeeklyData;
      case AnalyticsPeriod.MONTHLY:
        return mockMonthlyData;
      case AnalyticsPeriod.YEARLY:
        return mockYearlyData;
      case AnalyticsPeriod.ALL:
      default:
        // For 'all' we can use the largest dataset
        return mockYearlyDataLarge;
    }
  }

  /**
   * Get top individuals by kudos count
   * @param period - The time period to get data for
   * @param limit - Maximum number of individuals to return
   * @returns List of individuals with kudos counts
   */
  async getTopIndividuals(period: AnalyticsPeriod, limit: number = 10): Promise<IndividualKudos[]> {
    const data = await this.getAnalyticsData(period);
    return data.topIndividuals.slice(0, limit);
  }

  /**
   * Get top teams by kudos count
   * @param period - The time period to get data for
   * @param limit - Maximum number of teams to return
   * @returns List of teams with kudos counts
   */
  async getTopTeams(period: AnalyticsPeriod, limit: number = 10): Promise<TeamKudos[]> {
    const data = await this.getAnalyticsData(period);
    return data.topTeams.slice(0, limit);
  }

  /**
   * Get trending words from kudos messages
   * @param period - The time period to get data for
   * @param limit - Maximum number of words to return
   * @returns List of words with their frequencies
   */
  async getTrendingWords(period: AnalyticsPeriod, limit: number = 20): Promise<WordFrequency[]> {
    const data = await this.getAnalyticsData(period);
    return data.trendingWords.slice(0, limit);
  }

  /**
   * Get trending categories by kudos count
   * @param period - The time period to get data for
   * @param limit - Maximum number of categories to return
   * @returns List of categories with kudos counts
   */
  async getTrendingCategories(period: AnalyticsPeriod, limit: number = 10): Promise<CategoryKudos[]> {
    const data = await this.getAnalyticsData(period);
    return data.trendingCategories.slice(0, limit);
  }
}
