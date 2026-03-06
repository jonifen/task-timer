import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { db } from "../db";
import { formatDurationHuman } from "../utils/format-duration";
import { buildDateRange, processAnalyticsData, type AnalyticsData } from "../utils/analytics";
import { exportData } from "../utils/export-data";

import * as styles from "./analytics.css";

const todayStr = (): string => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const offsetDate = (date: string, days: number): string => {
  const [yyyy, mm, dd] = date.split("-").map(Number);
  const d = new Date(yyyy, mm - 1, dd);
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const dy = String(d.getDate()).padStart(2, "0");
  return `${y}-${mo}-${dy}`;
};

const PRESETS = [
  { label: "Last 7 days", days: 6 },
  { label: "Last 14 days", days: 13 },
  { label: "Last 30 days", days: 29 },
] as const;

function yAxisTick(ms: number): string {
  if (ms === 0) return "0";
  const hours = ms / 3600000;
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  return `${hours % 1 === 0 ? hours.toFixed(0) : hours.toFixed(1)}h`;
}

export function AnalyticsPage() {
  const today = todayStr();
  const [startDate, setStartDate] = useState(() => offsetDate(today, -6));
  const [endDate, setEndDate] = useState(today);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const allDates = useMemo(() => buildDateRange(startDate, endDate), [startDate, endDate]);

  useEffect(() => {
    if (startDate > endDate) return;
    setLoading(true);
    db.dailyHistory.getRange(startDate, endDate).then((histories) => {
      setData(processAnalyticsData(histories, allDates));
      setLoading(false);
    });
  }, [startDate, endDate, allDates]);

  async function handleExport() {
    setExporting(true);
    await exportData();
    setExporting(false);
  }

  function applyPreset(days: number) {
    const end = today;
    setStartDate(offsetDate(end, -days));
    setEndDate(end);
  }

  const xAxisInterval = allDates.length > 14 ? Math.ceil(allDates.length / 14) - 1 : 0;

  const hasData = data && data.totalMs > 0;

  return (
    <main className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.heading}>Analytics</h1>
        <button className={styles.exportButton} onClick={handleExport} disabled={exporting}>
          {exporting ? "Exporting…" : "Export JSON"}
        </button>
      </div>

      <section className={styles.controls}>
        <div className={styles.presets}>
          {PRESETS.map(({ label, days }) => (
            <button
              key={label}
              className={`${styles.presetButton} ${startDate === offsetDate(today, -days) && endDate === today ? styles.presetButtonActive : ""}`}
              onClick={() => applyPreset(days)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className={styles.dateInputs}>
          <label className={styles.dateLabel}>
            From
            <input
              type="date"
              className={styles.dateInput}
              value={startDate}
              max={endDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label className={styles.dateLabel}>
            To
            <input
              type="date"
              className={styles.dateInput}
              value={endDate}
              min={startDate}
              max={today}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
        </div>
      </section>

      {loading && <p className={styles.message}>Loading…</p>}

      {!loading && !hasData && (
        <p className={styles.message}>No timer data recorded in this period.</p>
      )}

      {!loading && hasData && data && (
        <>
          <section className={styles.statsRow}>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{formatDurationHuman(data.totalMs)}</span>
              <span className={styles.statLabel}>Total tracked</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>
                {data.daysWithActivity}
                <span className={styles.statValueSuffix}> / {allDates.length}</span>
              </span>
              <span className={styles.statLabel}>Active days</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{data.timerStats[0]?.name ?? "—"}</span>
              <span className={styles.statLabel}>Most used timer</span>
            </div>
          </section>

          <section className={styles.chartSection}>
            <h2 className={styles.chartHeading}>Daily breakdown</h2>
            <div className={styles.chartWrap}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data.dailyBars} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11 }}
                    interval={xAxisInterval}
                    angle={allDates.length > 14 ? -40 : 0}
                    textAnchor={allDates.length > 14 ? "end" : "middle"}
                    height={allDates.length > 14 ? 52 : 28}
                  />
                  <YAxis tickFormatter={yAxisTick} tick={{ fontSize: 11 }} width={40} />
                  <Tooltip
                    formatter={(value, _key, { name }) => [formatDurationHuman(Number(value)), name]}
                    contentStyle={{ fontSize: 13 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 13 }} />
                  {data.timerStats.map((stat) => (
                    <Bar key={stat.key} dataKey={stat.key} name={stat.name} stackId="a" fill={stat.color} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className={styles.chartSection}>
            <h2 className={styles.chartHeading}>Time by timer</h2>
            <div className={styles.pieWrap}>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={data.timerStats.map((s) => ({ name: s.name, value: s.totalMs, key: s.key }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={2}
                  >
                    {data.timerStats.map((stat) => (
                      <Cell key={stat.key} fill={stat.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatDurationHuman(Number(value))} contentStyle={{ fontSize: 13 }} />
                  <Legend
                    formatter={(value, entry) => {
                      const ms = (entry.payload as { value: number }).value;
                      return `${value} (${formatDurationHuman(ms)})`;
                    }}
                    wrapperStyle={{ fontSize: 13 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
