import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FooterTags from "@/components/layout/footer-tags";
import { getAllTags } from "@/lib/actions/fetch-tags-action";

// Mock the getAllTags function
jest.mock("@/lib/actions/fetch-tags-action", () => ({
  getAllTags: jest.fn(),
}));

// Mock Next.js Link component
jest.mock("next/link", () => {
  return function MockLink({
    href,
    children,
    prefetch,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    prefetch?: boolean;
    [key: string]: any;
  }) {
    return (
      <a href={href} data-prefetch={prefetch?.toString()} {...props}>
        {children}
      </a>
    );
  };
});

describe("FooterTags", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Renders tags section with mock tags", async () => {
    // Mock successful tag fetch
    jest
      .mocked(getAllTags)
      .mockResolvedValue(["TypeScript", "React", "Next.js", "AWS", "CDK"]);

    const component = await FooterTags();
    render(component);

    // Check if section title is rendered
    expect(screen.getByText("Explore by Tags")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Discover prompts and project rules organized by technology, framework, and use case",
      ),
    ).toBeInTheDocument();

    // Check if tags are rendered as links
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
    expect(screen.getByText("AWS")).toBeInTheDocument();
    expect(screen.getByText("CDK")).toBeInTheDocument();

    // Check if tag count is displayed
    expect(
      screen.getByText(
        "5 tags available • Click any tag to explore related content",
      ),
    ).toBeInTheDocument();
  });

  test("Returns null when no tags are available", async () => {
    // Mock empty tag response
    jest.mocked(getAllTags).mockResolvedValue([]);

    const component = await FooterTags();
    expect(component).toBeNull();
  });

  test("Returns null when tag fetch fails", async () => {
    // Mock failed tag fetch
    jest
      .mocked(getAllTags)
      .mockRejectedValue(new Error("Failed to fetch tags"));

    const component = await FooterTags();
    expect(component).toBeNull();
  });

  test("Tag links have correct href attributes", async () => {
    // Mock successful tag fetch with special characters
    jest.mocked(getAllTags).mockResolvedValue(["Next.js", "C#", "TypeScript"]);

    const component = await FooterTags();
    render(component);

    // Check if links have correct href with encoded URIs
    const nextjsLink = screen.getByText("Next.js").closest("a");
    expect(nextjsLink).toHaveAttribute("href", "/tag/Next.js");

    const csharpLink = screen.getByText("C#").closest("a");
    expect(csharpLink).toHaveAttribute("href", "/tag/C%23");

    const typescriptLink = screen.getByText("TypeScript").closest("a");
    expect(typescriptLink).toHaveAttribute("href", "/tag/TypeScript");
  });

  test("Tag links have proper accessibility attributes", async () => {
    // Mock successful tag fetch
    jest.mocked(getAllTags).mockResolvedValue(["TypeScript"]);

    const component = await FooterTags();
    render(component);

    const tagLink = screen.getByText("TypeScript").closest("a");
    expect(tagLink).toHaveAttribute(
      "aria-label",
      "Browse content tagged with TypeScript",
    );
    expect(tagLink).toHaveAttribute(
      "title",
      "View all prompts and rules tagged with TypeScript",
    );
  });
});
