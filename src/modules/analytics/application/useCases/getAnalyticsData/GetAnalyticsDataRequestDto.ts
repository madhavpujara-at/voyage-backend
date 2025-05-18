import { AnalyticsPeriod } from "../../../domain/types/AnalyticsPeriod";

/**
 * Request DTO for the GetAnalyticsData use case
 */
export interface GetAnalyticsDataRequestDto {
  /**
   * Time period for analytics data
   */
  period: AnalyticsPeriod;

  /**
   * Optional limits for each data section
   */
  limit?: {
    individuals?: number;
    teams?: number;
    words?: number;
    categories?: number;
  };
}
