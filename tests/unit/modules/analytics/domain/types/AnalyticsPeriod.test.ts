import { AnalyticsPeriod } from "../../../../../../src/modules/analytics/domain/types/AnalyticsPeriod";

describe("AnalyticsPeriod", () => {
  it("should have the correct values", () => {
    expect(AnalyticsPeriod.WEEKLY).toBe("weekly");
    expect(AnalyticsPeriod.MONTHLY).toBe("monthly");
    expect(AnalyticsPeriod.YEARLY).toBe("yearly");
    expect(AnalyticsPeriod.ALL).toBe("all");
  });

  it("should have exactly four periods", () => {
    const periodValues = Object.values(AnalyticsPeriod);
    expect(periodValues.length).toBe(4);
    expect(periodValues).toContain("weekly");
    expect(periodValues).toContain("monthly");
    expect(periodValues).toContain("yearly");
    expect(periodValues).toContain("all");
  });
});
