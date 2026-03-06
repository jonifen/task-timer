import { useTimer } from "../../hooks/use-timer";
import { formatDuration } from "../../utils/format-duration";
import { useAppStore, type TimerConfig } from "../../store";

import * as styles from "./timer-config-card.css";

interface Props {
  config: TimerConfig;
  onEdit: () => void;
  onDelete: () => void;
}

export function TimerConfigCard({ config, onEdit, onDelete }: Props) {
  const { status, displayedElapsed, start, pause, resume, complete } = useTimer(config.id, config.name);
  const completedMs = useAppStore((s) =>
    s.timerEntries
      .filter((e) => e.configId === config.id && e.status === "completed")
      .reduce((sum, e) => sum + e.elapsedMs, 0)
  );

  const isIdle = status === null;
  const isActive = status === "active";
  const isPaused = status === "paused";
  const dailyTotal = completedMs + displayedElapsed;

  return (
    <div className={styles.card}>
      <span
        className={styles.colorDot}
        style={config.color ? { backgroundColor: config.color } : undefined}
        aria-hidden
      />
      <div className={styles.nameGroup}>
        <span className={styles.name}>{config.name}</span>
        {dailyTotal > 0 && (
          <span className={styles.dailyTotal}>Today: {formatDuration(dailyTotal)}</span>
        )}
      </div>

      <div className={styles.timerSection}>
        {!isIdle && (
          <span className={styles.elapsed} aria-label="Elapsed time" aria-live="polite">
            {formatDuration(displayedElapsed)}
          </span>
        )}

        {isIdle && (
          <button
            className={`${styles.timerButton} ${styles.timerButtonStart}`}
            onClick={start}
            aria-label={`Start ${config.name}`}
          >
            ▶ Start
          </button>
        )}

        {isActive && (
          <button
            className={`${styles.timerButton} ${styles.timerButtonSecondary}`}
            onClick={pause}
            aria-label={`Pause ${config.name}`}
          >
            ⏸ Pause
          </button>
        )}

        {isPaused && (
          <button
            className={`${styles.timerButton} ${styles.timerButtonStart}`}
            onClick={resume}
            aria-label={`Resume ${config.name}`}
          >
            ▶ Resume
          </button>
        )}

        {!isIdle && (
          <button
            className={`${styles.timerButton} ${styles.timerButtonComplete}`}
            onClick={complete}
            aria-label={`Complete ${config.name}`}
          >
            ✓ Done
          </button>
        )}
      </div>

      <div className={styles.divider} aria-hidden />

      <div className={styles.manageActions}>
        <button className={styles.iconButton} onClick={onEdit} aria-label={`Edit ${config.name}`} title="Edit">
          ✎
        </button>
        <button
          className={`${styles.iconButton} ${styles.iconButtonDanger}`}
          onClick={onDelete}
          aria-label={`Delete ${config.name}`}
          title="Delete"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
