import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { WeekPicker } from "../components/week-picker/week-picker";
import { TimerEntryRow } from "../components/timer-entry-row/timer-entry-row";
import { EditEntryModal } from "../components/edit-entry-modal/edit-entry-modal";
import { useAppStore, type TimerEntry } from "../store";
import { db } from "../db";
import { formatDurationHuman } from "../utils/format-duration";

import * as styles from "./history.css";

function toLocalDateString(ts: number): string {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function HistoryPage() {
  const { yyyy, mm, dd } = useParams<{ yyyy: string; mm: string; dd: string }>();
  const currentDate = useAppStore((s) => s.currentDate);
  const navigateToDate = useAppStore((s) => s.navigateToDate);
  const timerEntries = useAppStore((s) => s.timerEntries);
  const updateTimerEntry = useAppStore((s) => s.updateTimerEntry);
  const removeTimerEntry = useAppStore((s) => s.removeTimerEntry);

  const [editingEntry, setEditingEntry] = useState<TimerEntry | null>(null);

  function computeTotal() {
    return timerEntries.reduce((sum, e) => {
      if (e.status === "active") return sum + e.elapsedMs + (Date.now() - e.startedAt);
      return sum + e.elapsedMs;
    }, 0);
  }

  const [totalMs, setTotalMs] = useState(computeTotal);

  useEffect(() => {
    setTotalMs(computeTotal());
    const hasActive = timerEntries.some((e) => e.status === "active");
    if (!hasActive) return;
    const interval = setInterval(() => setTotalMs(computeTotal()), 1000);
    return () => clearInterval(interval);
  }, [timerEntries]);

  useEffect(() => {
    const date =
      yyyy && mm && dd
        ? `${yyyy}-${mm}-${dd}`
        : new Date().toISOString().slice(0, 10);
    navigateToDate(date);
  }, [yyyy, mm, dd, navigateToDate]);

  async function handleEditSave(updated: TimerEntry) {
    const targetDate = toLocalDateString(updated.startedAt);
    if (targetDate === currentDate) {
      updateTimerEntry(updated.id, updated);
    } else {
      // Move to a different date — remove from current, append to target
      removeTimerEntry(updated.id);
      const existing = await db.dailyHistory.get(targetDate);
      const entries = existing?.entries ?? [];
      await db.dailyHistory.set({ date: targetDate, entries: [...entries, updated] });
    }
    setEditingEntry(null);
  }

  return (
    <>
      <main>
        <WeekPicker selectedDate={currentDate} />
        <div className={styles.page}>
          <div className={styles.headingRow}>
            <h1 className={styles.heading}>{currentDate}</h1>
            {timerEntries.length > 0 && (
              <span className={styles.dailyTotal}>{formatDurationHuman(totalMs)}</span>
            )}
          </div>
          {timerEntries.length === 0 ? (
            <p className={styles.emptyState}>No timers recorded for this day.</p>
          ) : (
            <div className={styles.list}>
              {timerEntries.map((entry) => (
                <TimerEntryRow key={entry.id} entry={entry} onEdit={() => setEditingEntry(entry)} />
              ))}
            </div>
          )}
        </div>
      </main>
      {editingEntry && (
        <EditEntryModal
          entry={editingEntry}
          onSave={handleEditSave}
          onClose={() => setEditingEntry(null)}
        />
      )}
    </>
  );
}
