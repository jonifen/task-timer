import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { TimerEntry } from "../../store";
import { EditEntryModal } from "./edit-entry-modal";

function makeEntry(overrides: Partial<TimerEntry> = {}): TimerEntry {
  return {
    id: "entry-1",
    name: "Deep work",
    startedAt: new Date("2026-04-17T09:00:00").getTime(),
    elapsedMs: 3600000, // 1 hour
    status: "completed",
    completedAt: new Date("2026-04-17T10:00:00").getTime(),
    ...overrides,
  };
}

function setup(overrides: Partial<TimerEntry> = {}) {
  const entry = makeEntry(overrides);
  const onSave = vi.fn();
  const onClose = vi.fn();
  const user = userEvent.setup();
  render(<EditEntryModal entry={entry} onSave={onSave} onClose={onClose} />);
  return { entry, onSave, onClose, user };
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

describe("EditEntryModal", () => {
  describe("rendering", () => {
    it("renders the dialog with heading", () => {
      setup();
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Edit entry")).toBeInTheDocument();
    });

    it("pre-fills the name field with the entry name", () => {
      setup();
      expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue("Deep work");
    });

    it("shows the 'Started at' field", () => {
      setup();
      expect(screen.getByLabelText("Started at")).toBeInTheDocument();
    });

    it("shows the 'Ended at' field for completed entries", () => {
      setup({ status: "completed" });
      expect(screen.getByLabelText("Ended at")).toBeInTheDocument();
    });

    it("hides the 'Ended at' field for active entries", () => {
      setup({ status: "active", completedAt: undefined });
      expect(screen.queryByLabelText("Ended at")).not.toBeInTheDocument();
    });

    it("shows the worked time H/M/S inputs", () => {
      setup();
      expect(screen.getByRole("spinbutton", { name: "Hours" })).toBeInTheDocument();
      expect(screen.getByRole("spinbutton", { name: "Minutes" })).toBeInTheDocument();
      expect(screen.getByRole("spinbutton", { name: "Seconds" })).toBeInTheDocument();
    });

    it("pre-fills the worked time from elapsedMs", () => {
      setup({ elapsedMs: 5400000 }); // 1h 30m 0s
      expect(screen.getByRole("spinbutton", { name: "Hours" })).toHaveValue(1);
      expect(screen.getByRole("spinbutton", { name: "Minutes" })).toHaveValue(30);
      expect(screen.getByRole("spinbutton", { name: "Seconds" })).toHaveValue(0);
    });

    it("shows the recalculate button for completed entries", () => {
      setup({ status: "completed" });
      expect(screen.getByRole("button", { name: /recalculate/i })).toBeInTheDocument();
    });

    it("hides the recalculate button for active entries", () => {
      setup({ status: "active", completedAt: undefined });
      expect(screen.queryByRole("button", { name: /recalculate/i })).not.toBeInTheDocument();
    });
  });

  // ---------------------------------------------------------------------------
  // Recalculate
  // ---------------------------------------------------------------------------

  describe("recalculate button", () => {
    it("fills worked time with the full start-to-end duration", () => {
      setup();

      // Set start to 09:00 and end to 10:30 — diff is 1h 30m
      fireEvent.change(screen.getByLabelText("Started at"), {
        target: { value: "2026-04-17T09:00:00" },
      });
      fireEvent.change(screen.getByLabelText("Ended at"), {
        target: { value: "2026-04-17T10:30:00" },
      });

      fireEvent.click(screen.getByRole("button", { name: /recalculate/i }));

      expect(screen.getByRole("spinbutton", { name: "Hours" })).toHaveValue(1);
      expect(screen.getByRole("spinbutton", { name: "Minutes" })).toHaveValue(30);
      expect(screen.getByRole("spinbutton", { name: "Seconds" })).toHaveValue(0);
    });

    it("does nothing if end is not after start", () => {
      setup({ elapsedMs: 60000 }); // 0h 1m 0s

      fireEvent.change(screen.getByLabelText("Started at"), {
        target: { value: "2026-04-17T10:00:00" },
      });
      fireEvent.change(screen.getByLabelText("Ended at"), {
        target: { value: "2026-04-17T09:00:00" }, // before start
      });

      fireEvent.click(screen.getByRole("button", { name: /recalculate/i }));

      // Worked time should be unchanged (still 0h 1m 0s)
      expect(screen.getByRole("spinbutton", { name: "Minutes" })).toHaveValue(1);
    });
  });

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  describe("validation", () => {
    it("shows an error when end time is before start time", async () => {
      const { user } = setup();

      fireEvent.change(screen.getByLabelText("Started at"), {
        target: { value: "2026-04-17T11:00:00" },
      });
      fireEvent.change(screen.getByLabelText("Ended at"), {
        target: { value: "2026-04-17T09:00:00" },
      });

      await user.click(screen.getByRole("button", { name: "Save" }));

      expect(screen.getByText("End time must be after start time.")).toBeInTheDocument();
    });

    it("shows an error when worked time exceeds the start-to-end window", async () => {
      const { user } = setup();

      fireEvent.change(screen.getByLabelText("Started at"), {
        target: { value: "2026-04-17T09:00:00" },
      });
      fireEvent.change(screen.getByLabelText("Ended at"), {
        target: { value: "2026-04-17T09:30:00" }, // 30 min window
      });

      // Set worked time to 2 hours — exceeds the 30 min window
      fireEvent.change(screen.getByRole("spinbutton", { name: "Hours" }), { target: { value: "2" } });

      await user.click(screen.getByRole("button", { name: "Save" }));

      expect(screen.getByText("Worked time cannot exceed the time between start and end.")).toBeInTheDocument();
    });

    it("does not call onSave when validation fails", async () => {
      const { user, onSave } = setup();

      fireEvent.change(screen.getByLabelText("Started at"), {
        target: { value: "2026-04-17T11:00:00" },
      });
      fireEvent.change(screen.getByLabelText("Ended at"), {
        target: { value: "2026-04-17T09:00:00" },
      });

      await user.click(screen.getByRole("button", { name: "Save" }));

      expect(onSave).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // Saving
  // ---------------------------------------------------------------------------

  describe("saving", () => {
    it("calls onSave with the updated entry when the form is valid", async () => {
      const { user, onSave, entry } = setup();

      await user.clear(screen.getByRole("textbox", { name: "Name" }));
      await user.type(screen.getByRole("textbox", { name: "Name" }), "Admin");

      await user.click(screen.getByRole("button", { name: "Save" }));

      expect(onSave).toHaveBeenCalledOnce();
      expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ id: entry.id, name: "Admin" }));
    });

    it("preserves the original name if the name field is cleared", async () => {
      const { user, onSave, entry } = setup();

      await user.clear(screen.getByRole("textbox", { name: "Name" }));
      await user.click(screen.getByRole("button", { name: "Save" }));

      expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ name: entry.name }));
    });

    it("passes updated elapsedMs from the worked time inputs", async () => {
      // Entry has a 1-hour window; set worked time to 45m 30s which fits within it
      const { user, onSave } = setup({ elapsedMs: 0 });

      fireEvent.change(screen.getByRole("spinbutton", { name: "Hours" }), { target: { value: "0" } });
      fireEvent.change(screen.getByRole("spinbutton", { name: "Minutes" }), { target: { value: "45" } });
      fireEvent.change(screen.getByRole("spinbutton", { name: "Seconds" }), { target: { value: "30" } });

      await user.click(screen.getByRole("button", { name: "Save" }));

      // 0h 45m 30s = (2700 + 30) * 1000 = 2730000 ms
      expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ elapsedMs: 2730000 }));
    });

    it("passes completedAt for a completed entry", async () => {
      const { user, onSave } = setup({ status: "completed" });

      await user.click(screen.getByRole("button", { name: "Save" }));

      expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ completedAt: expect.any(Number) }));
    });

    it("does not include completedAt for an active entry", async () => {
      const { user, onSave } = setup({ status: "active", completedAt: undefined });

      await user.click(screen.getByRole("button", { name: "Save" }));

      expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ completedAt: undefined }));
    });
  });

  // ---------------------------------------------------------------------------
  // Close behaviour
  // ---------------------------------------------------------------------------

  describe("closing", () => {
    it("calls onClose when the ✕ button is clicked", async () => {
      const { user, onClose } = setup();
      await user.click(screen.getByRole("button", { name: "Close" }));
      expect(onClose).toHaveBeenCalledOnce();
    });

    it("calls onClose when the Cancel button is clicked", async () => {
      const { user, onClose } = setup();
      await user.click(screen.getByRole("button", { name: "Cancel" }));
      expect(onClose).toHaveBeenCalledOnce();
    });

    it("calls onClose when the overlay backdrop is clicked", async () => {
      const { onClose } = setup();
      // The overlay is the outermost div; fireEvent.mouseDown simulates the click
      const overlay = screen.getByRole("dialog").parentElement!;
      fireEvent.mouseDown(overlay);
      expect(onClose).toHaveBeenCalledOnce();
    });

    it("does not call onClose when clicking inside the modal", async () => {
      const { onClose } = setup();
      fireEvent.mouseDown(screen.getByRole("dialog"));
      expect(onClose).not.toHaveBeenCalled();
    });
  });
});
