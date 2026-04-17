import { beforeAll, beforeEach, afterAll, describe, expect, it, vi } from "vitest";

import { db } from "./db";
import { useAppStore } from "./store";

vi.mock("./db", () => ({
  db: {
    timerConfigs: {
      getAll: vi.fn().mockResolvedValue([]),
      set: vi.fn().mockResolvedValue(undefined),
      remove: vi.fn().mockResolvedValue(undefined),
    },
    dailyHistory: {
      get: vi.fn().mockResolvedValue(null),
      set: vi.fn().mockResolvedValue(undefined),
    },
  },
}));

const mockDailyHistoryGet = vi.mocked(db.dailyHistory.get);
const mockDailyHistorySet = vi.mocked(db.dailyHistory.set);

const FIXED_NOW = new Date("2026-04-17T10:00:00.000Z").getTime();
const TODAY = "2026-04-17";

beforeAll(() => {
  vi.useFakeTimers();
  vi.setSystemTime(FIXED_NOW);
});

afterAll(() => {
  vi.useRealTimers();
});

beforeEach(() => {
  useAppStore.setState({ timerConfigs: [], currentDate: TODAY, timerEntries: [] });
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// startTimerEntry
// ---------------------------------------------------------------------------

describe("startTimerEntry", () => {
  it("adds the new entry to timerEntries", () => {
    const entry = { id: "1", name: "Deep work", startedAt: FIXED_NOW, elapsedMs: 0, status: "active" as const };
    useAppStore.getState().startTimerEntry(entry);
    expect(useAppStore.getState().timerEntries).toContainEqual(entry);
  });

  it("sets currentDate to today", () => {
    useAppStore.getState().startTimerEntry({ id: "1", name: "Test", startedAt: FIXED_NOW, elapsedMs: 0, status: "active" });
    expect(useAppStore.getState().currentDate).toBe(TODAY);
  });

  it("completes any currently active timer when starting a new one", () => {
    const first = { id: "1", name: "First", startedAt: FIXED_NOW - 5000, elapsedMs: 0, status: "active" as const };
    useAppStore.getState().startTimerEntry(first);
    useAppStore.getState().startTimerEntry({ id: "2", name: "Second", startedAt: FIXED_NOW, elapsedMs: 0, status: "active" });

    const entries = useAppStore.getState().timerEntries;
    expect(entries.find((e) => e.id === "1")?.status).toBe("completed");
    expect(entries.find((e) => e.id === "2")?.status).toBe("active");
  });

  it("accumulates elapsedMs on the auto-completed timer", () => {
    const startedAt = FIXED_NOW - 5000;
    useAppStore.getState().startTimerEntry({ id: "1", name: "First", startedAt, elapsedMs: 1000, status: "active" });
    useAppStore.getState().startTimerEntry({ id: "2", name: "Second", startedAt: FIXED_NOW, elapsedMs: 0, status: "active" });

    const completed = useAppStore.getState().timerEntries.find((e) => e.id === "1");
    // elapsedMs = prior 1000 + (FIXED_NOW - startedAt) = 1000 + 5000 = 6000
    expect(completed?.elapsedMs).toBe(6000);
    expect(completed?.completedAt).toBe(FIXED_NOW);
  });

  it("does not affect already-completed entries", () => {
    useAppStore.setState({
      timerEntries: [{ id: "done", name: "Done", startedAt: FIXED_NOW - 10000, elapsedMs: 5000, status: "completed", completedAt: FIXED_NOW - 5000 }],
    });
    useAppStore.getState().startTimerEntry({ id: "new", name: "New", startedAt: FIXED_NOW, elapsedMs: 0, status: "active" });

    const done = useAppStore.getState().timerEntries.find((e) => e.id === "done");
    expect(done?.status).toBe("completed");
    expect(done?.completedAt).toBe(FIXED_NOW - 5000);
  });

  it("persists to IndexedDB", () => {
    useAppStore.getState().startTimerEntry({ id: "1", name: "Test", startedAt: FIXED_NOW, elapsedMs: 0, status: "active" });
    expect(mockDailyHistorySet).toHaveBeenCalledOnce();
    expect(mockDailyHistorySet).toHaveBeenCalledWith(expect.objectContaining({ date: TODAY }));
  });

  it("updates lastUsedAt on the associated config", () => {
    useAppStore.setState({ timerConfigs: [{ id: "cfg-1", name: "Deep work" }] });
    useAppStore.getState().startTimerEntry({ id: "1", configId: "cfg-1", name: "Deep work", startedAt: FIXED_NOW, elapsedMs: 0, status: "active" });

    const config = useAppStore.getState().timerConfigs.find((c) => c.id === "cfg-1");
    expect(config?.lastUsedAt).toBe(FIXED_NOW);
  });
});

// ---------------------------------------------------------------------------
// stopAllTimerEntries
// ---------------------------------------------------------------------------

describe("stopAllTimerEntries", () => {
  it("marks all active timers as completed", () => {
    useAppStore.setState({
      timerEntries: [
        { id: "1", name: "A", startedAt: FIXED_NOW - 3000, elapsedMs: 0, status: "active" },
        { id: "2", name: "B", startedAt: FIXED_NOW - 1000, elapsedMs: 0, status: "active" },
      ],
    });
    useAppStore.getState().stopAllTimerEntries();

    const { timerEntries } = useAppStore.getState();
    expect(timerEntries.every((e) => e.status === "completed")).toBe(true);
  });

  it("accumulates elapsedMs for active timers", () => {
    useAppStore.setState({
      timerEntries: [{ id: "1", name: "A", startedAt: FIXED_NOW - 4000, elapsedMs: 1000, status: "active" }],
    });
    useAppStore.getState().stopAllTimerEntries();

    const entry = useAppStore.getState().timerEntries.find((e) => e.id === "1");
    expect(entry?.elapsedMs).toBe(5000); // 1000 prior + 4000 since start
    expect(entry?.completedAt).toBe(FIXED_NOW);
  });

  it("does not affect already-completed entries", () => {
    useAppStore.setState({
      timerEntries: [{ id: "1", name: "A", startedAt: FIXED_NOW - 5000, elapsedMs: 2000, status: "completed", completedAt: FIXED_NOW - 3000 }],
    });
    useAppStore.getState().stopAllTimerEntries();

    const entry = useAppStore.getState().timerEntries.find((e) => e.id === "1");
    expect(entry?.elapsedMs).toBe(2000);
    expect(entry?.completedAt).toBe(FIXED_NOW - 3000);
  });

  it("persists to IndexedDB", () => {
    useAppStore.setState({
      timerEntries: [{ id: "1", name: "A", startedAt: FIXED_NOW - 1000, elapsedMs: 0, status: "active" }],
    });
    useAppStore.getState().stopAllTimerEntries();
    expect(mockDailyHistorySet).toHaveBeenCalledOnce();
  });
});

// ---------------------------------------------------------------------------
// updateTimerEntry
// ---------------------------------------------------------------------------

describe("updateTimerEntry", () => {
  it("applies partial updates to the specified entry", () => {
    useAppStore.setState({
      timerEntries: [{ id: "1", name: "Old name", startedAt: FIXED_NOW, elapsedMs: 0, status: "active" }],
    });
    useAppStore.getState().updateTimerEntry("1", { name: "New name", elapsedMs: 500 });

    const entry = useAppStore.getState().timerEntries.find((e) => e.id === "1");
    expect(entry?.name).toBe("New name");
    expect(entry?.elapsedMs).toBe(500);
    expect(entry?.status).toBe("active"); // unchanged
  });

  it("does not affect other entries", () => {
    useAppStore.setState({
      timerEntries: [
        { id: "1", name: "One", startedAt: FIXED_NOW, elapsedMs: 0, status: "active" },
        { id: "2", name: "Two", startedAt: FIXED_NOW, elapsedMs: 0, status: "active" },
      ],
    });
    useAppStore.getState().updateTimerEntry("1", { name: "Updated" });

    expect(useAppStore.getState().timerEntries.find((e) => e.id === "2")?.name).toBe("Two");
  });

  it("persists to IndexedDB", () => {
    useAppStore.setState({
      timerEntries: [{ id: "1", name: "Test", startedAt: FIXED_NOW, elapsedMs: 0, status: "active" }],
    });
    useAppStore.getState().updateTimerEntry("1", { name: "Updated" });
    expect(mockDailyHistorySet).toHaveBeenCalledOnce();
  });
});

// ---------------------------------------------------------------------------
// removeTimerEntry
// ---------------------------------------------------------------------------

describe("removeTimerEntry", () => {
  it("removes the entry from timerEntries", () => {
    useAppStore.setState({
      timerEntries: [
        { id: "1", name: "Keep", startedAt: FIXED_NOW, elapsedMs: 0, status: "active" },
        { id: "2", name: "Remove", startedAt: FIXED_NOW, elapsedMs: 0, status: "active" },
      ],
    });
    useAppStore.getState().removeTimerEntry("2");

    const ids = useAppStore.getState().timerEntries.map((e) => e.id);
    expect(ids).toContain("1");
    expect(ids).not.toContain("2");
  });

  it("persists to IndexedDB", () => {
    useAppStore.setState({
      timerEntries: [{ id: "1", name: "Test", startedAt: FIXED_NOW, elapsedMs: 0, status: "active" }],
    });
    useAppStore.getState().removeTimerEntry("1");
    expect(mockDailyHistorySet).toHaveBeenCalledOnce();
  });
});

// ---------------------------------------------------------------------------
// navigateToDate
// ---------------------------------------------------------------------------

describe("navigateToDate", () => {
  it("sets currentDate to the requested date", async () => {
    await useAppStore.getState().navigateToDate("2026-03-01");
    expect(useAppStore.getState().currentDate).toBe("2026-03-01");
  });

  it("loads entries from IndexedDB for the given date", async () => {
    const entry = { id: "1", name: "Test", startedAt: FIXED_NOW, elapsedMs: 500, status: "completed" as const, completedAt: FIXED_NOW + 500 };
    mockDailyHistoryGet.mockResolvedValueOnce({ date: "2026-03-01", entries: [entry] });

    await useAppStore.getState().navigateToDate("2026-03-01");
    expect(useAppStore.getState().timerEntries).toContainEqual(entry);
  });

  it("sets timerEntries to empty when no history exists for the date", async () => {
    useAppStore.setState({ timerEntries: [{ id: "old", name: "Old", startedAt: FIXED_NOW, elapsedMs: 0, status: "active" }] });
    mockDailyHistoryGet.mockResolvedValueOnce(null);

    await useAppStore.getState().navigateToDate("2026-03-01");
    expect(useAppStore.getState().timerEntries).toHaveLength(0);
  });

  it("migrates legacy paused entries to completed", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pausedEntry = { id: "1", name: "Test", startedAt: FIXED_NOW - 5000, elapsedMs: 3000, status: "paused", pausedAt: FIXED_NOW - 2000 } as any;
    mockDailyHistoryGet.mockResolvedValueOnce({ date: "2026-03-01", entries: [pausedEntry] });

    await useAppStore.getState().navigateToDate("2026-03-01");

    const entry = useAppStore.getState().timerEntries.find((e) => e.id === "1");
    expect(entry?.status).toBe("completed");
  });

  it("uses pausedAt as completedAt when migrating a paused entry", async () => {
    const pausedAt = FIXED_NOW - 2000;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pausedEntry = { id: "1", name: "Test", startedAt: FIXED_NOW - 5000, elapsedMs: 3000, status: "paused", pausedAt } as any;
    mockDailyHistoryGet.mockResolvedValueOnce({ date: "2026-03-01", entries: [pausedEntry] });

    await useAppStore.getState().navigateToDate("2026-03-01");

    const entry = useAppStore.getState().timerEntries.find((e) => e.id === "1");
    expect(entry?.completedAt).toBe(pausedAt);
  });

  it("falls back to startedAt as completedAt when pausedAt is missing on a legacy entry", async () => {
    const startedAt = FIXED_NOW - 5000;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pausedEntry = { id: "1", name: "Test", startedAt, elapsedMs: 3000, status: "paused" } as any;
    mockDailyHistoryGet.mockResolvedValueOnce({ date: "2026-03-01", entries: [pausedEntry] });

    await useAppStore.getState().navigateToDate("2026-03-01");

    const entry = useAppStore.getState().timerEntries.find((e) => e.id === "1");
    expect(entry?.completedAt).toBe(startedAt);
  });
});
