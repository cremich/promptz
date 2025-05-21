import { describe, expect, test } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SortSelector from "@/components/search/sort-selector";

// Mock the Next.js navigation hooks
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => "/test-path",
}));

describe("SortSelector", () => {
  test("Renders sort selector with correct label", () => {
    render(<SortSelector />);

    // Check for the label text
    const label = screen.getByText("Sort by:");
    expect(label).toBeInTheDocument();
  });

  test("Renders select component with default value", () => {
    render(<SortSelector />);

    // Check for the select trigger
    const selectTrigger = screen.getByRole("combobox");
    expect(selectTrigger).toBeInTheDocument();

    // Default value should be "Newest" (corresponding to "created_at:desc")
    expect(selectTrigger).toHaveTextContent("Newest");
  });

  test("Shows sort options when clicked", async () => {
    render(<SortSelector />);

    // Click the select trigger to open the dropdown
    const selectTrigger = screen.getByRole("combobox");
    fireEvent.click(selectTrigger);

    // Check that both options are displayed
    const newestOption = screen.getAllByText("Newest");
    const oldestOption = screen.getByText("Oldest");

    expect(newestOption).toBeDefined();
    expect(oldestOption).toBeDefined();
  });

  test("Calls router.push with updated params when option is selected", () => {
    render(<SortSelector />);

    // Click the select trigger to open the dropdown
    const selectTrigger = screen.getByRole("combobox");
    fireEvent.click(selectTrigger);

    // Click the "Oldest" option
    const oldestOption = screen.getByText("Oldest");
    fireEvent.click(oldestOption);

    // Check that router.push was called
    expect(mockPush).toHaveBeenCalled();
  });
});
