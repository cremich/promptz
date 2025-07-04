import { render, screen } from "@testing-library/react";
import FilterSidebar from "@/components/search/filter-sidebar";

// Mock the fetch-tags-action
jest.mock("@/lib/actions/fetch-tags-action", () => ({
  fetchTagsByCategory: jest.fn((category: string) => {
    const mockTags = {
      Interface: [{ name: "CLI", description: "Command Line Interface" }],
      Agent: [{ name: "Chat", description: "Chat Agent" }],
      SDLC: [{ name: "Testing", description: "Software Testing" }],
      Framework: [{ name: "React", description: "React Framework" }],
      IaC: [{ name: "CDK", description: "AWS CDK" }],
      Language: [{ name: "TypeScript", description: "TypeScript Language" }],
    };
    return Promise.resolve(mockTags[category as keyof typeof mockTags] || []);
  }),
}));

describe("FilterSidebar", () => {
  it("renders prompts filters by default", async () => {
    const component = await FilterSidebar({ type: "prompts" });
    render(component);

    expect(screen.getByText("Interface")).toBeInTheDocument();
    expect(screen.getByText("Agent")).toBeInTheDocument();
    expect(screen.getByText("SDLC")).toBeInTheDocument();
  });

  it("renders rules filters when type is rules", async () => {
    const component = await FilterSidebar({ type: "rules" });
    render(component);

    expect(screen.getByText("Framework")).toBeInTheDocument();
    expect(screen.getByText("Infrastructure as Code")).toBeInTheDocument();
    expect(screen.getByText("Language")).toBeInTheDocument();
    expect(screen.getByText("SDLC")).toBeInTheDocument();
  });

  it("renders prompts filters when no type is specified", async () => {
    const component = await FilterSidebar({});
    render(component);

    expect(screen.getByText("Interface")).toBeInTheDocument();
    expect(screen.getByText("Agent")).toBeInTheDocument();
    expect(screen.getByText("SDLC")).toBeInTheDocument();
  });
});
