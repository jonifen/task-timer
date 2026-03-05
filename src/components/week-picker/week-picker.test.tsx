import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import * as styles from "./week-picker.css";
import { WeekPicker } from "./week-picker";

function renderPicker(selectedDate: string) {
  render(
    <MemoryRouter>
      <WeekPicker selectedDate={selectedDate} />
    </MemoryRouter>
  );
}

function getDayLinks() {
  // All day links sit between the prev/next nav links
  return screen
    .getAllByRole("link")
    .filter((el) => !el.getAttribute("aria-label"));
}

describe("WeekPicker", () => {
  describe("week display", () => {
    it("renders 7 day links", () => {
      renderPicker("2026-03-05"); // a Thursday
      expect(getDayLinks()).toHaveLength(7);
    });

    it("shows Mon–Sun labels in order", () => {
      renderPicker("2026-03-05");
      const labels = getDayLinks().map((el) => el.querySelector("span:first-child")?.textContent);
      expect(labels).toEqual(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
    });

    it("shows the correct date numbers for the week", () => {
      // 2026-03-05 is a Thursday; the week is Mon 2 Mar – Sun 8 Mar
      renderPicker("2026-03-05");
      const numbers = getDayLinks().map((el) => el.querySelector("span:last-child")?.textContent);
      expect(numbers).toEqual(["2", "3", "4", "5", "6", "7", "8"]);
    });

    it("week starts on Monday when a Sunday is selected", () => {
      // 2026-03-08 is a Sunday; its ISO week starts Mon 2026-03-02
      renderPicker("2026-03-08");
      const numbers = getDayLinks().map((el) => el.querySelector("span:last-child")?.textContent);
      expect(numbers[0]).toBe("2"); // Monday the 2nd
      expect(numbers[6]).toBe("8"); // Sunday the 8th
    });

    it("week starts on Monday when Monday itself is selected", () => {
      // 2026-03-02 is a Monday
      renderPicker("2026-03-02");
      const numbers = getDayLinks().map((el) => el.querySelector("span:last-child")?.textContent);
      expect(numbers[0]).toBe("2");
      expect(numbers[6]).toBe("8");
    });

    it("each day link points to the correct history path", () => {
      renderPicker("2026-03-05");
      const hrefs = getDayLinks().map((el) => el.getAttribute("href"));
      expect(hrefs).toEqual([
        "/history/2026/03/02",
        "/history/2026/03/03",
        "/history/2026/03/04",
        "/history/2026/03/05",
        "/history/2026/03/06",
        "/history/2026/03/07",
        "/history/2026/03/08",
      ]);
    });
  });

  describe("active day", () => {
    it("marks only the selected date as aria-current='date'", () => {
      renderPicker("2026-03-05");
      const active = getDayLinks().filter((el) => el.getAttribute("aria-current") === "date");
      expect(active).toHaveLength(1);
      expect(active[0].getAttribute("href")).toBe("/history/2026/03/05");
    });

    it("applies the active style class to the selected day", () => {
      renderPicker("2026-03-05");
      const activeLink = getDayLinks().find((el) => el.getAttribute("aria-current") === "date");
      expect(activeLink?.classList.contains(styles.dayLinkActive)).toBe(true);
    });

    it("does not apply the active class to other days", () => {
      renderPicker("2026-03-05");
      const inactiveLinks = getDayLinks().filter((el) => el.getAttribute("aria-current") !== "date");
      inactiveLinks.forEach((el) => {
        expect(el.classList.contains(styles.dayLinkActive)).toBe(false);
      });
    });
  });

  describe("today highlighting", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("applies the today class to today's date when it is not the selected date", () => {
      vi.setSystemTime(new Date("2026-03-04")); // Wednesday — not selected
      renderPicker("2026-03-05"); // Thursday selected
      const todayLink = getDayLinks().find((el) => el.getAttribute("href") === "/history/2026/03/04");
      expect(todayLink?.classList.contains(styles.dayLinkToday)).toBe(true);
    });

    it("does not apply the today class when today is also the selected date", () => {
      vi.setSystemTime(new Date("2026-03-05"));
      renderPicker("2026-03-05");
      const todayLink = getDayLinks().find((el) => el.getAttribute("aria-current") === "date");
      expect(todayLink?.classList.contains(styles.dayLinkToday)).toBe(false);
    });

    it("does not apply the today class to other days", () => {
      vi.setSystemTime(new Date("2026-03-04"));
      renderPicker("2026-03-05");
      const otherLinks = getDayLinks().filter((el) => el.getAttribute("href") !== "/history/2026/03/04");
      otherLinks.forEach((el) => {
        expect(el.classList.contains(styles.dayLinkToday)).toBe(false);
      });
    });
  });

  describe("week navigation", () => {
    it("previous week link points to the same weekday 7 days earlier", () => {
      renderPicker("2026-03-05");
      const prev = screen.getByRole("link", { name: "Previous week" });
      // Week starts Mon 2026-03-02; previous week's Monday is 2026-02-23
      expect(prev.getAttribute("href")).toBe("/history/2026/02/23");
    });

    it("next week link points to the same weekday 7 days later", () => {
      renderPicker("2026-03-05");
      const next = screen.getByRole("link", { name: "Next week" });
      // Week starts Mon 2026-03-02; next week's Monday is 2026-03-09
      expect(next.getAttribute("href")).toBe("/history/2026/03/09");
    });

    it("navigating back from a week containing a month boundary works correctly", () => {
      renderPicker("2026-03-02"); // week: Mon 2 Mar – Sun 8 Mar
      const prev = screen.getByRole("link", { name: "Previous week" });
      expect(prev.getAttribute("href")).toBe("/history/2026/02/23");
    });

    it("navigating forward across a year boundary works correctly", () => {
      renderPicker("2025-12-29"); // Mon 29 Dec 2025 – Sun 4 Jan 2026
      const next = screen.getByRole("link", { name: "Next week" });
      expect(next.getAttribute("href")).toBe("/history/2026/01/05");
    });
  });
});
