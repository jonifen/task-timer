import { NavLink, Link } from "react-router-dom";

import * as styles from "./header.css";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/timers", label: "Timers", end: false },
  { to: "/history", label: "History", end: false },
  { to: "/analytics", label: "Analytics", end: false },
] as const;

export function Header() {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.title}>
        Task Timer
      </Link>
      <nav className={styles.nav}>
        {NAV_LINKS.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `${styles.navLink}${isActive ? ` ${styles.navLinkActive}` : ""}`}
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
