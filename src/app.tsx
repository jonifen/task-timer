import { useEffect, useState } from "react";

import { lightTheme, darkTheme } from "./theme.css";
import { Routes } from "./routes";
import { useAppStore } from "./store";

export function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const loadTimerConfigs = useAppStore((s) => s.loadTimerConfigs);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(mediaQuery.matches ? "dark" : "light");

    const handler = (e: MediaQueryListEvent) => setTheme(e.matches ? "dark" : "light");
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    loadTimerConfigs();
  }, [loadTimerConfigs]);

  return (
    <div className={theme === "dark" ? darkTheme : lightTheme}>
      <Routes />
    </div>
  );
}
