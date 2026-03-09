import { create } from "zustand";

import { db } from "./db";

export interface TimerConfig {
  id: string;
  name: string;
  color?: string;
  lastUsedAt?: number;
}

export type TimerStatus = "active" | "paused" | "completed";

export interface TimerEntry {
  id: string;
  configId?: string;
  name: string;
  startedAt: number;
  pausedAt?: number;
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
  resumeTimerEntry: (id: string) => void;
  addTimerEntry: (entry: TimerEntry) => void;
  updateTimerEntry: (id: string, updates: Partial<TimerEntry>) => void;
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
    // No save here — every timer action (start/resume/pause/complete) already
    // persists immediately, so saving the in-memory state on navigation would
    // risk overwriting IndexedDB with the store's empty initial state on refresh.
    const history = await db.dailyHistory.get(date);
    set({ currentDate: date, timerEntries: history?.entries ?? [] });
  },

  startTimerEntry: (entry) => {
    const now = Date.now();
    set((state) => {
      const updatedConfigs = entry.configId
        ? state.timerConfigs.map((c) => (c.id === entry.configId ? { ...c, lastUsedAt: now } : c))
        : state.timerConfigs;
      return {
        timerConfigs: updatedConfigs,
        timerEntries: [
          ...state.timerEntries.map((e) =>
            e.status === "active"
              ? { ...e, status: "paused" as const, elapsedMs: e.elapsedMs + (now - e.startedAt), pausedAt: now }
              : e
          ),
          entry,
        ],
      };
    });
    const { currentDate, timerEntries, timerConfigs } = get();
    db.dailyHistory.set({ date: currentDate, entries: timerEntries });
    if (entry.configId) {
      const config = timerConfigs.find((c) => c.id === entry.configId);
      if (config) db.timerConfigs.set(config);
    }
  },

  resumeTimerEntry: (id) => {
    const now = Date.now();
    set((state) => ({
      timerEntries: state.timerEntries.map((e) => {
        if (e.id === id) return { ...e, status: "active" as const, startedAt: now };
        if (e.status === "active") return { ...e, status: "paused" as const, elapsedMs: e.elapsedMs + (now - e.startedAt), pausedAt: now };
        return e;
      }),
    }));
    const { currentDate, timerEntries } = get();
    db.dailyHistory.set({ date: currentDate, entries: timerEntries });
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

  stopAllTimerEntries: () => {
    const now = Date.now();
    set((state) => ({
      timerEntries: state.timerEntries.map((e) => {
        if (e.status === "active")
          return { ...e, status: "completed" as const, elapsedMs: e.elapsedMs + (now - e.startedAt), completedAt: now };
        if (e.status === "paused")
          return { ...e, status: "completed" as const, completedAt: now };
        return e;
      }),
    }));
    const { currentDate, timerEntries } = get();
    db.dailyHistory.set({ date: currentDate, entries: timerEntries });
  },
}));
