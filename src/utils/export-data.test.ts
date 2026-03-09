import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { exportData } from "./export-data";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock("../db", () => ({
  db: {
    timerConfigs: {
      getAll: vi.fn(),
    },
    dailyHistory: {
      getAll: vi.fn(),
    },
  },
}));

import { db } from "../db";

const mockGetAllConfigs = vi.mocked(db.timerConfigs.getAll);
const mockGetAllHistory = vi.mocked(db.dailyHistory.getAll);

// ---------------------------------------------------------------------------
// DOM API stubs
// ---------------------------------------------------------------------------

function setupDownloadMocks() {
  const clickSpy = vi.fn();
  const revokeSpy = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
  const createSpy = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:fake-url");

  const anchorStub = { href: "", download: "", click: clickSpy } as unknown as HTMLAnchorElement;
  vi.spyOn(document, "createElement").mockReturnValue(anchorStub);

  return { clickSpy, revokeSpy, createSpy, anchorStub };
}

beforeEach(() => {
  mockGetAllConfigs.mockResolvedValue([]);
  mockGetAllHistory.mockResolvedValue([]);
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("exportData", () => {
  it("fetches all timer configs and daily history in parallel", async () => {
    setupDownloadMocks();
    await exportData();
    expect(mockGetAllConfigs).toHaveBeenCalledOnce();
    expect(mockGetAllHistory).toHaveBeenCalledOnce();
  });

  it("creates a JSON blob with the correct payload shape", async () => {
    const configs = [{ id: "c1", name: "Work" }];
    const history = [{ date: "2026-03-01", entries: [] }];
    mockGetAllConfigs.mockResolvedValue(configs);
    mockGetAllHistory.mockResolvedValue(history);

    const blobSpy = vi.spyOn(globalThis, "Blob");
    setupDownloadMocks();

    await exportData();

    expect(blobSpy).toHaveBeenCalledOnce();
    const [parts, options] = blobSpy.mock.calls[0];
    expect(options).toEqual({ type: "application/json" });

    const parsed = JSON.parse((parts as string[])[0]);
    expect(parsed.timerConfigs).toEqual(configs);
    expect(parsed.dailyHistory).toEqual(history);
    expect(typeof parsed.exportedAt).toBe("string");
    expect(() => new Date(parsed.exportedAt)).not.toThrow();
  });

  it("triggers a download by clicking a created anchor element", async () => {
    const { clickSpy, anchorStub } = setupDownloadMocks();
    await exportData();
    expect(anchorStub.href).toBe("blob:fake-url");
    expect(clickSpy).toHaveBeenCalledOnce();
  });

  it("sets a filename matching task-timer-export-YYYY-MM-DD.json", async () => {
    const { anchorStub } = setupDownloadMocks();
    await exportData();
    expect(anchorStub.download).toMatch(/^task-timer-export-\d{4}-\d{2}-\d{2}\.json$/);
  });

  it("revokes the object URL after triggering the download", async () => {
    const { revokeSpy } = setupDownloadMocks();
    await exportData();
    expect(revokeSpy).toHaveBeenCalledWith("blob:fake-url");
  });

  it("includes an exportedAt ISO timestamp", async () => {
    const before = Date.now();
    const blobSpy = vi.spyOn(globalThis, "Blob");
    setupDownloadMocks();

    await exportData();

    const after = Date.now();
    const [parts] = blobSpy.mock.calls[0];
    const parsed = JSON.parse((parts as string[])[0]);
    const exportedAt = new Date(parsed.exportedAt).getTime();
    expect(exportedAt).toBeGreaterThanOrEqual(before);
    expect(exportedAt).toBeLessThanOrEqual(after);
  });
});
