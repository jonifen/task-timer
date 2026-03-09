import { describe, it, expect } from "vitest";

import { formatDuration, formatDurationHuman, formatTime } from "./format-duration";

describe("formatTime", () => {
  it("formats midnight as 00:00", () => {
    const date = new Date(2026, 0, 1, 0, 0, 0);
    expect(formatTime(date.getTime())).toBe("00:00");
  });

  it("formats noon as 12:00", () => {
    const date = new Date(2026, 0, 1, 12, 0, 0);
    expect(formatTime(date.getTime())).toBe("12:00");
  });

  it("pads single-digit hours and minutes", () => {
    const date = new Date(2026, 0, 1, 9, 5, 0);
    expect(formatTime(date.getTime())).toBe("09:05");
  });

  it("formats 23:59 correctly", () => {
    const date = new Date(2026, 0, 1, 23, 59, 0);
    expect(formatTime(date.getTime())).toBe("23:59");
  });
});

describe("formatDurationHuman", () => {
  it('returns "< 1m" for 0 ms', () => {
    expect(formatDurationHuman(0)).toBe("< 1m");
  });

  it('returns "< 1m" for durations under one minute', () => {
    expect(formatDurationHuman(59_999)).toBe("< 1m");
  });

  it('returns "1m" for exactly one minute', () => {
    expect(formatDurationHuman(60_000)).toBe("1m");
  });

  it("returns minutes only when under an hour", () => {
    expect(formatDurationHuman(45 * 60_000)).toBe("45m");
  });

  it('returns "59m" for 59 minutes', () => {
    expect(formatDurationHuman(59 * 60_000)).toBe("59m");
  });

  it('returns "1h" for exactly one hour', () => {
    expect(formatDurationHuman(3_600_000)).toBe("1h");
  });

  it("omits minutes when they are zero", () => {
    expect(formatDurationHuman(2 * 3_600_000)).toBe("2h");
  });

  it('returns "1h 1m" for 61 minutes', () => {
    expect(formatDurationHuman(61 * 60_000)).toBe("1h 1m");
  });

  it('returns "1h 30m" for 90 minutes', () => {
    expect(formatDurationHuman(90 * 60_000)).toBe("1h 30m");
  });

  it('returns "2h 30m" for 150 minutes', () => {
    expect(formatDurationHuman(150 * 60_000)).toBe("2h 30m");
  });
});

describe("formatDuration", () => {
  it('returns "00:00" for 0 ms', () => {
    expect(formatDuration(0)).toBe("00:00");
  });

  it('returns "00:01" for 1 second', () => {
    expect(formatDuration(1_000)).toBe("00:01");
  });

  it('returns "01:00" for 1 minute', () => {
    expect(formatDuration(60_000)).toBe("01:00");
  });

  it('returns "59:59" for 59 minutes and 59 seconds', () => {
    expect(formatDuration(59 * 60_000 + 59_000)).toBe("59:59");
  });

  it('switches to H:MM:SS at exactly one hour', () => {
    expect(formatDuration(3_600_000)).toBe("1:00:00");
  });

  it("pads minutes and seconds in H:MM:SS format", () => {
    expect(formatDuration(3_600_000 + 60_000 + 5_000)).toBe("1:01:05");
  });

  it("handles large durations correctly", () => {
    expect(formatDuration(10 * 3_600_000 + 30 * 60_000 + 45_000)).toBe("10:30:45");
  });

  it("truncates partial seconds rather than rounding", () => {
    expect(formatDuration(1_999)).toBe("00:01");
  });
});
