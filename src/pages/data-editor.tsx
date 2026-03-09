import { useEffect, useState } from "react";

import { db } from "../db";
import type { TimerConfig, DailyHistory } from "../store";

import * as styles from "./data-editor.css";

type StoreType = "config" | "history";

interface DataRecord {
  type: StoreType;
  key: string;
  label: string;
  data: TimerConfig | DailyHistory;
}

async function loadAllRecords(): Promise<DataRecord[]> {
  const [configs, histories] = await Promise.all([db.timerConfigs.getAll(), db.dailyHistory.getAll()]);

  const configRecords: DataRecord[] = configs.map((c) => ({
    type: "config",
    key: c.id,
    label: c.name,
    data: c,
  }));

  const historyRecords: DataRecord[] = histories.map((h) => ({
    type: "history",
    key: h.date,
    label: h.date,
    data: h,
  }));

  return [...configRecords, ...historyRecords];
}

async function saveRecord(record: DataRecord, parsed: unknown): Promise<void> {
  if (record.type === "config") {
    await db.timerConfigs.set(parsed as TimerConfig);
  } else {
    await db.dailyHistory.set(parsed as DailyHistory);
  }
}

interface EditorState {
  key: string;
  value: string;
  error: string | null;
  saving: boolean;
}

export function DataEditorPage() {
  const [records, setRecords] = useState<DataRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editor, setEditor] = useState<EditorState | null>(null);

  async function reload() {
    setLoading(true);
    setRecords(await loadAllRecords());
    setLoading(false);
  }

  useEffect(() => {
    reload();
  }, []);

  function openEditor(record: DataRecord) {
    setEditor({
      key: record.key,
      value: JSON.stringify(record.data, null, 2),
      error: null,
      saving: false,
    });
  }

  function closeEditor() {
    setEditor(null);
  }

  async function handleDelete(record: DataRecord) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${record.label}"? This cannot be undone.`
    );
    if (!confirmed) return;

    setEditor((e) => e && { ...e, saving: true, error: null });
    try {
      if (record.type === "config") {
        await db.timerConfigs.remove(record.key);
      } else {
        await db.dailyHistory.remove(record.key);
      }
      await reload();
      setEditor(null);
    } catch (err) {
      setEditor((e) => e && { ...e, saving: false, error: err instanceof Error ? err.message : "Failed to delete." });
    }
  }

  async function handleSave(record: DataRecord) {
    if (!editor) return;

    let parsed: unknown;
    try {
      parsed = JSON.parse(editor.value);
    } catch {
      setEditor((e) => e && { ...e, error: "Invalid JSON — please fix the syntax before saving." });
      return;
    }

    setEditor((e) => e && { ...e, saving: true, error: null });
    try {
      await saveRecord(record, parsed);
      await reload();
      setEditor(null);
    } catch (err) {
      setEditor((e) => e && { ...e, saving: false, error: err instanceof Error ? err.message : "Failed to save." });
    }
  }

  const configRecords = records.filter((r) => r.type === "config");
  const historyRecords = records.filter((r) => r.type === "history");

  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>Data editor</h1>
      <p className={styles.description}>
        Browse and directly edit all records stored in IndexedDB. Changes take effect immediately on save.
      </p>

      {loading && <p className={styles.message}>Loading…</p>}

      {!loading && records.length === 0 && <p className={styles.message}>No records found.</p>}

      {!loading && records.length > 0 && (
        <>
          <RecordGroup
            title="Timer configurations"
            records={configRecords}
            editor={editor}
            onOpen={openEditor}
            onClose={closeEditor}
            onSave={handleSave}
            onDelete={handleDelete}
            onEditorChange={(value) => setEditor((e) => e && { ...e, value, error: null })}
          />
          <RecordGroup
            title="Daily history"
            records={historyRecords}
            editor={editor}
            onOpen={openEditor}
            onClose={closeEditor}
            onSave={handleSave}
            onDelete={handleDelete}
            onEditorChange={(value) => setEditor((e) => e && { ...e, value, error: null })}
          />
        </>
      )}
    </main>
  );
}

interface RecordGroupProps {
  title: string;
  records: DataRecord[];
  editor: EditorState | null;
  onOpen: (record: DataRecord) => void;
  onClose: () => void;
  onSave: (record: DataRecord) => void;
  onDelete: (record: DataRecord) => void;
  onEditorChange: (value: string) => void;
}

function RecordGroup({ title, records, editor, onOpen, onClose, onSave, onDelete, onEditorChange }: RecordGroupProps) {
  return (
    <section className={styles.group}>
      <h2 className={styles.groupHeading}>
        {title}
        <span className={styles.groupCount}>{records.length}</span>
      </h2>

      {records.length === 0 ? (
        <p className={styles.emptyGroup}>No records.</p>
      ) : (
        <ul className={styles.list}>
          {records.map((record) => {
            const isEditing = editor?.key === record.key;
            return (
              <li key={record.key} className={`${styles.item} ${isEditing ? styles.itemEditing : ""}`}>
                <button className={styles.itemButton} onClick={() => (isEditing ? onClose() : onOpen(record))}>
                  <span className={styles.itemLabel}>{record.label}</span>
                  <span className={styles.itemKey}>{record.key}</span>
                  <span className={styles.itemChevron}>{isEditing ? "▲" : "▼"}</span>
                </button>

                {isEditing && editor && (
                  <div className={styles.editorPanel}>
                    <textarea
                      className={styles.textarea}
                      value={editor.value}
                      onChange={(e) => onEditorChange(e.target.value)}
                      spellCheck={false}
                      rows={20}
                    />
                    {editor.error && <p className={styles.errorMessage}>{editor.error}</p>}
                    <div className={styles.editorActions}>
                      <button className={styles.deleteButton} onClick={() => onDelete(record)} disabled={editor.saving}>
                        Delete
                      </button>
                      <button className={styles.cancelButton} onClick={onClose} disabled={editor.saving}>
                        Cancel
                      </button>
                      <button className={styles.saveButton} onClick={() => onSave(record)} disabled={editor.saving}>
                        {editor.saving ? "Saving…" : "Save"}
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
