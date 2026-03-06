import localforage from "localforage";

import type { TimerConfig, DailyHistory } from "../store";

const timerConfigsStore = localforage.createInstance({
  name: "task-timer",
  storeName: "timer-configs",
});

const dailyHistoryStore = localforage.createInstance({
  name: "task-timer",
  storeName: "daily-history",
});

export const db = {
  timerConfigs: {
    async getAll(): Promise<TimerConfig[]> {
      const configs: TimerConfig[] = [];
      await timerConfigsStore.iterate<TimerConfig, void>((value) => {
        configs.push(value);
      });
      return configs;
    },

    async set(config: TimerConfig): Promise<void> {
      await timerConfigsStore.setItem(config.id, config);
    },

    async remove(id: string): Promise<void> {
      await timerConfigsStore.removeItem(id);
    },
  },

  dailyHistory: {
    async get(date: string): Promise<DailyHistory | null> {
      return dailyHistoryStore.getItem<DailyHistory>(date);
    },

    async set(history: DailyHistory): Promise<void> {
      await dailyHistoryStore.setItem(history.date, history);
    },

    async getRange(startDate: string, endDate: string): Promise<DailyHistory[]> {
      const results: DailyHistory[] = [];
      await dailyHistoryStore.iterate<DailyHistory, void>((value) => {
        if (value.date >= startDate && value.date <= endDate) results.push(value);
      });
      return results.sort((a, b) => a.date.localeCompare(b.date));
    },

    async getAll(): Promise<DailyHistory[]> {
      const results: DailyHistory[] = [];
      await dailyHistoryStore.iterate<DailyHistory, void>((value) => {
        results.push(value);
      });
      return results.sort((a, b) => a.date.localeCompare(b.date));
    },
  },
};
