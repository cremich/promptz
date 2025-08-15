import { describe, expect, test, jest } from "@jest/globals";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ToolsMultiSelect } from "@/components/forms/tools-multi-select";

describe("ToolsMultiSelect", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test("renders with placeholder when no tools selected", () => {
    render(
      <ToolsMultiSelect
        value={[]}
        onChange={mockOnChange}
        placeholder="Select tools..."
      />,
    );

    expect(screen.getByText("Select tools...")).toBeInTheDocument();
  });

  test("displays selected tools as badges", () => {
    render(
      <ToolsMultiSelect
        value={["fs_read", "fs_write"]}
        onChange={mockOnChange}
      />,
    );

    expect(screen.getByText("fs_read")).toBeInTheDocument();
    expect(screen.getByText("fs_write")).toBeInTheDocument();
  });

  test("applies custom className", () => {
    render(
      <ToolsMultiSelect
        value={[]}
        onChange={mockOnChange}
        className="custom-class"
      />,
    );

    const container = screen.getByRole("combobox").closest(".custom-class");
    expect(container).toBeInTheDocument();
  });
});
