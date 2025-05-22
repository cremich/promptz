import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Tags from "@/components/common/tags";

describe("Tags", () => {
  test("Renders single tag correctly", () => {
    render(<Tags tags={["javascript"]} />);

    // Check if the tag is rendered with correct text
    expect(screen.getByText("javascript")).toBeInTheDocument();

    // Check if only one tag is rendered
    const tags = screen.getAllByTestId("tag");
    expect(tags).toHaveLength(1);
  });

  test("Renders multiple tags correctly", () => {
    const testTags = ["javascript", "react", "typescript"];
    render(<Tags tags={testTags} />);

    // Check if all tags are rendered
    testTags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });

    // Check if the correct number of tags are rendered
    const tags = screen.getAllByTestId("tag");
    expect(tags).toHaveLength(testTags.length);
  });

  test("Each tag has the correct styling classes", () => {
    render(<Tags tags={["javascript"]} />);

    const tag = screen.getByTestId("tag");
    expect(tag).toHaveClass("bg-violet-500");
    expect(tag).toHaveClass("hover:bg-violet-500");
  });
});
