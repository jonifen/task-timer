import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { WeekPicker } from "../components/week-picker/week-picker";
import { TimerEntryRow } from "../components/timer-entry-row/timer-entry-row";
import { useAppStore } from "../store";

import * as styles from "./history.css";

export function HistoryPage() {
  const { yyyy, mm, dd } = useParams<{ yyyy: string; mm: string; dd: string }>();
  const currentDate = useAppStore((s) => s.currentDate);
  const navigateToDate = useAppStore((s) => s.navigateToDate);
  const timerEntries = useAppStore((s) => s.timerEntries);

  useEffect(() => {
    if (!yyyy || !mm || !dd) return;
    navigateToDate(`${yyyy}-${mm}-${dd}`);
  }, [yyyy, mm, dd, navigateToDate]);

  return (
    <main>
      <WeekPicker selectedDate={currentDate} />
      <div className={styles.page}>
        <h1 className={styles.heading}>{currentDate}</h1>
        {timerEntries.length === 0 ? (
          <p className={styles.emptyState}>No timers recorded for this day.</p>
        ) : (
          <div className={styles.list}>
            {timerEntries.map((entry) => (
              <TimerEntryRow key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
