import { describe, expect, test } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { FilterSection } from "@/components/search/filter-section";

// Mock the Next.js navigation hooks
const mockReplace = jest.fn();
const mockPathname = "/test-path";
const mockSelectedValues: Record<string, string[]> = {};

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
  useSearchParams: () => ({
    getAll: (key: string) => mockSelectedValues[key] || [],
    toString: () => "",
  }),
  usePathname: () => mockPathname,
}));

describe("FilterSection", () => {
  const mockOptions = ["Option1", "Option2", "Option3"];

  beforeEach(() => {
    // Reset mocks before each test
    mockReplace.mockClear();
    Object.keys(mockSelectedValues).forEach((key) => {
      delete mockSelectedValues[key];
    });
  });

  test("Renders filter section with title and options", () => {
    render(
      <FilterSection
        title="Test Filter"
        filterKey="tags"
        options={mockOptions}
      />,
    );

    // Check if title is rendered
    expect(screen.getByText("Test Filter")).toBeInTheDocument();

    // Check if all options are rendered
    mockOptions.forEach((option) => {
      expect(screen.getByText(option)).toBeInTheDocument();
      expect(
        screen.getByRole("checkbox", { name: option }),
      ).toBeInTheDocument();
    });
  });

  test("Renders as collapsible when collapsible prop is true", () => {
    render(
      <FilterSection
        title="Test Filter"
        filterKey="tags"
        options={mockOptions}
        collapsible={true}
      />,
    );

    // Check if chevron icon is present (indicating collapsible)
    const chevronIcon = document.querySelector("svg");
    expect(chevronIcon).toBeInTheDocument();
  });

  test("Adds filter value when checkbox is clicked", () => {
    render(
      <FilterSection
        title="Test Filter"
        filterKey="tags"
        options={mockOptions}
      />,
    );

    // Click on the first option checkbox
    fireEvent.click(screen.getByRole("checkbox", { name: "Option1" }));

    // Check if router.replace was called
    expect(mockReplace).toHaveBeenCalled();
  });

  test("Removes filter value when selected checkbox is clicked again", () => {
    // Set up initial selected value
    mockSelectedValues["tags[]"] = ["Option1"];

    render(
      <FilterSection
        title="Test Filter"
        filterKey="tags"
        options={mockOptions}
      />,
    );

    // Click on the already selected checkbox
    fireEvent.click(screen.getByRole("checkbox", { name: "Option1" }));

    // Check if router.replace was called
    expect(mockReplace).toHaveBeenCalled();
  });
});
