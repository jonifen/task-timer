import { useState } from "react";

import { QuickTimerCard } from "../components/quick-timer-card/quick-timer-card";
import { TimerConfigCard } from "../components/timer-config-card/timer-config-card";
import { TimerConfigForm } from "../components/timer-config-form/timer-config-form";
import { useAppStore } from "../store";

import * as styles from "./timers.css";

export function TimersPage() {
  const timerConfigs = useAppStore((s) => s.timerConfigs);
  const timerEntries = useAppStore((s) => s.timerEntries);
  const addTimerConfig = useAppStore((s) => s.addTimerConfig);
  const updateTimerConfig = useAppStore((s) => s.updateTimerConfig);
  const removeTimerConfig = useAppStore((s) => s.removeTimerConfig);
  const startTimerEntry = useAppStore((s) => s.startTimerEntry);
  const stopAllTimerEntries = useAppStore((s) => s.stopAllTimerEntries);

  const [addingNew, setAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [quickTimerId, setQuickTimerId] = useState<string | null>(null);

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
    setQuickTimerId(id);
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
        <QuickTimerCard entryId={quickTimerId} onDismiss={() => setQuickTimerId(null)} />
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
