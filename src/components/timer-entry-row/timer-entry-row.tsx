import { useEffect, useState } from "react";

import { formatDuration, formatTime } from "../../utils/format-duration";
import { useAppStore } from "../../store";
import type { TimerEntry } from "../../store";

import * as styles from "./timer-entry-row.css";

interface Props {
  entry: TimerEntry;
}

function computeElapsed(entry: TimerEntry): number {
  if (entry.status === "active") return entry.elapsedMs + (Date.now() - entry.startedAt);
  return entry.elapsedMs;
}

const STATUS_ICON: Record<TimerEntry["status"], string> = {
  active: "▶",
  paused: "⏸",
  completed: "✓",
};

const STATUS_ICON_CLASS: Record<TimerEntry["status"], string> = {
  active: styles.statusIconActive,
  paused: styles.statusIconPaused,
  completed: styles.statusIconCompleted,
};

export function TimerEntryRow({ entry }: Props) {
  const config = useAppStore((s) => s.timerConfigs.find((c) => c.id === entry.configId));
  const [elapsed, setElapsed] = useState(() => computeElapsed(entry));

  useEffect(() => {
    setElapsed(computeElapsed(entry));
    if (entry.status !== "active") return;
    const interval = setInterval(() => setElapsed(computeElapsed(entry)), 1000);
    return () => clearInterval(interval);
  }, [entry]);

  const isActive = entry.status === "active";

  return (
    <div className={`${styles.row} ${isActive ? styles.rowActive : ""}`}>
      <span
        className={`${styles.colorDot} ${isActive ? styles.colorDotActive : ""}`}
        style={config?.color ? { backgroundColor: config.color } : undefined}
        aria-hidden
      />
      <div className={styles.middle}>
        <span className={styles.name}>{entry.name}</span>
        <span className={styles.timeRange}>
          {formatTime(entry.startedAt)}
          {" – "}
          {entry.completedAt ? formatTime(entry.completedAt) : "…"}
        </span>
      </div>
      <div className={styles.right}>
        <span
          className={`${styles.statusIcon} ${STATUS_ICON_CLASS[entry.status]}`}
          aria-label={entry.status}
        >
          {STATUS_ICON[entry.status]}
        </span>
        <span className={styles.elapsed} aria-label="Elapsed time" aria-live={isActive ? "polite" : undefined}>
          {formatDuration(elapsed)}
        </span>
      </div>
    </div>
  );
}
