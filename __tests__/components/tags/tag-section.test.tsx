import { describe, expect, test } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Tag } from "@/lib/models/tags-model";
import TagSection from "@/components/tags/tag-section";
import { getTag } from "@/lib/actions/fetch-tags-action";

// Mock the fetch-tags-action before importing TagSection
jest.mock("@/lib/actions/fetch-tags-action", () => ({
  getTag: jest.fn(),
}));
// Mock Next.js Link component
jest.mock("next/link", () => {
  return function MockLink({ children, href, ...props }: any) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

// Mock TagCard component to isolate TagSection testing
jest.mock("@/components/tags/tag-card", () => {
  return function MockTagCard({ tag }: { tag: Tag }) {
    return (
      <div data-testid={`tag-card-${tag.name}`}>
        <span>{tag.name}</span>
        <span>{tag.description}</span>
        <span>{tag.promptCount} prompts</span>
        <span>{tag.ruleCount} rules</span>
      </div>
    );
  };
});

describe("TagSection", () => {
  const mockProps = {
    title: "Browse by Interface",
    description:
      "Discover prompts and project rules tailored for your preferred interface",
    tagNames: ["IDE", "CLI"],
  };

  const mockTags: Tag[] = [
    {
      name: "IDE",
      description: "IDE-related content",
      promptCount: 5,
      ruleCount: 3,
    },
    {
      name: "CLI",
      description: "CLI-related content",
      promptCount: 2,
      ruleCount: 4,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders section title and description", async () => {
    jest.mocked(getTag).mockImplementation((name) => {
      return Promise.resolve(mockTags.find((tag) => tag.name === name));
    });

    render(<TagSection {...mockProps} />);

    expect(screen.getByText("Browse by Interface")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Discover prompts and project rules tailored for your preferred interface",
      ),
    ).toBeInTheDocument();
  });

  test("renders with proper accessibility attributes", async () => {
    jest
      .mocked(getTag)
      .mockImplementation((name) =>
        Promise.resolve(mockTags.find((tag) => tag.name === name)),
      );

    render(<TagSection {...mockProps} />);

    // Check for proper heading ID
    const heading = screen.getByRole("heading", {
      name: "Browse by Interface",
    });
    expect(heading).toHaveAttribute("id", "browse-by-interface-heading");

    // Check for section aria-labelledby
    const section = screen.getByRole("region");
    expect(section).toHaveAttribute(
      "aria-labelledby",
      "browse-by-interface-heading",
    );

    // Check for grid role and aria-label
    const grid = screen.getByRole("grid");
    expect(grid).toHaveAttribute("aria-label", "Browse by Interface tags");
  });

  test("renders loading skeletons initially", () => {
    jest.mocked(getTag).mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<TagSection {...mockProps} />);

    // Should show loading skeletons for each tag - check for skeleton class
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  test("renders tag cards after data loads", async () => {
    jest
      .mocked(getTag)
      .mockImplementation((name) =>
        Promise.resolve(mockTags.find((tag) => tag.name === name)),
      );

    render(<TagSection {...mockProps} />);

    // Wait for tag cards to load
    await waitFor(() => {
      expect(screen.getByTestId("tag-card-IDE")).toBeInTheDocument();
      expect(screen.getByTestId("tag-card-CLI")).toBeInTheDocument();
    });

    // Verify tag data is displayed
    expect(screen.getByText("IDE-related content")).toBeInTheDocument();
    expect(screen.getByText("CLI-related content")).toBeInTheDocument();
  });

  test("renders error state when tag loading fails", async () => {
    jest
      .mocked(getTag)
      .mockImplementation(() => Promise.reject(new Error("Failed to load")));

    render(<TagSection {...mockProps} />);

    // Wait for error states to appear
    await waitFor(() => {
      expect(screen.getByText("Failed to load IDE")).toBeInTheDocument();
      expect(screen.getByText("Failed to load CLI")).toBeInTheDocument();
    });

    // Check for error icons and retry messages
    expect(screen.getAllByText("Please try again later")).toHaveLength(2);
  });

  test("renders error state when tag returns null", async () => {
    jest.mocked(getTag).mockImplementation(() => Promise.resolve(undefined));

    render(<TagSection {...mockProps} />);

    // Wait for error states to appear
    await waitFor(() => {
      expect(screen.getByText("Failed to load IDE")).toBeInTheDocument();
      expect(screen.getByText("Failed to load CLI")).toBeInTheDocument();
    });
  });

  test("handles mixed success and failure states", async () => {
    jest.mocked(getTag).mockImplementation((name) => {
      if (name === "IDE") {
        return Promise.resolve(mockTags[0]);
      }
      return Promise.reject(new Error("Failed to load"));
    });

    render(<TagSection {...mockProps} />);

    // Wait for mixed states
    await waitFor(() => {
      expect(screen.getByTestId("tag-card-IDE")).toBeInTheDocument();
      expect(screen.getByText("Failed to load CLI")).toBeInTheDocument();
    });
  });

  test("renders correct number of grid cells", async () => {
    jest.mocked(getTag).mockImplementation((name) => {
      return Promise.resolve(mockTags.find((tag) => tag.name === name));
    });

    render(<TagSection {...mockProps} />);

    // Check for correct number of grid cells
    const gridCells = screen.getAllByRole("gridcell");
    expect(gridCells).toHaveLength(2);
  });

  test("applies gradient text styling to title", () => {
    jest.mocked(getTag).mockImplementation(() => Promise.resolve(mockTags[0]));

    render(<TagSection {...mockProps} />);

    const heading = screen.getByRole("heading", {
      name: "Browse by Interface",
    });
    expect(heading).toHaveClass(
      "bg-gradient-to-r",
      "from-white",
      "to-violet-300",
      "bg-clip-text",
      "text-transparent",
    );
  });

  test("handles empty tag names array", () => {
    const emptyProps = {
      ...mockProps,
      tagNames: [],
    };

    render(<TagSection {...emptyProps} />);

    // Should still render title and description
    expect(screen.getByText("Browse by Interface")).toBeInTheDocument();

    // Should not have any grid cells
    expect(screen.queryByRole("gridcell")).not.toBeInTheDocument();
  });

  test("generates correct heading ID for different titles", () => {
    const propsWithSpecialTitle = {
      ...mockProps,
      title: "Browse by Development Activity",
    };

    render(<TagSection {...propsWithSpecialTitle} />);

    const heading = screen.getByRole("heading", {
      name: "Browse by Development Activity",
    });
    expect(heading).toHaveAttribute(
      "id",
      "browse-by-development-activity-heading",
    );
  });

  test("calls getTag for each tag name", async () => {
    jest.mocked(getTag).mockImplementation((name) => {
      return Promise.resolve(mockTags.find((tag) => tag.name === name));
    });

    render(<TagSection {...mockProps} />);

    // Wait for all calls to complete
    await waitFor(() => {
      expect(getTag).toHaveBeenCalledWith("IDE");
      expect(getTag).toHaveBeenCalledWith("CLI");
      expect(getTag).toHaveBeenCalledTimes(2);
    });
  });
});
