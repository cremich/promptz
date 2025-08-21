import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TagCard from "@/components/tags/tag-card";
import { Tag } from "@/lib/models/tags-model";

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

describe("TagCard", () => {
  const mockTag: Tag = {
    name: "IDE",
    description: "Prompts and rules for IDE usage",
    category: "Interface",
    promptCount: 5,
    ruleCount: 3,
  };

  test("renders tag card with all information", () => {
    render(<TagCard tag={mockTag} />);

    // Check if tag name is displayed
    expect(screen.getByText("IDE")).toBeInTheDocument();

    // Check if description is displayed
    expect(
      screen.getByText("Prompts and rules for IDE usage"),
    ).toBeInTheDocument();

    // Check if prompt count badge is displayed
    expect(screen.getByText("5 Prompts")).toBeInTheDocument();

    // Check if rule count badge is displayed
    expect(screen.getByText("3 Rules")).toBeInTheDocument();
  });

  test("renders correct link href", () => {
    render(<TagCard tag={mockTag} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/tag/IDE");
  });

  test("renders with proper accessibility attributes", () => {
    render(<TagCard tag={mockTag} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("aria-label", "Browse IDE tag with 8 items");

    // Check for content counts group
    const countsGroup = screen.getByRole("group", { name: "Content counts" });
    expect(countsGroup).toBeInTheDocument();

    // Check individual badge aria-labels
    expect(screen.getByLabelText("5 prompts")).toBeInTheDocument();
    expect(screen.getByLabelText("3 project rules")).toBeInTheDocument();
  });

  test("handles singular count labels correctly", () => {
    const singleCountTag: Tag = {
      name: "Test",
      description: "Test description",
      promptCount: 1,
      ruleCount: 1,
    };

    render(<TagCard tag={singleCountTag} />);

    expect(screen.getByText("1 Prompt")).toBeInTheDocument();
    expect(screen.getByText("1 Rule")).toBeInTheDocument();
  });

  test("renders without description when not provided", () => {
    const tagWithoutDescription: Tag = {
      name: "CLI",
      promptCount: 2,
      ruleCount: 1,
    };

    render(<TagCard tag={tagWithoutDescription} />);

    expect(screen.getByText("CLI")).toBeInTheDocument();
    expect(screen.getByText("2 Prompts")).toBeInTheDocument();
    expect(screen.getByText("1 Rule")).toBeInTheDocument();

    // Description should not be present
    expect(screen.queryByText(/description/i)).not.toBeInTheDocument();
  });

  test("encodes tag name in URL correctly", () => {
    const specialCharTag: Tag = {
      name: "Test & Special",
      description: "Tag with special characters",
      promptCount: 1,
      ruleCount: 1,
    };

    render(<TagCard tag={specialCharTag} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/tag/Test%20%26%20Special");
  });

  test("renders agent count badge when agents are present", () => {
    const tagWithAgents: Tag = {
      name: "TypeScript",
      description: "TypeScript development resources",
      promptCount: 5,
      ruleCount: 3,
      agentCount: 2,
    };

    render(<TagCard tag={tagWithAgents} />);

    expect(screen.getByText("5 Prompts")).toBeInTheDocument();
    expect(screen.getByText("3 Rules")).toBeInTheDocument();
    expect(screen.getByText("2 Agents")).toBeInTheDocument();
    expect(screen.getByLabelText("2 agents")).toBeInTheDocument();
  });

  test("handles singular agent count label correctly", () => {
    const singleAgentTag: Tag = {
      name: "Test",
      description: "Test description",
      promptCount: 1,
      ruleCount: 1,
      agentCount: 1,
    };

    render(<TagCard tag={singleAgentTag} />);

    expect(screen.getByText("1 Prompt")).toBeInTheDocument();
    expect(screen.getByText("1 Rule")).toBeInTheDocument();
    expect(screen.getByText("1 Agent")).toBeInTheDocument();
  });

  test("includes agent count in total count for aria-label", () => {
    const tag: Tag = {
      name: "Test",
      promptCount: 7,
      ruleCount: 3,
      agentCount: 2,
    };

    render(<TagCard tag={tag} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("aria-label", "Browse Test tag with 12 items");
  });

  test("renders agent badge even when agent count is zero", () => {
    const tagWithoutAgents: Tag = {
      name: "Test",
      promptCount: 5,
      ruleCount: 3,
      agentCount: 0,
    };

    render(<TagCard tag={tagWithoutAgents} />);

    expect(screen.getByText("5 Prompts")).toBeInTheDocument();
    expect(screen.getByText("3 Rules")).toBeInTheDocument();
    expect(screen.getByText("0 Agents")).toBeInTheDocument();
    expect(screen.getByLabelText("0 agents")).toBeInTheDocument();
  });

  test("renders agent badge with 0 when agent count is undefined", () => {
    const tagWithUndefinedAgents: Tag = {
      name: "Test",
      promptCount: 2,
      ruleCount: 1,
      // agentCount is undefined
    };

    render(<TagCard tag={tagWithUndefinedAgents} />);

    expect(screen.getByText("2 Prompts")).toBeInTheDocument();
    expect(screen.getByText("1 Rule")).toBeInTheDocument();
    expect(screen.getByText("0 Agents")).toBeInTheDocument();
    expect(screen.getByLabelText("0 agents")).toBeInTheDocument();
  });
});
