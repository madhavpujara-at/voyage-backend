import { IAnalyticsRepository } from "../../../domain/types/IAnalyticsRepository";
import { GetAnalyticsDataRequestDto } from "./GetAnalyticsDataRequestDto";
import { GetAnalyticsDataResponseDto } from "./GetAnalyticsDataResponseDto";

/**
 * Use case for retrieving analytics data
 */
export class GetAnalyticsDataUseCase {
  constructor(private readonly analyticsRepository: IAnalyticsRepository) {}

  /**
   * Execute the use case
   * @param requestDto - The request data with period and optional limits
   * @returns Analytics data response
   */
  async execute(requestDto: GetAnalyticsDataRequestDto): Promise<GetAnalyticsDataResponseDto> {
    const { period, limit } = requestDto;

    // Set default limits if not provided
    const individualLimit = limit?.individuals ?? 10;
    const teamLimit = limit?.teams ?? 10;
    const wordLimit = limit?.words ?? 20;
    const categoryLimit = limit?.categories ?? 10;

    // Get all analytics data from repository
    const analyticsData = await this.analyticsRepository.getAnalyticsData(period);

    // Apply limits to each section
    return {
      topIndividuals: analyticsData.topIndividuals.slice(0, individualLimit),
      topTeams: analyticsData.topTeams.slice(0, teamLimit),
      trendingWords: analyticsData.trendingWords.slice(0, wordLimit),
      trendingCategories: analyticsData.trendingCategories.slice(0, categoryLimit),
    };
  }
}
