import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TagBrowseSection from "@/components/tags/tag-browse-section";

// Mock TagSection component to isolate TagBrowseSection testing
jest.mock("@/components/tags/tag-section", () => {
  return function TagSection({ title, description, tagNames }: any) {
    return (
      <div
        data-testid={`tag-section-${title.toLowerCase().replace(/\s+/g, "-")}`}
      >
        <h2>{title}</h2>
        <p>{description}</p>
        <div data-testid="tag-names">
          {tagNames.map((name: string) => (
            <span key={name} data-testid={`tag-${name}`}>
              {name}
            </span>
          ))}
        </div>
      </div>
    );
  };
});

describe("TagBrowseSection", () => {
  test("renders both tag sections", () => {
    render(<TagBrowseSection />);

    // Check for Interface section
    expect(
      screen.getByTestId("tag-section-browse-by-interface"),
    ).toBeInTheDocument();
    expect(screen.getByText("Browse by Interface")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Discover prompts and project rules tailored for your preferred Amazon Q Developer interface",
      ),
    ).toBeInTheDocument();

    // Check for Development Activity section
    expect(
      screen.getByTestId("tag-section-browse-by-development-activity"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Browse by Development Activity"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Find the perfect prompts for every stage of your software development lifecycle",
      ),
    ).toBeInTheDocument();
  });

  test("renders correct tag names for Interface section", () => {
    render(<TagBrowseSection />);

    const interfaceSection = screen.getByTestId(
      "tag-section-browse-by-interface",
    );

    // Check for Interface tags
    expect(
      interfaceSection.querySelector('[data-testid="tag-IDE"]'),
    ).toBeInTheDocument();
    expect(
      interfaceSection.querySelector('[data-testid="tag-CLI"]'),
    ).toBeInTheDocument();
    expect(
      interfaceSection.querySelector('[data-testid="tag-Management Console"]'),
    ).toBeInTheDocument();
  });

  test("renders correct tag names for Development Activity section", () => {
    render(<TagBrowseSection />);

    const activitySection = screen.getByTestId(
      "tag-section-browse-by-development-activity",
    );

    // Check for Development Activity tags
    expect(
      activitySection.querySelector('[data-testid="tag-Design"]'),
    ).toBeInTheDocument();
    expect(
      activitySection.querySelector('[data-testid="tag-Implement"]'),
    ).toBeInTheDocument();
    expect(
      activitySection.querySelector('[data-testid="tag-Test"]'),
    ).toBeInTheDocument();
  });

  test("applies correct spacing and layout classes", () => {
    render(<TagBrowseSection />);

    const container = screen.getByTestId(
      "tag-section-browse-by-interface",
    ).parentElement;
    expect(container).toHaveClass("space-y-16", "py-16");
  });

  test("renders sections in correct order", () => {
    render(<TagBrowseSection />);

    const sections = screen.getAllByRole("heading", { level: 2 });
    expect(sections[0]).toHaveTextContent("Browse by Interface");
    expect(sections[1]).toHaveTextContent("Browse by Development Activity");
  });

  test("passes correct props to TagSection components", () => {
    render(<TagBrowseSection />);

    // Verify Interface section props
    const interfaceSection = screen.getByTestId(
      "tag-section-browse-by-interface",
    );
    expect(interfaceSection).toBeInTheDocument();

    // Verify Development Activity section props
    const activitySection = screen.getByTestId(
      "tag-section-browse-by-development-activity",
    );
    expect(activitySection).toBeInTheDocument();
  });

  test("renders as a single container element", () => {
    const { container } = render(<TagBrowseSection />);

    // Should have a single root div with proper classes
    const rootDiv = container.firstChild as HTMLElement;
    expect(rootDiv.tagName).toBe("DIV");
    expect(rootDiv).toHaveClass("space-y-16", "py-16");
  });
});
