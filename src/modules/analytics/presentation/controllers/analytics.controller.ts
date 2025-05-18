import { Request, Response, NextFunction } from "express";
import { GetAnalyticsDataUseCase } from "../../application/useCases/getAnalyticsData/GetAnalyticsDataUseCase";
import { AnalyticsPeriod } from "../../domain/types/AnalyticsPeriod";

/**
 * Controller for analytics endpoints
 */
export class AnalyticsController {
  constructor(private readonly getAnalyticsDataUseCase: GetAnalyticsDataUseCase) {}

  /**
   * Get analytics data
   * @param req - Express request
   * @param res - Express response
   * @param next - Express next function
   */
  async getAnalyticsData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Extract query parameters
      const period = (req.query.period as AnalyticsPeriod) || AnalyticsPeriod.ALL;

      // Parse numeric limits (if provided)
      const individualLimit = req.query.individualLimit ? parseInt(req.query.individualLimit as string, 10) : undefined;

      const teamLimit = req.query.teamLimit ? parseInt(req.query.teamLimit as string, 10) : undefined;

      const wordLimit = req.query.wordLimit ? parseInt(req.query.wordLimit as string, 10) : undefined;

      const categoryLimit = req.query.categoryLimit ? parseInt(req.query.categoryLimit as string, 10) : undefined;

      // Execute use case
      const result = await this.getAnalyticsDataUseCase.execute({
        period,
        limit: {
          individuals: individualLimit,
          teams: teamLimit,
          words: wordLimit,
          categories: categoryLimit,
        },
      });

      // Send response
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
