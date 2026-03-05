import { useState } from "react";

import * as styles from "./timer-config-form.css";

export interface TimerConfigFormValues {
  name: string;
  color: string | undefined;
}

interface Props {
  initialValues?: TimerConfigFormValues;
  submitLabel: string;
  onSubmit: (values: TimerConfigFormValues) => void;
  onCancel: () => void;
}

const PRESET_COLORS = [
  { label: "Red", value: "#ef4444" },
  { label: "Orange", value: "#f97316" },
  { label: "Amber", value: "#f59e0b" },
  { label: "Green", value: "#22c55e" },
  { label: "Teal", value: "#14b8a6" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Violet", value: "#8b5cf6" },
  { label: "Pink", value: "#ec4899" },
];

export function TimerConfigForm({ initialValues, submitLabel, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [color, setColor] = useState<string | undefined>(initialValues?.color);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), color });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="timer-name">
          Name
        </label>
        <input
          id="timer-name"
          className={styles.input}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Deep work"
          autoFocus
          required
        />
      </div>

      <div className={styles.field}>
        <span className={styles.label}>Colour</span>
        <div className={styles.swatches} role="radiogroup" aria-label="Timer colour">
          <button
            type="button"
            role="radio"
            aria-checked={color === undefined}
            aria-label="No colour"
            className={`${styles.swatch} ${styles.swatchNone} ${color === undefined ? styles.swatchSelected : ""}`}
            onClick={() => setColor(undefined)}
          />
          {PRESET_COLORS.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={color === value}
              aria-label={label}
              className={`${styles.swatch} ${color === value ? styles.swatchSelected : ""}`}
              style={{ backgroundColor: value }}
              onClick={() => setColor(value)}
            />
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" className={`${styles.button} ${styles.buttonSecondary}`} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`} disabled={!name.trim()}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
