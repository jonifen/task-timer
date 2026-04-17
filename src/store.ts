import { create } from "zustand";

import { db } from "./db";

export interface TimerConfig {
  id: string;
  name: string;
  color?: string;
  lastUsedAt?: number;
}

export type TimerStatus = "active" | "completed";

export interface TimerEntry {
  id: string;
  configId?: string;
  name: string;
  startedAt: number;
  completedAt?: number;
  elapsedMs: number;
  status: TimerStatus;
}

export interface DailyHistory {
  date: string;
  entries: TimerEntry[];
}

interface AppState {
  timerConfigs: TimerConfig[];
  currentDate: string;
  timerEntries: TimerEntry[];
}

interface AppActions {
  // Timer config actions
  loadTimerConfigs: () => Promise<void>;
  addTimerConfig: (config: TimerConfig) => Promise<void>;
  updateTimerConfig: (config: TimerConfig) => Promise<void>;
  removeTimerConfig: (id: string) => Promise<void>;

  // Date navigation
  navigateToDate: (date: string) => Promise<void>;

  // Timer entry actions
  startTimerEntry: (entry: TimerEntry) => void;
  addTimerEntry: (entry: TimerEntry) => void;
  updateTimerEntry: (id: string, updates: Partial<TimerEntry>) => void;
  removeTimerEntry: (id: string) => void;
  stopAllTimerEntries: () => void;
}

export type AppStore = AppState & AppActions;

const todayString = (): string => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const useAppStore = create<AppStore>((set, get) => ({
  timerConfigs: [],
  currentDate: todayString(),
  timerEntries: [],

  loadTimerConfigs: async () => {
    const configs = await db.timerConfigs.getAll();
    set({ timerConfigs: configs });
  },

  addTimerConfig: async (config) => {
    await db.timerConfigs.set(config);
    set((state) => ({ timerConfigs: [...state.timerConfigs, config] }));
  },

  updateTimerConfig: async (config) => {
    await db.timerConfigs.set(config);
    set((state) => ({
      timerConfigs: state.timerConfigs.map((c) => (c.id === config.id ? config : c)),
    }));
  },

  removeTimerConfig: async (id) => {
    await db.timerConfigs.remove(id);
    set((state) => ({ timerConfigs: state.timerConfigs.filter((c) => c.id !== id) }));
  },

  navigateToDate: async (date) => {
    // No save here — every timer action already persists immediately.
    const history = await db.dailyHistory.get(date);
    // Migrate any legacy "paused" entries (from before pause was removed) to "completed".
    const entries = (history?.entries ?? []).map((e) =>
      (e.status as string) === "paused"
        ? { ...e, status: "completed" as const, completedAt: (e as any).pausedAt ?? e.startedAt }
        : e
    );
    set({ currentDate: date, timerEntries: entries });
  },

  startTimerEntry: (entry) => {
    const now = Date.now();
    // Always save to today — using currentDate here would risk writing to a
    // previously-viewed historic date if navigateToDate hasn't resolved yet.
    const today = todayString();
    set((state) => {
      const updatedConfigs = entry.configId
        ? state.timerConfigs.map((c) => (c.id === entry.configId ? { ...c, lastUsedAt: now } : c))
        : state.timerConfigs;
      return {
        currentDate: today,
        timerConfigs: updatedConfigs,
        timerEntries: [
          ...state.timerEntries.map((e) =>
            e.status === "active"
              ? { ...e, status: "completed" as const, elapsedMs: e.elapsedMs + (now - e.startedAt), completedAt: now }
              : e
          ),
          entry,
        ],
      };
    });
    const { timerEntries, timerConfigs } = get();
    db.dailyHistory.set({ date: today, entries: timerEntries });
    if (entry.configId) {
      const config = timerConfigs.find((c) => c.id === entry.configId);
      if (config) db.timerConfigs.set(config);
    }
  },

  addTimerEntry: (entry) => {
    set((state) => ({ timerEntries: [...state.timerEntries, entry] }));
  },

  updateTimerEntry: (id, updates) => {
    set((state) => ({
      timerEntries: state.timerEntries.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
    const { currentDate, timerEntries } = get();
    db.dailyHistory.set({ date: currentDate, entries: timerEntries });
  },

  removeTimerEntry: (id) => {
    set((state) => ({
      timerEntries: state.timerEntries.filter((e) => e.id !== id),
    }));
    const { currentDate, timerEntries } = get();
    db.dailyHistory.set({ date: currentDate, entries: timerEntries });
  },

  stopAllTimerEntries: () => {
    const now = Date.now();
    set((state) => ({
      timerEntries: state.timerEntries.map((e) =>
        e.status === "active"
          ? { ...e, status: "completed" as const, elapsedMs: e.elapsedMs + (now - e.startedAt), completedAt: now }
          : e
      ),
    }));
    const { currentDate, timerEntries } = get();
    db.dailyHistory.set({ date: currentDate, entries: timerEntries });
  },
}));
