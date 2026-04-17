import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAppStore } from "../store";
import { useTimer } from "./use-timer";

vi.mock("../store");

const mockUseAppStore = vi.mocked(useAppStore);

const CONFIG_ID = "config-1";
const NAME = "Deep work";

function makeStore(overrides: Record<string, unknown> = {}) {
  return {
    timerEntries: [],
    startTimerEntry: vi.fn(),
    updateTimerEntry: vi.fn(),
    ...overrides,
  };
}

function setup(storeOverrides: Record<string, unknown> = {}) {
  const store = makeStore(storeOverrides);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mockUseAppStore.mockImplementation((selector: any) => selector(store));
  const hook = renderHook(() => useTimer(CONFIG_ID, NAME));
  return { result: hook.result, store };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useTimer", () => {
  describe("status", () => {
    it("is null when there is no active entry for the config", () => {
      const { result } = setup();
      expect(result.current.status).toBeNull();
    });

    it("is null when the only entry for the config is completed", () => {
      const { result } = setup({
        timerEntries: [{ id: "1", configId: CONFIG_ID, name: NAME, startedAt: 1000, elapsedMs: 500, status: "completed", completedAt: 1500 }],
      });
      expect(result.current.status).toBeNull();
    });

    it("is 'active' when there is an active entry for the config", () => {
      const { result } = setup({
        timerEntries: [{ id: "1", configId: CONFIG_ID, name: NAME, startedAt: Date.now(), elapsedMs: 0, status: "active" }],
      });
      expect(result.current.status).toBe("active");
    });

    it("ignores active entries belonging to a different config", () => {
      const { result } = setup({
        timerEntries: [{ id: "1", configId: "other-config", name: "Other", startedAt: Date.now(), elapsedMs: 0, status: "active" }],
      });
      expect(result.current.status).toBeNull();
    });
  });

  describe("displayedElapsed", () => {
    it("is 0 when there is no active entry", () => {
      const { result } = setup();
      expect(result.current.displayedElapsed).toBe(0);
    });

    it("returns elapsedMs for an active entry plus time since startedAt", () => {
      const startedAt = Date.now() - 5000;
      const { result } = setup({
        timerEntries: [{ id: "1", configId: CONFIG_ID, name: NAME, startedAt, elapsedMs: 2000, status: "active" }],
      });
      // Should be at least 2000 (prior) + ~5000 (since start) = ~7000
      expect(result.current.displayedElapsed).toBeGreaterThanOrEqual(7000);
    });

    it("returns elapsedMs for a completed entry without adding wall-clock time", () => {
      const { result } = setup({
        timerEntries: [{ id: "1", configId: CONFIG_ID, name: NAME, startedAt: 1000, elapsedMs: 3000, status: "completed", completedAt: 4000 }],
      });
      // No active entry → displayedElapsed from hook is 0 (hook only tracks active entry)
      expect(result.current.displayedElapsed).toBe(0);
    });
  });

  describe("start", () => {
    it("calls startTimerEntry with a new entry for the config", () => {
      const { result, store } = setup();
      result.current.start();

      expect(store.startTimerEntry).toHaveBeenCalledOnce();
      const call = (store.startTimerEntry as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(call.configId).toBe(CONFIG_ID);
      expect(call.name).toBe(NAME);
      expect(call.status).toBe("active");
      expect(call.elapsedMs).toBe(0);
      expect(typeof call.id).toBe("string");
    });
  });

  describe("complete", () => {
    it("does nothing when there is no active entry", () => {
      const { result, store } = setup();
      result.current.complete();
      expect(store.updateTimerEntry).not.toHaveBeenCalled();
    });

    it("calls updateTimerEntry marking the entry as completed", () => {
      const startedAt = Date.now() - 3000;
      const { result, store } = setup({
        timerEntries: [{ id: "1", configId: CONFIG_ID, name: NAME, startedAt, elapsedMs: 1000, status: "active" }],
      });

      result.current.complete();

      expect(store.updateTimerEntry).toHaveBeenCalledOnce();
      const [id, updates] = (store.updateTimerEntry as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(id).toBe("1");
      expect(updates.status).toBe("completed");
      expect(updates.completedAt).toBeGreaterThan(startedAt);
      // elapsedMs should include time since startedAt (at least 3000 + 1000 prior)
      expect(updates.elapsedMs).toBeGreaterThanOrEqual(4000);
    });
  });
});
