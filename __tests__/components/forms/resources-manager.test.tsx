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
      expect(
        screen.getByPlaceholderText(/Enter file path/),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Add Resource/ }),
      ).toBeInTheDocument();
    });

    test("renders with existing resources", () => {
      const resources = [
        "./src/components",
        "/absolute/path/file.txt",
        "~/config.json",
      ];
      render(<ResourcesManager value={resources} onChange={mockOnChange} />);

      expect(screen.getByText("Configured Resources (3)")).toBeInTheDocument();
      expect(screen.getByText("./src/components")).toBeInTheDocument();
      expect(screen.getByText("/absolute/path/file.txt")).toBeInTheDocument();
      expect(screen.getByText("~/config.json")).toBeInTheDocument();
    });
  });

  describe("Adding Resources", () => {
    test("adds new resource when Add Resource button is clicked", () => {
      render(<ResourcesManager value={[]} onChange={mockOnChange} />);

      const input = screen.getByPlaceholderText(/Enter file path/);
      const addButton = screen.getByRole("button", { name: /Add Resource/ });

      fireEvent.change(input, { target: { value: "./new/resource.txt" } });
      fireEvent.click(addButton);

      expect(mockOnChange).toHaveBeenCalledWith(["./new/resource.txt"]);
    });

    test("adds resource when Enter key is pressed", () => {
      render(<ResourcesManager value={[]} onChange={mockOnChange} />);

      const input = screen.getByPlaceholderText(/Enter file path/);

      fireEvent.change(input, { target: { value: "/home/user/file.txt" } });
      fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

      expect(mockOnChange).toHaveBeenCalledWith(["/home/user/file.txt"]);
    });

    test("trims whitespace from resource paths", () => {
      render(<ResourcesManager value={[]} onChange={mockOnChange} />);

      const input = screen.getByPlaceholderText(/Enter file path/);
      const addButton = screen.getByRole("button", { name: /Add Resource/ });

      fireEvent.change(input, { target: { value: "  ./spaced/path.txt  " } });
      fireEvent.click(addButton);

      expect(mockOnChange).toHaveBeenCalledWith(["./spaced/path.txt"]);
    });

    test("prevents adding duplicate resources", () => {
      const existingResources = ["./existing.txt"];
      render(
        <ResourcesManager value={existingResources} onChange={mockOnChange} />,
      );

      const input = screen.getByPlaceholderText(/Enter file path/);
      const addButton = screen.getByRole("button", { name: /Add Resource/ });

      fireEvent.change(input, { target: { value: "./existing.txt" } });

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
  });

  describe("Removing Resources", () => {
    test("removes resource when delete button is clicked", () => {
      const resources = ["./file1.txt", "./file2.txt", "./file3.txt"];
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
          "./file2.txt",
          "./file3.txt",
        ]);
      }
    });

    test("removes correct resource by index", () => {
      const resources = ["./first.txt", "./second.txt", "./third.txt"];
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
          "./first.txt",
          "./third.txt",
        ]);
      }
    });
  });

  describe("Resource Type Detection", () => {
    test("displays correct resource types for different path formats", () => {
      const resources = [
        "/absolute/path.txt",
        "./relative/path.txt",
        "~/home/path.txt",
        "simple-file.txt",
        "directory/file.txt",
      ];
      render(<ResourcesManager value={resources} onChange={mockOnChange} />);

      expect(screen.getByText("Absolute path")).toBeInTheDocument();
      expect(screen.getByText("Relative path")).toBeInTheDocument();
      expect(screen.getByText("Home directory")).toBeInTheDocument();
      expect(screen.getByText("File name")).toBeInTheDocument();
      expect(screen.getByText("Directory path")).toBeInTheDocument();
    });
  });

  describe("Input Handling", () => {
    test("clears input after successful addition", () => {
      render(<ResourcesManager value={[]} onChange={mockOnChange} />);

      const input = screen.getByPlaceholderText(
        /Enter file path/,
      ) as HTMLInputElement;
      const addButton = screen.getByRole("button", { name: /Add Resource/ });

      fireEvent.change(input, { target: { value: "./test.txt" } });
      fireEvent.click(addButton);

      expect(input.value).toBe("");
    });

    test("updates input value correctly", () => {
      render(<ResourcesManager value={[]} onChange={mockOnChange} />);

      const input = screen.getByPlaceholderText(
        /Enter file path/,
      ) as HTMLInputElement;

      fireEvent.change(input, { target: { value: "./new-value.txt" } });

      expect(input.value).toBe("./new-value.txt");
    });
  });

  describe("Accessibility", () => {
    test("has proper labels and descriptions", () => {
      render(
        <ResourcesManager value={["./test.txt"]} onChange={mockOnChange} />,
      );

      expect(screen.getByText("Configured Resources (1)")).toBeInTheDocument();
      expect(screen.getByText("Supported formats:")).toBeInTheDocument();
    });

    test("input has proper placeholder text", () => {
      render(<ResourcesManager value={[]} onChange={mockOnChange} />);

      expect(
        screen.getByPlaceholderText(/Enter file path/),
      ).toBeInTheDocument();
    });

    test("buttons have proper accessibility attributes", () => {
      render(
        <ResourcesManager value={["./test.txt"]} onChange={mockOnChange} />,
      );

      const addButton = screen.getByRole("button", { name: /Add Resource/ });
      expect(addButton).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    test("handles very long resource paths", () => {
      const longPath =
        "./very/long/path/that/might/cause/issues/with/display/file.txt";
      render(<ResourcesManager value={[longPath]} onChange={mockOnChange} />);

      expect(screen.getByText(longPath)).toBeInTheDocument();
    });

    test("handles special characters in paths", () => {
      const specialPath = "./path with spaces/file-name_with.special@chars.txt";
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
