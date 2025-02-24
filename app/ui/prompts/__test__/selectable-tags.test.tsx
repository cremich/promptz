import SelectableTags from "@/app/ui/prompts/selectable-tag";
import { describe, expect, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

describe("Selectable Component", () => {
  test("renders tags tags", () => {
    const tags = ["react", "typescript", "nextjs"];
    render(<SelectableTags tags={tags} onTagSelect={() => {}} />);

    tags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  test("renders no tags when empty array is provided", () => {
    const tags: string[] = [];
    const { container } = render(
      <SelectableTags tags={tags} onTagSelect={() => {}} />,
    );

    const badgeElements = container.querySelectorAll(".badge");
    expect(badgeElements.length).toBe(0);
  });
});
