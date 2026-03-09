import { db } from "../db";
import type { TimerConfig, DailyHistory } from "../store";

interface ExportPayload {
  timerConfigs: TimerConfig[];
  dailyHistory: DailyHistory[];
  exportedAt: string;
}

function isValidPayload(data: unknown): data is ExportPayload {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;
  return Array.isArray(d.timerConfigs) && Array.isArray(d.dailyHistory);
}

export async function importData(file: File): Promise<void> {
  const text = await file.text();
  const parsed: unknown = JSON.parse(text);

  if (!isValidPayload(parsed)) {
    throw new Error("Invalid export file: missing timerConfigs or dailyHistory arrays.");
  }

  await Promise.all([db.timerConfigs.clearAll(), db.dailyHistory.clearAll()]);

  await Promise.all([
    ...parsed.timerConfigs.map((config) => db.timerConfigs.set(config)),
    ...parsed.dailyHistory.map((history) => db.dailyHistory.set(history)),
  ]);
}
