import type { DailyHistory } from "../store";

export interface TimerStat {
  key: string;
  name: string;
  totalMs: number;
  color: string;
}

export interface DailyBar {
  date: string;
  label: string;
  [key: string]: string | number;
}

export interface AnalyticsData {
  timerStats: TimerStat[];
  dailyBars: DailyBar[];
  totalMs: number;
  daysWithActivity: number;
}

const CHART_COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
  "#f97316",
  "#6366f1",
];

function formatDateLabel(date: string, short: boolean): string {
  const [yyyy, mm, dd] = date.split("-").map(Number);
  const d = new Date(yyyy, mm - 1, dd);
  if (short) return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

/** Returns an array of YYYY-MM-DD strings from startDate to endDate inclusive. */
export function buildDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const [sy, sm, sd] = startDate.split("-").map(Number);
  const [ey, em, ed] = endDate.split("-").map(Number);
  const cur = new Date(sy, sm - 1, sd);
  const end = new Date(ey, em - 1, ed);
  while (cur <= end) {
    const yyyy = cur.getFullYear();
    const mm = String(cur.getMonth() + 1).padStart(2, "0");
    const dd = String(cur.getDate()).padStart(2, "0");
    dates.push(`${yyyy}-${mm}-${dd}`);
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

export function processAnalyticsData(histories: DailyHistory[], allDates: string[]): AnalyticsData {
  const historyByDate = new Map(histories.map((h) => [h.date, h]));

  // Group entries by timer key
  const timerMap = new Map<string, { name: string; totalMs: number }>();
  for (const history of histories) {
    for (const entry of history.entries) {
      if (entry.elapsedMs <= 0) continue;
      const key = entry.configId ?? `~${entry.name}`;
      const existing = timerMap.get(key);
      if (existing) {
        existing.totalMs += entry.elapsedMs;
      } else {
        timerMap.set(key, { name: entry.name, totalMs: entry.elapsedMs });
      }
    }
  }

  const short = allDates.length > 14;

  const timerStats: TimerStat[] = [...timerMap.entries()]
    .sort(([, a], [, b]) => b.totalMs - a.totalMs)
    .map(([key, { name, totalMs }], i) => ({
      key,
      name,
      totalMs,
      color: CHART_COLORS[i % CHART_COLORS.length],
    }));

  const dailyBars: DailyBar[] = allDates.map((date) => {
    const bar: DailyBar = { date, label: formatDateLabel(date, short) };
    for (const stat of timerStats) bar[stat.key] = 0;
    const history = historyByDate.get(date);
    if (history) {
      for (const entry of history.entries) {
        if (entry.elapsedMs <= 0) continue;
        const key = entry.configId ?? `~${entry.name}`;
        bar[key] = ((bar[key] as number) || 0) + entry.elapsedMs;
      }
    }
    return bar;
  });

  const totalMs = timerStats.reduce((sum, t) => sum + t.totalMs, 0);
  const daysWithActivity = allDates.filter((date) => {
    const h = historyByDate.get(date);
    return h && h.entries.some((e) => e.elapsedMs > 0);
  }).length;

  return { timerStats, dailyBars, totalMs, daysWithActivity };
}
