import { BrowserRouter, Navigate, Route, Routes as RouterRoutes } from "react-router-dom";

import { Header } from "./components/header/header";
import { HomePage } from "./pages/home";
import { TimersPage } from "./pages/timers";
import { HistoryPage } from "./pages/history";

const todayPath = (): string => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `/history/${yyyy}/${mm}/${dd}`;
};

export function Routes() {
  return (
    <BrowserRouter>
      <Header />
      <RouterRoutes>
        <Route path="/" element={<HomePage />} />
        <Route path="/timers" element={<TimersPage />} />
        <Route path="/history/:yyyy/:mm/:dd" element={<HistoryPage />} />
        <Route path="/history" element={<Navigate to={todayPath()} replace />} />
      </RouterRoutes>
    </BrowserRouter>
  );
}
