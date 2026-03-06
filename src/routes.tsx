import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes as RouterRoutes, useLocation, useNavigate } from "react-router-dom";

import { Header } from "./components/header/header";
import { AnalyticsPage } from "./pages/analytics";
import { HomePage } from "./pages/home";
import { TimersPage } from "./pages/timers";
import { HistoryPage } from "./pages/history";

const VISITED_KEY = "hasVisited";

const todayPath = (): string => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `/history/${yyyy}/${mm}/${dd}`;
};

function InitialRedirect() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname !== "/") return;
    if (localStorage.getItem(VISITED_KEY)) {
      navigate(todayPath(), { replace: true });
    } else {
      localStorage.setItem(VISITED_KEY, "true");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

export function Routes() {
  return (
    <BrowserRouter>
      <InitialRedirect />
      <Header />
      <RouterRoutes>
        <Route path="/" element={<HomePage />} />
        <Route path="/timers" element={<TimersPage />} />
        <Route path="/history/:yyyy/:mm/:dd" element={<HistoryPage />} />
        <Route path="/history" element={<Navigate to={todayPath()} replace />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </RouterRoutes>
    </BrowserRouter>
  );
}
