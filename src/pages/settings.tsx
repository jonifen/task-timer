import { useRef, useState } from "react";
import { Link } from "react-router-dom";

import { exportData } from "../utils/export-data";
import { importData } from "../utils/import-data";

import * as styles from "./settings.css";

export function SettingsPage() {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleExport() {
    setExporting(true);
    await exportData();
    setExporting(false);
  }

  function handleImportClick() {
    setImportError(null);
    setImportSuccess(false);
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const confirmed = window.confirm(
      "This will delete all existing timer configurations and history, replacing them with the contents of the imported file. This cannot be undone.\n\nAre you sure you want to continue?"
    );

    // Reset input so the same file can be re-selected if needed
    e.target.value = "";

    if (!confirmed) return;

    setImporting(true);
    setImportError(null);
    setImportSuccess(false);

    try {
      await importData(file);
      setImportSuccess(true);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "Failed to import file.");
    } finally {
      setImporting(false);
    }
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>Settings</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>Import &amp; Export</h2>
        <p className={styles.sectionDescription}>
          Export all your timer configurations and history to a JSON file, or restore from a previously exported file.
        </p>

        <div className={styles.actions}>
          <div className={styles.action}>
            <div className={styles.actionText}>
              <span className={styles.actionLabel}>Export data</span>
              <span className={styles.actionHint}>Downloads a JSON file containing all timer configs and history.</span>
            </div>
            <button className={styles.button} onClick={handleExport} disabled={exporting}>
              {exporting ? "Exporting…" : "Export JSON"}
            </button>
          </div>

          <div className={styles.action}>
            <div className={styles.actionText}>
              <span className={styles.actionLabel}>Import data</span>
              <span className={styles.actionHint}>
                Restores from a previously exported JSON file. All existing data will be replaced.
              </span>
            </div>
            <button className={styles.buttonDanger} onClick={handleImportClick} disabled={importing}>
              {importing ? "Importing…" : "Import from JSON"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              className={styles.hiddenInput}
              onChange={handleFileChange}
            />
          </div>
        </div>

        {importSuccess && (
          <p className={styles.successMessage}>Data imported successfully. Reload the page to see your restored data.</p>
        )}
        {importError && <p className={styles.errorMessage}>{importError}</p>}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>Developer tools</h2>
        <p className={styles.sectionDescription}>Advanced tools for inspecting and editing raw data stored in IndexedDB.</p>

        <div className={styles.actions}>
          <div className={styles.action}>
            <div className={styles.actionText}>
              <span className={styles.actionLabel}>Data editor</span>
              <span className={styles.actionHint}>Browse and directly edit all timer configuration and history records.</span>
            </div>
            <Link to="/settings/data-editor" className={styles.linkButton}>
              Open editor
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
