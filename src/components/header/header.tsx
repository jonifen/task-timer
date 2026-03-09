import { NavLink, Link } from "react-router-dom";

import * as styles from "./header.css";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/timers", label: "Timers", end: false },
  { to: "/history", label: "History", end: false },
  { to: "/analytics", label: "Analytics", end: false },
  { to: "/settings", label: "Settings", end: false },
] as const;

function handlePopOut() {
  window.open(window.location.href, "_blank", "toolbar=no,location=no,menubar=no,scrollbars=yes,resizable=yes,width=1280,height=800");
}

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
      <button className={styles.popOutButton} onClick={handlePopOut} title="Open in new window" aria-label="Open in new window">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M6 1H1v12h12V8M8 1h5m0 0v5m0-5L6 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </header>
  );
}
