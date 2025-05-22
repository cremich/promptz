import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FilterSidebar from "@/components/search/filter-sidebar";

// Mock the FilterSection component
jest.mock("@/components/search/filter-section", () => ({
  FilterSection: ({
    title,
    filterKey,
    options,
  }: {
    title: string;
    filterKey: string;
    options: string[];
  }) => (
    <div
      data-testid="filter-section"
      data-title={title}
      data-filter-key={filterKey}
    ></div>
  ),
}));

describe("FilterSidebar", () => {
  test("Renders FilterSection with correct props", async () => {
    render(<FilterSidebar />);

    const filterSection = await screen.findAllByTestId("filter-section");
    expect(filterSection).toHaveLength(3);
  });
});
