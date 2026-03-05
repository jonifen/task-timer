import { useState } from "react";

import { TimerConfigCard } from "../components/timer-config-card/timer-config-card";
import { TimerConfigForm } from "../components/timer-config-form/timer-config-form";
import { useAppStore } from "../store";

import * as styles from "./timers.css";

export function TimersPage() {
  const timerConfigs = useAppStore((s) => s.timerConfigs);
  const addTimerConfig = useAppStore((s) => s.addTimerConfig);
  const updateTimerConfig = useAppStore((s) => s.updateTimerConfig);
  const removeTimerConfig = useAppStore((s) => s.removeTimerConfig);

  const [addingNew, setAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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

  return (
    <main className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.heading}>Timers</h1>
        {!addingNew && (
          <button className={styles.addButton} onClick={handleStartAdding}>
            + New timer
          </button>
        )}
      </div>

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
