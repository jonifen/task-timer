import { describe, it, expect } from "vitest";

import { buildDateRange, processAnalyticsData } from "./analytics";
import type { DailyHistory } from "../store";

// ---------------------------------------------------------------------------
// buildDateRange
// ---------------------------------------------------------------------------

describe("buildDateRange", () => {
  it("returns a single date when start equals end", () => {
    expect(buildDateRange("2026-03-01", "2026-03-01")).toEqual(["2026-03-01"]);
  });

  it("returns consecutive dates in order", () => {
    expect(buildDateRange("2026-03-01", "2026-03-03")).toEqual([
      "2026-03-01",
      "2026-03-02",
      "2026-03-03",
    ]);
  });

  it("crosses month boundaries correctly", () => {
    expect(buildDateRange("2026-01-30", "2026-02-02")).toEqual([
      "2026-01-30",
      "2026-01-31",
      "2026-02-01",
      "2026-02-02",
    ]);
  });

  it("crosses year boundaries correctly", () => {
    expect(buildDateRange("2025-12-30", "2026-01-02")).toEqual([
      "2025-12-30",
      "2025-12-31",
      "2026-01-01",
      "2026-01-02",
    ]);
  });

  it("handles leap years correctly", () => {
    expect(buildDateRange("2028-02-28", "2028-03-01")).toEqual([
      "2028-02-28",
      "2028-02-29",
      "2028-03-01",
    ]);
  });

  it("returns the correct number of dates for a 7-day range", () => {
    const range = buildDateRange("2026-03-01", "2026-03-07");
    expect(range).toHaveLength(7);
    expect(range[0]).toBe("2026-03-01");
    expect(range[6]).toBe("2026-03-07");
  });

  it("pads month and day with leading zeros", () => {
    const range = buildDateRange("2026-01-09", "2026-01-09");
    expect(range[0]).toBe("2026-01-09");
  });
});

// ---------------------------------------------------------------------------
// processAnalyticsData
// ---------------------------------------------------------------------------

const makeEntry = (
  id: string,
  name: string,
  elapsedMs: number,
  configId?: string
) => ({
  id,
  name,
  elapsedMs,
  startedAt: 0,
  status: "completed" as const,
  ...(configId ? { configId } : {}),
});

