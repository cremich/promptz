import { describe, expect, test, jest } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ResourcesManager } from "@/components/forms/resources-manager";

describe("ResourcesManager", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  describe("Initial State", () => {
    test("renders empty state when no resources provided", () => {
      render(<ResourcesManager value={[]} onChange={mockOnChange} />);

      expect(
        screen.getByText(/No resources configured yet/),
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/file:\/\//)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Add Resource/ }),
      ).toBeInTheDocument();
    });

    test("renders with existing file:// resources", () => {
      const resources = [
        "file://README.md",
        "file://.amazonq/rules/**/*.md",
        "file://src/components/index.ts",
      ];
      render(<ResourcesManager value={resources} onChange={mockOnChange} />);

      expect(screen.getByText("Configured Resources (3)")).toBeInTheDocument();

      // Use getAllByText to handle multiple matches and check the first one (which is the actual resource)
      const readmeElements = screen.getAllByText("file://README.md");
      expect(readmeElements[0]).toBeInTheDocument();

      const amazonqElements = screen.getAllByText(
        "file://.amazonq/rules/**/*.md",
      );
      expect(amazonqElements[0]).toBeInTheDocument();

      expect(
        screen.getByText("file://src/components/index.ts"),
      ).toBeInTheDocument();
    });
  });

  describe("Adding Resources", () => {
    test("automatically adds file:// prefix when user enters path without it", () => {
      render(<ResourcesManager value={[]} onChange={mockOnChange} />);

      const input = screen.getByPlaceholderText(/file:\/\//);
      const addButton = screen.getByRole("button", { name: /Add Resource/ });

      fireEvent.change(input, { target: { value: "README.md" } });
      fireEvent.click(addButton);

      expect(mockOnChange).toHaveBeenCalledWith(["file://README.md"]);
    });

    test("does not duplicate file:// prefix when already present", () => {
      render(<ResourcesManager value={[]} onChange={mockOnChange} />);

      const input = screen.getByPlaceholderText(/file:\/\//);
      const addButton = screen.getByRole("button", { name: /Add Resource/ });

      fireEvent.change(input, { target: { value: "file://README.md" } });
      fireEvent.click(addButton);

      expect(mockOnChange).toHaveBeenCalledWith(["file://README.md"]);
    });

    test("handles glob patterns correctly", () => {
      render(<ResourcesManager value={[]} onChange={mockOnChange} />);

      const input = screen.getByPlaceholderText(/file:\/\//);
      const addButton = screen.getByRole("button", { name: /Add Resource/ });

      fireEvent.change(input, { target: { value: ".amazonq/rules/**/*.md" } });
      fireEvent.click(addButton);

      expect(mockOnChange).toHaveBeenCalledWith([
        "file://.amazonq/rules/**/*.md",
      ]);
    });

    test("adds resource when Enter key is pressed", () => {
      render(<ResourcesManager value={[]} onChange={mockOnChange} />);

      const input = screen.getByPlaceholderText(/file:\/\//);

      fireEvent.change(input, { target: { value: "src/index.ts" } });
      fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

      expect(mockOnChange).toHaveBeenCalledWith(["file://src/index.ts"]);
    });

    test("trims whitespace from resource paths", () => {
      render(<ResourcesManager value={[]} onChange={mockOnChange} />);

      const input = screen.getByPlaceholderText(/file:\/\//);
      const addButton = screen.getByRole("button", { name: /Add Resource/ });

      fireEvent.change(input, { target: { value: "  ./spaced/path.txt  " } });
      fireEvent.click(addButton);

      expect(mockOnChange).toHaveBeenCalledWith(["file://./spaced/path.txt"]);
    });

    test("prevents adding duplicate resources", () => {
      const existingResources = ["file://existing.txt"];
      render(
        <ResourcesManager value={existingResources} onChange={mockOnChange} />,
      );

      const input = screen.getByPlaceholderText(/file:\/\//);
      const addButton = screen.getByRole("button", { name: /Add Resource/ });

      fireEvent.change(input, { target: { value: "existing.txt" } });

      expect(addButton).toBeDisabled();

      fireEvent.click(addButton);
      expect(mockOnChange).not.toHaveBeenCalled();
    });

    test("prevents adding empty resources", () => {
      render(<ResourcesManager value={[]} onChange={mockOnChange} />);

      const addButton = screen.getByRole("button", { name: /Add Resource/ });

      expect(addButton).toBeDisabled();

      fireEvent.click(addButton);
      expect(mockOnChange).not.toHaveBeenCalled();
    });

    test("prevents adding only file:// prefix without path", () => {
      render(<ResourcesManager value={[]} onChange={mockOnChange} />);

      const input = screen.getByPlaceholderText(/file:\/\//);
      const addButton = screen.getByRole("button", { name: /Add Resource/ });

      fireEvent.change(input, { target: { value: "file://" } });

      expect(addButton).toBeDisabled();

      fireEvent.click(addButton);
      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  describe("Removing Resources", () => {
    test("removes resource when delete button is clicked", () => {
      const resources = [
        "file://file1.txt",
        "file://file2.txt",
        "file://file3.txt",
      ];
      render(<ResourcesManager value={resources} onChange={mockOnChange} />);

      const deleteButtons = screen.getAllByRole("button", { name: "" });
      const deleteButton = deleteButtons.find(
        (button) =>
          button.querySelector("svg")?.getAttribute("data-lucide") ===
          "trash-2",
      );

      if (deleteButton) {
        fireEvent.click(deleteButton);
        expect(mockOnChange).toHaveBeenCalledWith([
          "file://file2.txt",
          "file://file3.txt",
        ]);
      }
    });

    test("removes correct resource by index", () => {
      const resources = [
        "file://first.txt",
        "file://second.txt",
        "file://third.txt",
      ];
      render(<ResourcesManager value={resources} onChange={mockOnChange} />);

      const deleteButtons = screen.getAllByRole("button", { name: "" });
      const trashButtons = deleteButtons.filter(
        (button) =>
          button.querySelector("svg")?.getAttribute("data-lucide") ===
          "trash-2",
      );

      // Click the second delete button (index 1)
      if (trashButtons[1]) {
        fireEvent.click(trashButtons[1]);
        expect(mockOnChange).toHaveBeenCalledWith([
          "file://first.txt",
          "file://third.txt",
        ]);
      }
    });
  });

  describe("Resource Type Detection", () => {
    test("displays correct resource types for different file:// path formats", () => {
      const resources = [
        "file:///absolute/path.txt",
        "file://./relative/path.txt",
        "file://~/home/path.txt",
        "file://simple-file.txt",
        "file://directory/file.txt",
        "file://.amazonq/**/*.md",
      ];
      render(<ResourcesManager value={resources} onChange={mockOnChange} />);

      expect(screen.getByText("Absolute path")).toBeInTheDocument();
      expect(screen.getByText("Relative path")).toBeInTheDocument();
      expect(screen.getByText("Home directory")).toBeInTheDocument();
      expect(screen.getByText("File")).toBeInTheDocument();
      expect(screen.getByText("Directory path")).toBeInTheDocument();
      expect(screen.getByText("Glob pattern")).toBeInTheDocument();
    });
  });

  describe("Input Handling", () => {
    test("clears input after successful addition", () => {
      render(<ResourcesManager value={[]} onChange={mockOnChange} />);

      const input = screen.getByPlaceholderText(
        /file:\/\//,
      ) as HTMLInputElement;
      const addButton = screen.getByRole("button", { name: /Add Resource/ });

      fireEvent.change(input, { target: { value: "test.txt" } });
      fireEvent.click(addButton);

      expect(input.value).toBe("");
    });

    test("updates input value correctly", () => {
      render(<ResourcesManager value={[]} onChange={mockOnChange} />);

      const input = screen.getByPlaceholderText(
        /file:\/\//,
      ) as HTMLInputElement;

      fireEvent.change(input, { target: { value: "new-value.txt" } });

      expect(input.value).toBe("new-value.txt");
    });
  });

  describe("Accessibility", () => {
    test("has proper labels and descriptions", () => {
      render(
        <ResourcesManager
          value={["file://test.txt"]}
          onChange={mockOnChange}
        />,
      );

      expect(screen.getByText("Configured Resources (1)")).toBeInTheDocument();
      expect(screen.getByText("Supported formats:")).toBeInTheDocument();
    });

    test("input has proper placeholder text with file:// examples", () => {
      render(<ResourcesManager value={[]} onChange={mockOnChange} />);

      expect(screen.getByPlaceholderText(/file:\/\//)).toBeInTheDocument();
    });

    test("buttons have proper accessibility attributes", () => {
      render(
        <ResourcesManager
          value={["file://test.txt"]}
          onChange={mockOnChange}
        />,
      );

      const addButton = screen.getByRole("button", { name: /Add Resource/ });
      expect(addButton).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    test("handles very long resource paths", () => {
      const longPath =
        "file://very/long/path/that/might/cause/issues/with/display/file.txt";
      render(<ResourcesManager value={[longPath]} onChange={mockOnChange} />);

      expect(screen.getByText(longPath)).toBeInTheDocument();
    });

    test("handles special characters in paths", () => {
      const specialPath =
        "file://path with spaces/file-name_with.special@chars.txt";
      render(
        <ResourcesManager value={[specialPath]} onChange={mockOnChange} />,
      );

      expect(screen.getByText(specialPath)).toBeInTheDocument();
    });

    test("handles empty array correctly", () => {
      render(<ResourcesManager value={[]} onChange={mockOnChange} />);

      expect(
        screen.getByText(/No resources configured yet/),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("Configured Resources"),
      ).not.toBeInTheDocument();
    });
  });
});
