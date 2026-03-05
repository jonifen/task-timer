import { Link } from "react-router-dom";

import * as styles from "./week-picker.css";

interface Props {
  /** The currently selected date as a YYYY-MM-DD string. */
  selectedDate: string;
}

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Returns a Date object from a YYYY-MM-DD string, interpreted in local time. */
function parseLocalDate(date: string): Date {
  const [yyyy, mm, dd] = date.split("-").map(Number);
  return new Date(yyyy, mm - 1, dd);
}

/** Formats a Date to a YYYY-MM-DD string in local time. */
function formatDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/** Returns the Monday of the week containing the given date (ISO week: Mon–Sun). */
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sun, 1 = Mon, …
  const diff = day === 0 ? -6 : 1 - day; // shift so Monday = 0
  d.setDate(d.getDate() + diff);
  return d;
}

/** Adds `days` days to a Date, returning a new Date. */
function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function toHistoryPath(date: string): string {
  const [yyyy, mm, dd] = date.split("-");
  return `/history/${yyyy}/${mm}/${dd}`;
}

export function WeekPicker({ selectedDate }: Props) {
  const today = formatDate(new Date());
  const selected = parseLocalDate(selectedDate);
  const weekStart = getWeekStart(selected);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    return { date: formatDate(date), label: DAY_NAMES[i], dayNumber: date.getDate() };
  });

  const prevWeekDate = formatDate(addDays(weekStart, -7));
  const nextWeekDate = formatDate(addDays(weekStart, 7));

  return (
    <div className={styles.container}>
      <Link to={toHistoryPath(prevWeekDate)} className={styles.weekNav} aria-label="Previous week">
        ‹
      </Link>

      <div className={styles.days}>
        {weekDays.map(({ date, label, dayNumber }) => {
          const isActive = date === selectedDate;
          const isToday = date === today;
          const className = [
            styles.dayLink,
            isActive ? styles.dayLinkActive : "",
            isToday && !isActive ? styles.dayLinkToday : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <Link key={date} to={toHistoryPath(date)} className={className} aria-current={isActive ? "date" : undefined}>
              <span className={styles.dayName}>{label}</span>
              <span className={styles.dayNumber}>{dayNumber}</span>
            </Link>
          );
        })}
      </div>

      <Link to={toHistoryPath(nextWeekDate)} className={styles.weekNav} aria-label="Next week">
        ›
      </Link>
    </div>
  );
}