describe("processAnalyticsData", () => {
  it("returns empty data for no histories", () => {
    const result = processAnalyticsData([], ["2026-03-01"]);
    expect(result.timerStats).toEqual([]);
    expect(result.totalMs).toBe(0);
    expect(result.daysWithActivity).toBe(0);
    expect(result.dailyBars).toHaveLength(1);
  });

  it("returns one stat per unique configId", () => {
    const histories: DailyHistory[] = [
      {
        date: "2026-03-01",
        entries: [
          makeEntry("e1", "Work", 3_600_000, "config-1"),
          makeEntry("e2", "Work", 1_800_000, "config-1"),
        ],
      },
    ];
    const result = processAnalyticsData(histories, ["2026-03-01"]);
    expect(result.timerStats).toHaveLength(1);
    expect(result.timerStats[0].totalMs).toBe(5_400_000);
    expect(result.timerStats[0].name).toBe("Work");
  });

  it("groups quick timers (no configId) by name", () => {
    const histories: DailyHistory[] = [
      {
        date: "2026-03-01",
        entries: [
          makeEntry("e1", "Quick timer", 600_000),
          makeEntry("e2", "Quick timer", 300_000),
        ],
      },
    ];
    const result = processAnalyticsData(histories, ["2026-03-01"]);
    expect(result.timerStats).toHaveLength(1);
    expect(result.timerStats[0].totalMs).toBe(900_000);
  });

  it("treats named timers with the same configId but different names as one group", () => {
    const histories: DailyHistory[] = [
      {
        date: "2026-03-01",
        entries: [makeEntry("e1", "Old name", 1_000, "config-1")],
      },
      {
        date: "2026-03-02",
        entries: [makeEntry("e2", "New name", 2_000, "config-1")],
      },
    ];
    const result = processAnalyticsData(histories, ["2026-03-01", "2026-03-02"]);
    expect(result.timerStats).toHaveLength(1);
    expect(result.timerStats[0].totalMs).toBe(3_000);
  });

  it("treats different configIds as separate timers", () => {
    const histories: DailyHistory[] = [
      {
        date: "2026-03-01",
        entries: [
          makeEntry("e1", "Timer A", 1_000, "config-1"),
          makeEntry("e2", "Timer B", 2_000, "config-2"),
        ],
      },
    ];
    const result = processAnalyticsData(histories, ["2026-03-01"]);
    expect(result.timerStats).toHaveLength(2);
  });

  it("sorts timerStats by totalMs descending", () => {
    const histories: DailyHistory[] = [
      {
        date: "2026-03-01",
        entries: [
          makeEntry("e1", "Small", 1_000, "config-1"),
          makeEntry("e2", "Large", 5_000, "config-2"),
          makeEntry("e3", "Medium", 3_000, "config-3"),
        ],
      },
    ];
    const result = processAnalyticsData(histories, ["2026-03-01"]);
    expect(result.timerStats.map((s) => s.name)).toEqual(["Large", "Medium", "Small"]);
  });

  it("filters out entries with zero or negative elapsedMs", () => {
    const histories: DailyHistory[] = [
      {
        date: "2026-03-01",
        entries: [
          makeEntry("e1", "Work", 0, "config-1"),
          makeEntry("e2", "Work", -100, "config-1"),
          makeEntry("e3", "Work", 1_000, "config-1"),
        ],
      },
    ];
    const result = processAnalyticsData(histories, ["2026-03-01"]);
    expect(result.timerStats[0].totalMs).toBe(1_000);
  });

  it("produces a dailyBar for every date in allDates, even with no activity", () => {
    const allDates = ["2026-03-01", "2026-03-02", "2026-03-03"];
    const histories: DailyHistory[] = [
      { date: "2026-03-01", entries: [makeEntry("e1", "Work", 1_000, "config-1")] },
    ];
    const result = processAnalyticsData(histories, allDates);
    expect(result.dailyBars).toHaveLength(3);
    expect(result.dailyBars[1]["config-1"]).toBe(0);
    expect(result.dailyBars[2]["config-1"]).toBe(0);
  });

  it("sums multiple entries for the same timer on the same day in dailyBars", () => {
    const histories: DailyHistory[] = [
      {
        date: "2026-03-01",
        entries: [
          makeEntry("e1", "Work", 1_000, "config-1"),
          makeEntry("e2", "Work", 2_000, "config-1"),
        ],
      },
    ];
    const result = processAnalyticsData(histories, ["2026-03-01"]);
    expect(result.dailyBars[0]["config-1"]).toBe(3_000);
  });

  it("calculates totalMs as the sum of all timerStats", () => {
    const histories: DailyHistory[] = [
      {
        date: "2026-03-01",
        entries: [
          makeEntry("e1", "A", 1_000, "config-1"),
          makeEntry("e2", "B", 2_000, "config-2"),
        ],
      },
    ];
    const result = processAnalyticsData(histories, ["2026-03-01"]);
    expect(result.totalMs).toBe(3_000);
  });

  it("counts only dates with at least one entry with elapsedMs > 0 as active", () => {
    const allDates = ["2026-03-01", "2026-03-02", "2026-03-03"];
    const histories: DailyHistory[] = [
      { date: "2026-03-01", entries: [makeEntry("e1", "Work", 1_000, "config-1")] },
      { date: "2026-03-02", entries: [makeEntry("e2", "Work", 0, "config-1")] },
    ];
    const result = processAnalyticsData(histories, allDates);
    expect(result.daysWithActivity).toBe(1);
  });

  it("assigns a color to each timerStat", () => {
    const histories: DailyHistory[] = [
      {
        date: "2026-03-01",
        entries: [makeEntry("e1", "Work", 1_000, "config-1")],
      },
    ];
    const result = processAnalyticsData(histories, ["2026-03-01"]);
    expect(result.timerStats[0].color).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it("wraps colors when there are more than 10 timers", () => {
    const entries = Array.from({ length: 12 }, (_, i) =>
      makeEntry(`e${i}`, `Timer ${i}`, 1_000, `config-${i}`)
    );
    const histories: DailyHistory[] = [{ date: "2026-03-01", entries }];
    const result = processAnalyticsData(histories, ["2026-03-01"]);
    expect(result.timerStats[0].color).toBe(result.timerStats[10].color);
    expect(result.timerStats[1].color).toBe(result.timerStats[11].color);
  });

  it("each dailyBar includes a label string", () => {
    const result = processAnalyticsData([], ["2026-03-01"]);
    expect(typeof result.dailyBars[0].label).toBe("string");
    expect(result.dailyBars[0].label.length).toBeGreaterThan(0);
  });
});
