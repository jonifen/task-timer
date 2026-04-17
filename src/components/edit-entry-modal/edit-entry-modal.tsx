import { useEffect, useRef, useState } from "react";

import type { TimerEntry } from "../../store";

import * as styles from "./edit-entry-modal.css";

interface Props {
  entry: TimerEntry;
  onSave: (updated: TimerEntry) => void;
  onClose: () => void;
}

function toDatetimeLocal(ts: number): string {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function msToHMS(ms: number): [number, number, number] {
  const total = Math.floor(ms / 1000);
  return [Math.floor(total / 3600), Math.floor((total % 3600) / 60), total % 60];
}

function hmsToMs(h: number, m: number, s: number): number {
  return (h * 3600 + m * 60 + s) * 1000;
}

export function EditEntryModal({ entry, onSave, onClose }: Props) {
  const firstInputRef = useRef<HTMLInputElement>(null);

  const [initialH, initialM, initialS] = msToHMS(entry.elapsedMs);

  const [name, setName] = useState(entry.name);
  const [startDatetime, setStartDatetime] = useState(() => toDatetimeLocal(entry.startedAt));
  const [endDatetime, setEndDatetime] = useState(() => (entry.completedAt ? toDatetimeLocal(entry.completedAt) : ""));
  const [workedH, setWorkedH] = useState(initialH);
  const [workedM, setWorkedM] = useState(initialM);
  const [workedS, setWorkedS] = useState(initialS);
  const [error, setError] = useState("");

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  function handleOverlayMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const startedAt = new Date(startDatetime).getTime();
    if (isNaN(startedAt)) {
      setError("Invalid start time.");
      return;
    }

    let completedAt: number | undefined;

    if (endDatetime) {
      const endTs = new Date(endDatetime).getTime();
      if (isNaN(endTs)) {
        setError("Invalid end time.");
        return;
      }
      if (endTs <= startedAt) {
        setError("End time must be after start time.");
        return;
      }
      completedAt = endTs;
    }

    const elapsedMs = hmsToMs(workedH, workedM, workedS);
    if (elapsedMs < 0) {
      setError("Worked time cannot be negative.");
      return;
    }

    const wallClock = endDatetime ? new Date(endDatetime).getTime() - startedAt : null;
    if (wallClock !== null && elapsedMs > wallClock) {
      setError("Worked time cannot exceed the time between start and end.");
      return;
    }

    onSave({
      ...entry,
      name: name.trim() || entry.name,
      startedAt,
      completedAt,
      elapsedMs,
    });
  }

  const showEnd = entry.status === "completed";

  return (
    <div className={styles.overlay} onMouseDown={handleOverlayMouseDown}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="edit-entry-title">
        <div className={styles.header}>
          <h2 className={styles.title} id="edit-entry-title">
            Edit entry
          </h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <form className={styles.body} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="edit-name">
              Name
            </label>
            <input
              id="edit-name"
              ref={firstInputRef}
              className={styles.input}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="edit-start">
              Started at
            </label>
            <input
              id="edit-start"
              className={styles.input}
              type="datetime-local"
              step="1"
              value={startDatetime}
              onChange={(e) => setStartDatetime(e.target.value)}
            />
          </div>

          {showEnd && (
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="edit-end">
                Ended at
              </label>
              <input
                id="edit-end"
                className={styles.input}
                type="datetime-local"
                step="1"
                value={endDatetime}
                onChange={(e) => setEndDatetime(e.target.value)}
              />
            </div>
          )}

          <div className={styles.fieldGroup}>
            <div className={styles.workedTimeHeader}>
              <label className={styles.label}>Worked time</label>
              {showEnd && (
                <button
                  type="button"
                  className={styles.recalcButton}
                  onClick={() => {
                    const startTs = new Date(startDatetime).getTime();
                    const endTs = new Date(endDatetime).getTime();
                    if (isNaN(startTs) || isNaN(endTs) || endTs <= startTs) return;
                    const [h, m, s] = msToHMS(endTs - startTs);
                    setWorkedH(h);
                    setWorkedM(m);
                    setWorkedS(s);
                  }}
                  title="Set worked time to full duration between start and end"
                >
                  ↺ Recalculate from times
                </button>
              )}
            </div>
            <div className={styles.durationRow}>
              <div className={styles.durationUnit}>
                <input
                  className={styles.durationInput}
                  type="number"
                  min={0}
                  value={workedH}
                  onChange={(e) => setWorkedH(Math.max(0, parseInt(e.target.value) || 0))}
                  aria-label="Hours"
                />
                <span className={styles.durationLabel}>h</span>
              </div>
              <div className={styles.durationUnit}>
                <input
                  className={styles.durationInput}
                  type="number"
                  min={0}
                  max={59}
                  value={workedM}
                  onChange={(e) => setWorkedM(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                  aria-label="Minutes"
                />
                <span className={styles.durationLabel}>m</span>
              </div>
              <div className={styles.durationUnit}>
                <input
                  className={styles.durationInput}
                  type="number"
                  min={0}
                  max={59}
                  value={workedS}
                  onChange={(e) => setWorkedS(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                  aria-label="Seconds"
                />
                <span className={styles.durationLabel}>s</span>
              </div>
            </div>
          </div>

          {error && <p className={styles.errorText}>{error}</p>}

          <div className={styles.footer}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.saveButton}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
