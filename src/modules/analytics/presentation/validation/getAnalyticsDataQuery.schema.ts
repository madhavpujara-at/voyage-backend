import { z } from "zod";
import { AnalyticsPeriod } from "../../domain/types/AnalyticsPeriod";

// Convert enum to array of values for Zod
const periodValues = Object.values(AnalyticsPeriod);

// Helper function to transform string to number safely
const safeParseInt = (val: string | undefined): number | undefined => {
  if (val === undefined || val === "") return undefined;
  const num = parseInt(val, 10);
  return isNaN(num) ? undefined : num;
};

/**
 * Zod schema for validating analytics query parameters
 */
export const getAnalyticsDataQuerySchema = z.object({
  period: z.enum(periodValues as [string, ...string[]]).default(AnalyticsPeriod.ALL),
  individualLimit: z.string().optional().transform(safeParseInt).pipe(z.number().min(1).max(50).optional()),
  teamLimit: z.string().optional().transform(safeParseInt).pipe(z.number().min(1).max(50).optional()),
  wordLimit: z.string().optional().transform(safeParseInt).pipe(z.number().min(1).max(50).optional()),
  categoryLimit: z.string().optional().transform(safeParseInt).pipe(z.number().min(1).max(50).optional()),
});
