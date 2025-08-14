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

describe("CreateAgent", () => {
  test("Renders page title", async () => {
    const result = await CreateAgent();
    render(result);

    // Check for page title
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Create Agent");
  });

  test("Renders placeholder content for future implementation", async () => {
    const result = await CreateAgent();
    render(result);

    // Check for placeholder text
    const placeholder = screen.getByText(
      "Agent creation form will be implemented in a future task.",
    );
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveClass("text-muted-foreground");
  });

  test("Fetches tags from all categories", async () => {
    const { fetchTagsByCategory } = require("@/lib/actions/fetch-tags-action");

    await CreateAgent();

    // Verify that fetchTagsByCategory was called for all required categories
    expect(fetchTagsByCategory).toHaveBeenCalledWith("Interface");
    expect(fetchTagsByCategory).toHaveBeenCalledWith("Agent");
    expect(fetchTagsByCategory).toHaveBeenCalledWith("SDLC");
    expect(fetchTagsByCategory).toHaveBeenCalledTimes(3);
  });
});
