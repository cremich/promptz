import Tags from "@/app/ui/common/tags";
import { describe, expect, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

describe("Tags Component", () => {
  test("renders all provided tags", () => {
    const tags = ["react", "typescript", "nextjs"];
    render(<Tags tags={tags} />);

    tags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  test("renders no tags when empty array is provided", () => {
    const tags: string[] = [];
    const { container } = render(<Tags tags={tags} />);

    const badgeElements = container.querySelectorAll(".badge");
    expect(badgeElements.length).toBe(0);
  });
});
