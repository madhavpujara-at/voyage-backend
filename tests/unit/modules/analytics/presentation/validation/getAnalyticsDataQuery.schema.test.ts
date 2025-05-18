import { getAnalyticsDataQuerySchema } from "../../../../../../src/modules/analytics/presentation/validation/getAnalyticsDataQuery.schema";
import { AnalyticsPeriod } from "../../../../../../src/modules/analytics/domain/types/AnalyticsPeriod";

describe("getAnalyticsDataQuerySchema", () => {
  it("should validate a valid query with default values", () => {
    // Arrange
    const input = {};
    
    // Act
    const result = getAnalyticsDataQuerySchema.parse(input);
    
    // Assert
    expect(result.period).toBe(AnalyticsPeriod.ALL);
    expect(result.individualLimit).toBeUndefined();
    expect(result.teamLimit).toBeUndefined();
    expect(result.wordLimit).toBeUndefined();
    expect(result.categoryLimit).toBeUndefined();
  });

  it("should validate a valid query with all parameters", () => {
    // Arrange
    const input = {
      period: AnalyticsPeriod.WEEKLY,
      individualLimit: "10",
      teamLimit: "5",
      wordLimit: "20",
      categoryLimit: "8"
    };
    
    // Act
    const result = getAnalyticsDataQuerySchema.parse(input);
    
    // Assert
    expect(result.period).toBe(AnalyticsPeriod.WEEKLY);
    expect(result.individualLimit).toBe(10);
    expect(result.teamLimit).toBe(5);
    expect(result.wordLimit).toBe(20);
    expect(result.categoryLimit).toBe(8);
  });

  it("should validate with empty string limits as undefined", () => {
    // Arrange
    const input = {
      period: AnalyticsPeriod.MONTHLY,
      individualLimit: "",
      teamLimit: ""
    };
    
    // Act
    const result = getAnalyticsDataQuerySchema.parse(input);
    
    // Assert
    expect(result.period).toBe(AnalyticsPeriod.MONTHLY);
    expect(result.individualLimit).toBeUndefined();
    expect(result.teamLimit).toBeUndefined();
  });

  it("should handle non-numeric strings by treating them as undefined in the safeParseInt function", () => {
    // Arrange
    const input = {
      period: AnalyticsPeriod.WEEKLY,
      individualLimit: "abc", // Non-numeric string
      teamLimit: "10"
    };
    
    // Act
    const result = getAnalyticsDataQuerySchema.parse(input);
    
    // Assert
    // The safeParseInt function transforms "abc" to NaN, then to undefined
    // The pipe makes this optional, so the validation passes with undefined
    expect(result.period).toBe(AnalyticsPeriod.WEEKLY);
    expect(result.individualLimit).toBeUndefined();
    expect(result.teamLimit).toBe(10);
  });

  it("should throw error for invalid period", () => {
    // Arrange
    const input = {
      period: "invalid-period"
    };
    
    // Act & Assert
    expect(() => getAnalyticsDataQuerySchema.parse(input)).toThrow();
  });

  it("should throw error for negative limit values", () => {
    // Arrange
    const input = {
      period: AnalyticsPeriod.YEARLY,
      individualLimit: "-5"
    };
    
    // Act & Assert
    expect(() => getAnalyticsDataQuerySchema.parse(input)).toThrow();
  });

  it("should throw error for limit values exceeding maximum", () => {
    // Arrange
    const input = {
      period: AnalyticsPeriod.ALL,
      teamLimit: "100" // Max is 50
    };
    
    // Act & Assert
    expect(() => getAnalyticsDataQuerySchema.parse(input)).toThrow();
  });

  it("should transform string number values to actual numbers", () => {
    // Arrange
    const input = {
      period: AnalyticsPeriod.WEEKLY,
      individualLimit: "12",
      teamLimit: "7"
    };
    
    // Act
    const result = getAnalyticsDataQuerySchema.parse(input);
    
    // Assert
    expect(typeof result.individualLimit).toBe("number");
    expect(typeof result.teamLimit).toBe("number");
    expect(result.individualLimit).toBe(12);
    expect(result.teamLimit).toBe(7);
  });
}); 