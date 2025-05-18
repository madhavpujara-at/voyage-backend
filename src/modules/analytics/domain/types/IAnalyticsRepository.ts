import { AnalyticsData, IndividualKudos, TeamKudos, WordFrequency, CategoryKudos } from "./AnalyticsData";
import { AnalyticsPeriod } from "./AnalyticsPeriod";

/**
 * Repository interface for analytics operations
 */
export interface IAnalyticsRepository {
  /**
   * Get all analytics data for a specific time period
   * @param period - The time period to get analytics for
   * @returns Complete analytics data
   */
  getAnalyticsData(period: AnalyticsPeriod): Promise<AnalyticsData>;

  /**
   * Get top individuals by kudos count
   * @param period - The time period to get data for
   * @param limit - Maximum number of individuals to return
   * @returns List of individuals with kudos counts
   */
  getTopIndividuals(period: AnalyticsPeriod, limit?: number): Promise<IndividualKudos[]>;

  /**
   * Get top teams by kudos count
   * @param period - The time period to get data for
   * @param limit - Maximum number of teams to return
   * @returns List of teams with kudos counts
   */
  getTopTeams(period: AnalyticsPeriod, limit?: number): Promise<TeamKudos[]>;

  /**
   * Get trending words from kudos messages
   * @param period - The time period to get data for
   * @param limit - Maximum number of words to return
   * @returns List of words with their frequencies
   */
  getTrendingWords(period: AnalyticsPeriod, limit?: number): Promise<WordFrequency[]>;

  /**
   * Get trending categories by kudos count
   * @param period - The time period to get data for
   * @param limit - Maximum number of categories to return
   * @returns List of categories with kudos counts
   */
  getTrendingCategories(period: AnalyticsPeriod, limit?: number): Promise<CategoryKudos[]>;
}
