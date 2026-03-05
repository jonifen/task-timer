import { useEffect, useState } from "react";

import { useAppStore } from "../store";
import type { TimerEntry } from "../store";

function computeElapsed(entry: TimerEntry | null): number {
  if (!entry) return 0;
  if (entry.status === "active") return entry.elapsedMs + (Date.now() - entry.startedAt);
  return entry.elapsedMs;
}

export function useTimer(configId: string, name: string) {
  const entry = useAppStore(
    (s) =>
      s.timerEntries.find(
        (e) => e.configId === configId && (e.status === "active" || e.status === "paused")
      ) ?? null
  );
  const startTimerEntry = useAppStore((s) => s.startTimerEntry);
  const resumeTimerEntry = useAppStore((s) => s.resumeTimerEntry);
  const updateTimerEntry = useAppStore((s) => s.updateTimerEntry);

  const [displayedElapsed, setDisplayedElapsed] = useState(() => computeElapsed(entry));

  useEffect(() => {
    setDisplayedElapsed(computeElapsed(entry));
    if (!entry || entry.status !== "active") return;

    const interval = setInterval(() => setDisplayedElapsed(computeElapsed(entry)), 1000);
    return () => clearInterval(interval);
  }, [entry]);

  function start() {
    startTimerEntry({
      id: crypto.randomUUID(),
      configId,
      name,
      startedAt: Date.now(),
      elapsedMs: 0,
      status: "active",
    });
  }

  function pause() {
    if (!entry || entry.status !== "active") return;
    const now = Date.now();
    updateTimerEntry(entry.id, {
      elapsedMs: entry.elapsedMs + (now - entry.startedAt),
      pausedAt: now,
      status: "paused",
    });
  }

  function resume() {
    if (!entry || entry.status !== "paused") return;
    resumeTimerEntry(entry.id);
  }

  function complete() {
    if (!entry) return;
    updateTimerEntry(entry.id, {
      elapsedMs: computeElapsed(entry),
      completedAt: Date.now(),
      status: "completed",
    });
  }

  return {
    status: entry?.status ?? null,
    displayedElapsed,
    start,
    pause,
    resume,
    complete,
  };
}
