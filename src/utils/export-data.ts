import { db } from "../db";

export async function exportData(): Promise<void> {
  const [timerConfigs, dailyHistory] = await Promise.all([db.timerConfigs.getAll(), db.dailyHistory.getAll()]);

  const payload = {
    exportedAt: new Date().toISOString(),
    timerConfigs,
    dailyHistory,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const filename = `task-timer-export-${yyyy}-${mm}-${dd}.json`;

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
