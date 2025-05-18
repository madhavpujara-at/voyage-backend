/**
 * Individual recipient of kudos with their kudos count
 */
export interface IndividualKudos {
  id: string;
  name: string;
  kudosCount: number;
}

/**
 * Team with their kudos count
 */
export interface TeamKudos {
  id: string;
  name: string;
  kudosCount: number;
}

/**
 * Word with its frequency in kudos messages
 */
export interface WordFrequency {
  word: string;
  frequency: number;
}

/**
 * Category with its kudos count
 */
export interface CategoryKudos {
  categoryName: string;
  kudosCount: number;
}

/**
 * Complete analytics data structure combining all analytics sections
 */
export interface AnalyticsData {
  topIndividuals: IndividualKudos[];
  topTeams: TeamKudos[];
  trendingWords: WordFrequency[];
  trendingCategories: CategoryKudos[];
}
