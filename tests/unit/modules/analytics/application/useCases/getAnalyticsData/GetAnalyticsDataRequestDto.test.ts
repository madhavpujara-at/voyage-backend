import { GetAnalyticsDataRequestDto } from "../../../../../../../src/modules/analytics/application/useCases/getAnalyticsData/GetAnalyticsDataRequestDto";
import { AnalyticsPeriod } from "../../../../../../../src/modules/analytics/domain/types/AnalyticsPeriod";

describe("GetAnalyticsDataRequestDto", () => {
  it("should create a DTO with only period", () => {
    // Arrange & Act
    const dto: GetAnalyticsDataRequestDto = {
      period: AnalyticsPeriod.WEEKLY,
    };

    // Assert
    expect(dto.period).toBe(AnalyticsPeriod.WEEKLY);
    expect(dto.limit).toBeUndefined();
  });

  it("should create a DTO with period and empty limit object", () => {
    // Arrange & Act
    const dto: GetAnalyticsDataRequestDto = {
      period: AnalyticsPeriod.MONTHLY,
      limit: {},
    };

    // Assert
    expect(dto.period).toBe(AnalyticsPeriod.MONTHLY);
    expect(dto.limit).toBeDefined();
    expect(dto.limit?.individuals).toBeUndefined();
    expect(dto.limit?.teams).toBeUndefined();
    expect(dto.limit?.words).toBeUndefined();
    expect(dto.limit?.categories).toBeUndefined();
  });

  it("should create a DTO with partial limit parameters", () => {
    // Arrange & Act
    const dto: GetAnalyticsDataRequestDto = {
      period: AnalyticsPeriod.YEARLY,
      limit: {
        individuals: 5,
        words: 15,
      },
    };

    // Assert
    expect(dto.period).toBe(AnalyticsPeriod.YEARLY);
    expect(dto.limit).toBeDefined();
    expect(dto.limit?.individuals).toBe(5);
    expect(dto.limit?.teams).toBeUndefined();
    expect(dto.limit?.words).toBe(15);
    expect(dto.limit?.categories).toBeUndefined();
  });

  it("should create a DTO with all limit parameters", () => {
    // Arrange & Act
    const dto: GetAnalyticsDataRequestDto = {
      period: AnalyticsPeriod.ALL,
      limit: {
        individuals: 10,
        teams: 8,
        words: 20,
        categories: 5,
      },
    };

    // Assert
    expect(dto.period).toBe(AnalyticsPeriod.ALL);
    expect(dto.limit).toBeDefined();
    expect(dto.limit?.individuals).toBe(10);
    expect(dto.limit?.teams).toBe(8);
    expect(dto.limit?.words).toBe(20);
    expect(dto.limit?.categories).toBe(5);
  });
});
