import { useEffect, useState } from "react";

import { QuickTimerCard } from "../components/quick-timer-card/quick-timer-card";
import { TimerConfigCard } from "../components/timer-config-card/timer-config-card";
import { TimerConfigForm } from "../components/timer-config-form/timer-config-form";
import { useAppStore } from "../store";

import * as styles from "./timers.css";

const todayStr = (): string => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export function TimersPage() {
  const timerConfigs = useAppStore((s) => s.timerConfigs);
  const timerEntries = useAppStore((s) => s.timerEntries);
  const addTimerConfig = useAppStore((s) => s.addTimerConfig);
  const updateTimerConfig = useAppStore((s) => s.updateTimerConfig);
  const removeTimerConfig = useAppStore((s) => s.removeTimerConfig);
  const startTimerEntry = useAppStore((s) => s.startTimerEntry);
  const stopAllTimerEntries = useAppStore((s) => s.stopAllTimerEntries);
  const navigateToDate = useAppStore((s) => s.navigateToDate);

  // Derive the active/paused quick timer entry directly from the store so it
  // survives a page refresh without needing to persist UI state.
  const quickTimerId = useAppStore(
    (s) => s.timerEntries.find((e) => !e.configId && (e.status === "active" || e.status === "paused"))?.id ?? null
  );

  const [addingNew, setAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Load today's entries on mount so the quick timer and daily totals are
  // available even when arriving directly at /timers (e.g. after a refresh).
  useEffect(() => {
    navigateToDate(todayStr());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const hasRunningTimers = timerEntries.some((e) => e.status === "active" || e.status === "paused");

  function handleAdd(values: { name: string; color: string | undefined }) {
    addTimerConfig({ id: crypto.randomUUID(), name: values.name, color: values.color });
    setAddingNew(false);
  }

  function handleUpdate(id: string, values: { name: string; color: string | undefined }) {
    updateTimerConfig({ id, name: values.name, color: values.color });
    setEditingId(null);
  }

  function handleDelete(id: string) {
    removeTimerConfig(id);
    if (editingId === id) setEditingId(null);
  }

  function handleStartAdding() {
    setEditingId(null);
    setAddingNew(true);
  }

  function handleStartEditing(id: string) {
    setAddingNew(false);
    setEditingId(id);
  }

  function handleQuickTimer() {
    const id = crypto.randomUUID();
    startTimerEntry({ id, name: "Quick timer", startedAt: Date.now(), elapsedMs: 0, status: "active" });
  }

  return (
    <main className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.heading}>Timers</h1>
        <div className={styles.headerActions}>
          {hasRunningTimers && (
            <button className={styles.stopAllButton} onClick={stopAllTimerEntries}>
              ■ Stop all
            </button>
          )}
          {!quickTimerId && (
            <button className={styles.quickButton} onClick={handleQuickTimer}>
              ⚡ Quick timer
            </button>
          )}
          {!addingNew && (
            <button className={styles.addButton} onClick={handleStartAdding}>
              + New timer
            </button>
          )}
        </div>
      </div>

      {quickTimerId && (
        <QuickTimerCard entryId={quickTimerId} onDismiss={() => {}} />
      )}

      <div className={styles.list}>
        {timerConfigs.length === 0 && !addingNew && (
          <p className={styles.emptyState}>No timers yet. Create one to get started.</p>
        )}

        {timerConfigs.map((config) =>
          editingId === config.id ? (
            <TimerConfigForm
              key={config.id}
              initialValues={{ name: config.name, color: config.color }}
              submitLabel="Save"
              onSubmit={(values) => handleUpdate(config.id, values)}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <TimerConfigCard
              key={config.id}
              config={config}
              onEdit={() => handleStartEditing(config.id)}
              onDelete={() => handleDelete(config.id)}
            />
          )
        )}

        {addingNew && (
          <TimerConfigForm
            submitLabel="Add timer"
            onSubmit={handleAdd}
            onCancel={() => setAddingNew(false)}
          />
        )}
      </div>
    </main>
  );
}
