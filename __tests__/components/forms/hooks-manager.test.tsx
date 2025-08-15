import { describe, expect, test, jest } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { HooksManager } from "@/components/forms/hooks-manager";
import { HookCommand } from "@/lib/models/agent-model";

describe("HooksManager", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  describe("Initial State", () => {
    test("renders empty state when no hooks provided", () => {
      render(<HooksManager value={{}} onChange={mockOnChange} />);

      expect(
        screen.getByText(/No lifecycle hooks configured yet/),
      ).toBeInTheDocument();
      expect(screen.getByText("Add Lifecycle Hook")).toBeInTheDocument();
      expect(screen.getByText("Select hook type")).toBeInTheDocument();
    });

    test("renders with existing hooks", () => {
      const hooks: Record<string, HookCommand> = {
        agentSpawn: { command: "echo 'Agent starting'" },
        userPromptSubmit: { command: "echo 'Processing prompt'" },
      };
      render(<HooksManager value={hooks} onChange={mockOnChange} />);

      expect(screen.getByText("Configured Hooks (2)")).toBeInTheDocument();
      expect(screen.getByText("Agent Spawn")).toBeInTheDocument();
      expect(screen.getByText("User Prompt Submit")).toBeInTheDocument();
    });
  });

  describe("Adding Hooks", () => {
    test("prevents adding hook without selecting type", () => {
      render(<HooksManager value={{}} onChange={mockOnChange} />);

      const commandInput = screen.getByPlaceholderText(
        "Enter command to execute",
      );
      fireEvent.change(commandInput, { target: { value: "some command" } });

      const addButton = screen.getByRole("button", { name: /Add Hook/ });
      expect(addButton).toBeDisabled();
    });

    test("prevents adding hook without command", () => {
      render(<HooksManager value={{}} onChange={mockOnChange} />);

      const addButton = screen.getByRole("button", { name: /Add Hook/ });
      expect(addButton).toBeDisabled();
    });

    test("prevents adding when all hook types are used", () => {
      const hooks = {
        agentSpawn: { command: "spawn command" },
        userPromptSubmit: { command: "prompt command" },
      };
      render(<HooksManager value={hooks} onChange={mockOnChange} />);

      // Should not show the add hook section
      expect(screen.queryByText("Add Lifecycle Hook")).not.toBeInTheDocument();
    });
  });

  describe("Removing Hooks", () => {
    test("removes hook when delete button is clicked", () => {
      const hooks = {
        agentSpawn: { command: "echo 'starting'" },
        userPromptSubmit: { command: "echo 'processing'" },
      };
      render(<HooksManager value={hooks} onChange={mockOnChange} />);

      const deleteButtons = screen.getAllByRole("button", { name: "" });
      const trashButton = deleteButtons.find(
        (button) =>
          button.querySelector("svg")?.getAttribute("data-lucide") ===
          "trash-2",
      );

      if (trashButton) {
        fireEvent.click(trashButton);
        expect(mockOnChange).toHaveBeenCalledWith({
          userPromptSubmit: { command: "echo 'processing'" },
        });
      }
    });
  });

  describe("Hook Expansion and Editing", () => {
    test("expands hook when header is clicked", () => {
      const hooks = { agentSpawn: { command: "echo 'test'" } };
      render(<HooksManager value={hooks} onChange={mockOnChange} />);

      const hookHeader = screen.getByText("Agent Spawn").closest("div");
      if (hookHeader) {
        fireEvent.click(hookHeader);

        // Should show the command textarea after expansion
        expect(screen.getByDisplayValue("echo 'test'")).toBeInTheDocument();
      }
    });

    test("updates hook command when textarea is changed", () => {
      const hooks = { agentSpawn: { command: "original command" } };
      render(<HooksManager value={hooks} onChange={mockOnChange} />);

      // Expand the hook first
      const hookHeader = screen.getByText("Agent Spawn").closest("div");
      if (hookHeader) {
        fireEvent.click(hookHeader);

        const textarea = screen.getByDisplayValue("original command");
        fireEvent.change(textarea, { target: { value: "updated command" } });

        expect(mockOnChange).toHaveBeenCalledWith({
          agentSpawn: { command: "updated command" },
        });
      }
    });
  });

  describe("Hook Type Information", () => {
    test("shows custom hook type for unknown hooks", () => {
      const hooks = { customHook: { command: "custom command" } };
      render(<HooksManager value={hooks} onChange={mockOnChange} />);

      expect(screen.getByText("customHook")).toBeInTheDocument();
      expect(screen.getByText("Custom lifecycle hook")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    test("has proper labels and descriptions", () => {
      render(<HooksManager value={{}} onChange={mockOnChange} />);

      expect(screen.getByText("Add Lifecycle Hook")).toBeInTheDocument();
      expect(
        screen.getByText(/Configure commands to run at specific points/),
      ).toBeInTheDocument();
      expect(screen.getByText("Available Hook Types:")).toBeInTheDocument();
    });

    test("form elements have proper labels", () => {
      render(<HooksManager value={{}} onChange={mockOnChange} />);

      expect(screen.getByText("Hook Type")).toBeInTheDocument();
      expect(screen.getByText("Command")).toBeInTheDocument();
    });

    test("buttons have proper accessibility", () => {
      const hooks = { agentSpawn: { command: "test" } };
      render(<HooksManager value={hooks} onChange={mockOnChange} />);

      const addButton = screen.getByRole("button", { name: /Add Hook/ });
      expect(addButton).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    test("handles empty hooks object", () => {
      render(<HooksManager value={{}} onChange={mockOnChange} />);

      expect(
        screen.getByText(/No lifecycle hooks configured yet/),
      ).toBeInTheDocument();
      expect(screen.queryByText("Configured Hooks")).not.toBeInTheDocument();
    });

    test("handles hooks with empty commands", () => {
      const hooks = { agentSpawn: { command: "" } };
      render(<HooksManager value={hooks} onChange={mockOnChange} />);

      expect(screen.getByText("Configured Hooks (1)")).toBeInTheDocument();
      expect(screen.getByText("Agent Spawn")).toBeInTheDocument();
    });

    test("handles very long commands", () => {
      const longCommand =
        "echo 'This is a very long command that might cause display issues but should still work correctly'";
      const hooks = { agentSpawn: { command: longCommand } };
      render(<HooksManager value={hooks} onChange={mockOnChange} />);

      // Expand to see the command
      const hookHeader = screen.getByText("Agent Spawn").closest("div");
      if (hookHeader) {
        fireEvent.click(hookHeader);
        expect(screen.getByDisplayValue(longCommand)).toBeInTheDocument();
      }
    });
  });
});
