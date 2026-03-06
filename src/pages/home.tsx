import { Link } from "react-router-dom";

import * as styles from "./home.css";

const FEATURES = [
  {
    icon: "▶",
    title: "Reusable timers",
    desc: "Create named timers for recurring tasks — meetings, coding, admin — and start them with one click. Only one timer runs at a time; starting a new one automatically pauses the current.",
  },
  {
    icon: "⚡",
    title: "Quick timer",
    desc: "Need to track something on the fly? Hit Quick timer to start immediately, then give it a name whenever you like. It saves to your history without cluttering your timer list.",
  },
  {
    icon: "📅",
    title: "Daily history",
    desc: "Every session is recorded with start time, end time, and duration. Browse past dates to review what you worked on and for how long.",
  },
  {
    icon: "📊",
    title: "Analytics",
    desc: "See where your time goes across any date range. A daily breakdown chart and per-timer totals make it easy to spot patterns and stay on top of your workload.",
  },
  {
    icon: "🔒",
    title: "Fully private",
    desc: "All data is stored locally in your browser using IndexedDB — nothing is sent to a server. Your time tracking stays on your device.",
  },
] as const;

export function HomePage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.heading}>Track your time,{"\n"}without the overhead.</h1>
        <p className={styles.tagline}>
          Task Timer is a lightweight, browser-based time tracker. Create reusable timers for your recurring tasks,
          start and pause them as you switch context, and review your day at a glance.
        </p>
        <div className={styles.ctaRow}>
          <Link to="/timers" className={`${styles.ctaButton} ${styles.ctaPrimary}`}>
            Go to Timers
          </Link>
          <Link to="/history" className={`${styles.ctaButton} ${styles.ctaSecondary}`}>
            View Today
          </Link>
        </div>
      </section>

      <section>
        <p className={styles.sectionHeading}>What you can do</p>
        <div className={styles.featureList}>
          {FEATURES.map(({ icon, title, desc }) => (
            <div key={title} className={styles.featureItem}>
              <span className={styles.featureIcon}>{icon}</span>
              <div className={styles.featureText}>
                <span className={styles.featureTitle}>{title}</span>
                <span className={styles.featureDesc}>{desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <p className={styles.note}>
        Tip: after your first visit this page won't appear again — the app will take you straight to today's history.
        You can always return here via the Home link in the navigation.
      </p>
    </main>
  );
}
