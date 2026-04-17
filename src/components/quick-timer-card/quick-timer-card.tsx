import { useEffect, useRef, useState } from "react";

import { formatDuration } from "../../utils/format-duration";
import { useAppStore } from "../../store";
import type { TimerEntry } from "../../store";

import * as styles from "./quick-timer-card.css";

interface Props {
  entryId: string;
  onDismiss: () => void;
}

function computeElapsed(entry: TimerEntry): number {
  if (entry.status === "active") return entry.elapsedMs + (Date.now() - entry.startedAt);
  return entry.elapsedMs;
}

export function QuickTimerCard({ entryId, onDismiss }: Props) {
  const entry = useAppStore((s) => s.timerEntries.find((e) => e.id === entryId) ?? null);
  const updateTimerEntry = useAppStore((s) => s.updateTimerEntry);

  const [name, setName] = useState(() => {
    const stored = entry?.name ?? "";
    return stored === "Quick timer" ? "" : stored;
  });
  const [elapsed, setElapsed] = useState(() => (entry ? computeElapsed(entry) : 0));
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-dismiss if completed externally (e.g. Stop all, or starting another timer)
  useEffect(() => {
    if (entry?.status === "completed") onDismiss();
  }, [entry?.status, onDismiss]);

  // Live elapsed tick
  useEffect(() => {
    if (!entry) return;
    setElapsed(computeElapsed(entry));
    if (entry.status !== "active") return;
    const interval = setInterval(() => setElapsed(computeElapsed(entry)), 1000);
    return () => clearInterval(interval);
  }, [entry]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  if (!entry || entry.status === "completed") return null;

  function flushName() {
    const trimmed = name.trim();
    if (trimmed) updateTimerEntry(entryId, { name: trimmed });
  }

  function handleComplete() {
    const now = Date.now();
    updateTimerEntry(entryId, {
      ...(name.trim() ? { name: name.trim() } : {}),
      elapsedMs: computeElapsed(entry!),
      completedAt: now,
      status: "completed",
    });
    onDismiss();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") flushName();
  }

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={flushName}
          onKeyDown={handleKeyDown}
          placeholder="What are you working on?"
        />
        <span className={styles.elapsed}>
          {formatDuration(elapsed)}
        </span>
      </div>
      <div className={styles.controls}>
        <button className={`${styles.button} ${styles.buttonComplete}`} onClick={handleComplete}>
          ✓ Done
        </button>
      </div>
    </div>
  );
}
