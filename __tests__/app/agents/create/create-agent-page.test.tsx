import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateAgent from "@/app/agents/create/page";

// Mock the fetchTagsByCategory function
jest.mock("@/lib/actions/fetch-tags-action", () => ({
  fetchTagsByCategory: jest.fn().mockImplementation((category: string) => {
    const mockTags = {
      Interface: [
        {
          name: "CLI",
          description: "Command Line Interface",
          category: "Interface",
        },
        { name: "Chat", description: "Chat Interface", category: "Interface" },
      ],
      Agent: [
        { name: "Custom", description: "Custom Agent", category: "Agent" },
      ],
      SDLC: [
        { name: "Testing", description: "Testing Tools", category: "SDLC" },
        {
          name: "Deployment",
          description: "Deployment Tools",
          category: "SDLC",
        },
      ],
    };
    return Promise.resolve(mockTags[category as keyof typeof mockTags] || []);
  }),
}));

jest.mock("@/components/agents/agent-form", () => {
  return function AgentForm({ tags }: { tags: any[] }) {
    return (
      <div data-testid="agent-form">
        <div data-testid="tags-count">{tags.length}</div>
        Prompt Form
      </div>
    );
  };
});

describe("CreateAgent", () => {
  test("Renders page title", async () => {
    const result = await CreateAgent();
    render(result);

    // Check for page title
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Create Agent");
  });

  test("Renders AgentForm component with tags", async () => {
    const result = await CreateAgent();
    render(result);

    // Check if PromptForm is rendered
    expect(screen.getByTestId("agent-form")).toBeInTheDocument();
  });
});
