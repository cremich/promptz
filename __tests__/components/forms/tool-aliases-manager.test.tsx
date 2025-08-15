import { describe, expect, test, jest } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ToolAliasesManager } from "@/components/forms/tool-aliases-manager";

describe("ToolAliasesManager", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test("renders empty state when no aliases", () => {
    render(<ToolAliasesManager value={{}} onChange={mockOnChange} />);

    expect(screen.getByText("No tool aliases configured")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Add aliases to create shortcuts for commonly used tools",
      ),
    ).toBeInTheDocument();
  });

  test("displays existing aliases", () => {
    render(
      <ToolAliasesManager
        value={{ read: "fs_read", write: "fs_write" }}
        onChange={mockOnChange}
      />,
    );

    expect(screen.getByDisplayValue("read")).toBeInTheDocument();
    expect(screen.getByDisplayValue("fs_read")).toBeInTheDocument();
    expect(screen.getByDisplayValue("write")).toBeInTheDocument();
    expect(screen.getByDisplayValue("fs_write")).toBeInTheDocument();
  });

  test("adds new alias when add button is clicked", () => {
    render(<ToolAliasesManager value={{}} onChange={mockOnChange} />);

    const aliasInput = screen.getByPlaceholderText("Alias name (e.g., 'read')");
    const toolInput = screen.getByPlaceholderText(
      "Tool name (e.g., 'fs_read')",
    );
    const addButton = screen.getByRole("button");

    fireEvent.change(aliasInput, { target: { value: "read" } });
    fireEvent.change(toolInput, { target: { value: "fs_read" } });
    fireEvent.click(addButton);

    expect(mockOnChange).toHaveBeenCalledWith({ read: "fs_read" });
  });

  test("adds new alias when Enter is pressed", () => {
    render(<ToolAliasesManager value={{}} onChange={mockOnChange} />);

    const aliasInput = screen.getByPlaceholderText("Alias name (e.g., 'read')");
    const toolInput = screen.getByPlaceholderText(
      "Tool name (e.g., 'fs_read')",
    );

    fireEvent.change(aliasInput, { target: { value: "read" } });
    fireEvent.change(toolInput, { target: { value: "fs_read" } });
    fireEvent.keyDown(toolInput, { key: "Enter" });

    expect(mockOnChange).toHaveBeenCalledWith({ read: "fs_read" });
  });

  test("removes alias when delete button is clicked", () => {
    render(
      <ToolAliasesManager
        value={{ read: "fs_read", write: "fs_write" }}
        onChange={mockOnChange}
      />,
    );

    const deleteButtons = screen.getAllByRole("button");
    const deleteButton = deleteButtons.find((button) =>
      button.querySelector("svg"),
    );

    if (deleteButton) {
      fireEvent.click(deleteButton);
      expect(mockOnChange).toHaveBeenCalled();
    }
  });

  test("updates existing alias name", () => {
    render(
      <ToolAliasesManager
        value={{ read: "fs_read" }}
        onChange={mockOnChange}
      />,
    );

    const aliasInput = screen.getByDisplayValue("read");
    fireEvent.change(aliasInput, { target: { value: "readFile" } });
    fireEvent.blur(aliasInput);

    expect(mockOnChange).toHaveBeenCalledWith({ readFile: "fs_read" });
  });

  test("updates existing tool name", () => {
    render(
      <ToolAliasesManager
        value={{ read: "fs_read" }}
        onChange={mockOnChange}
      />,
    );

    const toolInput = screen.getByDisplayValue("fs_read");
    fireEvent.change(toolInput, { target: { value: "file_read" } });
    fireEvent.blur(toolInput);

    expect(mockOnChange).toHaveBeenCalledWith({ read: "file_read" });
  });

  test("disables add button when inputs are empty", () => {
    render(<ToolAliasesManager value={{}} onChange={mockOnChange} />);

    const addButton = screen.getByRole("button");
    expect(addButton).toBeDisabled();
  });

  test("clears inputs after successful add", () => {
    render(<ToolAliasesManager value={{}} onChange={mockOnChange} />);

    const aliasInput = screen.getByPlaceholderText("Alias name (e.g., 'read')");
    const toolInput = screen.getByPlaceholderText(
      "Tool name (e.g., 'fs_read')",
    );
    const addButton = screen.getByRole("button");

    fireEvent.change(aliasInput, { target: { value: "read" } });
    fireEvent.change(toolInput, { target: { value: "fs_read" } });
    fireEvent.click(addButton);

    expect(aliasInput).toHaveValue("");
    expect(toolInput).toHaveValue("");
  });

  test("trims whitespace from inputs", () => {
    render(<ToolAliasesManager value={{}} onChange={mockOnChange} />);

    const aliasInput = screen.getByPlaceholderText("Alias name (e.g., 'read')");
    const toolInput = screen.getByPlaceholderText(
      "Tool name (e.g., 'fs_read')",
    );
    const addButton = screen.getByRole("button");

    fireEvent.change(aliasInput, { target: { value: "  read  " } });
    fireEvent.change(toolInput, { target: { value: "  fs_read  " } });
    fireEvent.click(addButton);

    expect(mockOnChange).toHaveBeenCalledWith({ read: "fs_read" });
  });

  test("applies custom className", () => {
    const { container } = render(
      <ToolAliasesManager
        value={{}}
        onChange={mockOnChange}
        className="custom-class"
      />,
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });
});
