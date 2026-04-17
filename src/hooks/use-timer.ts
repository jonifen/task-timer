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
    (s) => s.timerEntries.find((e) => e.configId === configId && e.status === "active") ?? null
  );
  const startTimerEntry = useAppStore((s) => s.startTimerEntry);
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
    complete,
  };
}
