import { GetAnalyticsDataUseCase } from './application/useCases/getAnalyticsData/GetAnalyticsDataUseCase';
import { AnalyticsController } from './presentation/controllers/analytics.controller';
import { MockAnalyticsRepository } from './infrastructure/repositories/MockAnalyticsRepository';
import { createAnalyticsRouter } from './presentation/routes/analytics.routes';
import { Router } from 'express';

/**
 * Factory function to create and wire up all components of the Analytics module
 */
export const createAnalyticsModule = (): { router: Router } => {
  // For development, we use the mock repository
  // In production, this would be replaced with the real repository implementation
  const analyticsRepository = new MockAnalyticsRepository();
  
  // Create use case with repository dependency
  const getAnalyticsDataUseCase = new GetAnalyticsDataUseCase(analyticsRepository);
  
  // Create controller with use case dependency
  const analyticsController = new AnalyticsController(getAnalyticsDataUseCase);
  
  // Create router with controller dependency
  const router = createAnalyticsRouter(analyticsController);
  
  return { router };
}; 