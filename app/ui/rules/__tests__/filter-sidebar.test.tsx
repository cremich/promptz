import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { FilterSidebar } from "../browse/filter-sidebar";
import { ProjectRuleTag } from "@/app/lib/definitions";

describe("FilterSidebar", () => {
  test("renders filter sidebar with project rule tags", () => {
    render(<FilterSidebar />);

    // Check if the title is rendered
    expect(screen.getByText("Tags")).toBeInTheDocument();

    // Check if all tags from ProjectRuleTag enum are rendered as options
    Object.values(ProjectRuleTag).forEach((tag) => {
      const tagElement = screen.getByText(tag);
      expect(tagElement).toBeInTheDocument();
    });
  });
});
