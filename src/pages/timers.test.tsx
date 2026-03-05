import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { useAppStore } from "../store";

import { TimersPage } from "./timers";

vi.mock("../store");

const mockUseAppStore = vi.mocked(useAppStore);

const MOCK_UUID = "00000000-0000-0000-0000-000000000001";

function makeStore(overrides: Record<string, unknown> = {}) {
  return {
    timerConfigs: [],
    timerEntries: [],
    addTimerConfig: vi.fn(),
    updateTimerConfig: vi.fn(),
    removeTimerConfig: vi.fn(),
    addTimerEntry: vi.fn(),
    updateTimerEntry: vi.fn(),
    ...overrides,
  };
}

function setup(storeOverrides: Record<string, unknown> = {}) {
  const store = makeStore(storeOverrides);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mockUseAppStore.mockImplementation((selector: any) => selector(store));
  const user = userEvent.setup();
  render(<TimersPage />);
  return { store, user };
}

beforeEach(() => {
  vi.spyOn(crypto, "randomUUID").mockReturnValue(MOCK_UUID as ReturnType<typeof crypto.randomUUID>);
});

describe("TimersPage", () => {
  describe("rendering", () => {
    it("renders the Timers heading", () => {
      setup();
      expect(screen.getByRole("heading", { name: "Timers" })).toBeInTheDocument();
    });

    it("renders the New timer button", () => {
      setup();
      expect(screen.getByRole("button", { name: "+ New timer" })).toBeInTheDocument();
    });

    it("shows an empty state message when there are no configs", () => {
      setup();
      expect(screen.getByText("No timers yet. Create one to get started.")).toBeInTheDocument();
    });

    it("renders a card for each timer config", () => {
      setup({
        timerConfigs: [
          { id: "1", name: "Deep work" },
          { id: "2", name: "Emails" },
        ],
      });
      expect(screen.getByText("Deep work")).toBeInTheDocument();
      expect(screen.getByText("Emails")).toBeInTheDocument();
    });

    it("does not show the empty state when configs exist", () => {
      setup({ timerConfigs: [{ id: "1", name: "Deep work" }] });
      expect(screen.queryByText("No timers yet. Create one to get started.")).not.toBeInTheDocument();
    });
  });

  describe("adding a timer", () => {
    it("clicking New timer shows the add form", async () => {
      const { user } = setup();
      await user.click(screen.getByRole("button", { name: "+ New timer" }));
      expect(screen.getByRole("button", { name: "Add timer" })).toBeInTheDocument();
    });

    it("hides the New timer button while the add form is open", async () => {
      const { user } = setup();
      await user.click(screen.getByRole("button", { name: "+ New timer" }));
      expect(screen.queryByRole("button", { name: "+ New timer" })).not.toBeInTheDocument();
    });

    it("hides the empty state while the add form is open", async () => {
      const { user } = setup();
      await user.click(screen.getByRole("button", { name: "+ New timer" }));
      expect(screen.queryByText("No timers yet. Create one to get started.")).not.toBeInTheDocument();
    });

    it("submit is disabled when the name field is empty", async () => {
      const { user } = setup();
      await user.click(screen.getByRole("button", { name: "+ New timer" }));
      expect(screen.getByRole("button", { name: "Add timer" })).toBeDisabled();
    });

    it("submit is enabled once a name is typed", async () => {
      const { user } = setup();
      await user.click(screen.getByRole("button", { name: "+ New timer" }));
      await user.type(screen.getByRole("textbox", { name: "Name" }), "Deep work");
      expect(screen.getByRole("button", { name: "Add timer" })).toBeEnabled();
    });

    it("submitting calls addTimerConfig with the trimmed name, generated id, and no color", async () => {
      const { user, store } = setup();
      await user.click(screen.getByRole("button", { name: "+ New timer" }));
      await user.type(screen.getByRole("textbox", { name: "Name" }), "  Deep work  ");
      await user.click(screen.getByRole("button", { name: "Add timer" }));
      expect(store.addTimerConfig).toHaveBeenCalledWith({
        id: MOCK_UUID,
        name: "Deep work",
        color: undefined,
      });
    });

    it("submitting with a selected color passes the color to addTimerConfig", async () => {
      const { user, store } = setup();
      await user.click(screen.getByRole("button", { name: "+ New timer" }));
      await user.type(screen.getByRole("textbox", { name: "Name" }), "Deep work");
      await user.click(screen.getByRole("radio", { name: "Blue" }));
      await user.click(screen.getByRole("button", { name: "Add timer" }));
      expect(store.addTimerConfig).toHaveBeenCalledWith({
        id: MOCK_UUID,
        name: "Deep work",
        color: "#3b82f6",
      });
    });

    it("cancelling the add form hides it and restores the New timer button", async () => {
      const { user } = setup();
      await user.click(screen.getByRole("button", { name: "+ New timer" }));
      await user.click(screen.getByRole("button", { name: "Cancel" }));
      expect(screen.queryByRole("button", { name: "Add timer" })).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: "+ New timer" })).toBeInTheDocument();
    });

    it("after submitting the form is hidden and the New timer button returns", async () => {
      const { user } = setup();
      await user.click(screen.getByRole("button", { name: "+ New timer" }));
      await user.type(screen.getByRole("textbox", { name: "Name" }), "Deep work");
      await user.click(screen.getByRole("button", { name: "Add timer" }));
      expect(screen.queryByRole("button", { name: "Add timer" })).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: "+ New timer" })).toBeInTheDocument();
    });
  });

  describe("editing a timer", () => {
    const config = { id: "abc-123", name: "Deep work", color: "#3b82f6" };

    it("clicking edit replaces the card with a form", async () => {
      const { user } = setup({ timerConfigs: [config] });
      await user.click(screen.getByRole("button", { name: "Edit Deep work" }));
      expect(screen.queryByRole("button", { name: "Edit Deep work" })).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    });

    it("the edit form is pre-populated with the config name", async () => {
      const { user } = setup({ timerConfigs: [config] });
      await user.click(screen.getByRole("button", { name: "Edit Deep work" }));
      expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue("Deep work");
    });

    it("the edit form has the config color swatch checked", async () => {
      const { user } = setup({ timerConfigs: [config] });
      await user.click(screen.getByRole("button", { name: "Edit Deep work" }));
      expect(screen.getByRole("radio", { name: "Blue" })).toHaveAttribute("aria-checked", "true");
      expect(screen.getByRole("radio", { name: "No colour" })).toHaveAttribute("aria-checked", "false");
    });

    it("saving calls updateTimerConfig with the config id and new values", async () => {
      const { user, store } = setup({ timerConfigs: [config] });
      await user.click(screen.getByRole("button", { name: "Edit Deep work" }));
      await user.clear(screen.getByRole("textbox", { name: "Name" }));
      await user.type(screen.getByRole("textbox", { name: "Name" }), "Admin");
      await user.click(screen.getByRole("radio", { name: "Red" }));
      await user.click(screen.getByRole("button", { name: "Save" }));
      expect(store.updateTimerConfig).toHaveBeenCalledWith({
        id: "abc-123",
        name: "Admin",
        color: "#ef4444",
      });
    });

    it("after saving the form is replaced by the card", async () => {
      const { user } = setup({ timerConfigs: [config] });
      await user.click(screen.getByRole("button", { name: "Edit Deep work" }));
      await user.click(screen.getByRole("button", { name: "Save" }));
      expect(screen.queryByRole("button", { name: "Save" })).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Edit Deep work" })).toBeInTheDocument();
    });

    it("cancelling edit restores the card", async () => {
      const { user } = setup({ timerConfigs: [config] });
      await user.click(screen.getByRole("button", { name: "Edit Deep work" }));
      await user.click(screen.getByRole("button", { name: "Cancel" }));
      expect(screen.queryByRole("button", { name: "Save" })).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Edit Deep work" })).toBeInTheDocument();
    });

    it("opening an edit form while the add form is open closes the add form", async () => {
      const { user } = setup({ timerConfigs: [config] });
      await user.click(screen.getByRole("button", { name: "+ New timer" }));
      expect(screen.getByRole("button", { name: "Add timer" })).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Edit Deep work" }));
      expect(screen.queryByRole("button", { name: "Add timer" })).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    });

    it("editing a second config closes the first edit form", async () => {
      const { user } = setup({
        timerConfigs: [
          { id: "1", name: "Deep work" },
          { id: "2", name: "Emails" },
        ],
      });
      await user.click(screen.getByRole("button", { name: "Edit Deep work" }));
      await user.click(screen.getByRole("button", { name: "Edit Emails" }));
      // Deep work card should be restored; Emails form should be open
      expect(screen.getByRole("button", { name: "Edit Deep work" })).toBeInTheDocument();
      expect(screen.getAllByRole("button", { name: "Save" })).toHaveLength(1);
    });
  });

  describe("deleting a timer", () => {
    it("clicking delete calls removeTimerConfig with the config id", async () => {
      const { user, store } = setup({ timerConfigs: [{ id: "abc-123", name: "Deep work" }] });
      await user.click(screen.getByRole("button", { name: "Delete Deep work" }));
      expect(store.removeTimerConfig).toHaveBeenCalledWith("abc-123");
    });

    it("deleting one config does not close the edit form for a different config", async () => {
      const { user } = setup({
        timerConfigs: [
          { id: "1", name: "Deep work" },
          { id: "2", name: "Emails" },
        ],
      });
      await user.click(screen.getByRole("button", { name: "Edit Deep work" }));
      await user.click(screen.getByRole("button", { name: "Delete Emails" }));
      expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    });
  });
});
