import { Router } from "express";
import { AnalyticsController } from "../controllers/analytics.controller";
import { validateRequest } from "../middleware/validateRequest";
import { getAnalyticsDataQuerySchema } from "../validation/getAnalyticsDataQuery.schema";
import { authenticateJwt } from "../../../../modules/auth/presentation/middleware/jwtStrategy";

/**
 * Router for analytics endpoints
 */
export const createAnalyticsRouter = (analyticsController: AnalyticsController): Router => {
  const router = Router();

  /**
   * @route GET /api/analytics
   * @desc Get analytics data (top individuals, top teams, trending words, trending categories)
   * @access Private - All authenticated users
   * @query period - Time period for analytics (weekly, monthly, yearly, all)
   * @query individualLimit - Maximum number of individuals to return
   * @query teamLimit - Maximum number of teams to return
   * @query wordLimit - Maximum number of words to return
   * @query categoryLimit - Maximum number of categories to return
   */
  router.get("/", authenticateJwt, validateRequest({ query: getAnalyticsDataQuerySchema }), (req, res, next) =>
    analyticsController.getAnalyticsData(req, res, next),
  );

  return router;
};

export default createAnalyticsRouter;
