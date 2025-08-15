import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AgentDetailPage, {
  generateMetadata,
} from "@/app/agents/agent/[slug]/page";
import { notFound } from "next/navigation";
import { Agent } from "@/lib/models/agent-model";
import { fetchCurrentAuthUser } from "@/lib/actions/cognito-auth-action";
import { fetchAgentBySlug } from "@/lib/actions/fetch-agents-action";
import { User } from "@/lib/models/user-model";

// Mock the server actions
jest.mock("@/lib/actions/fetch-agents-action", () => ({
  fetchAgentBySlug: jest.fn(),
}));

jest.mock("@/lib/actions/cognito-auth-action", () => ({
  fetchCurrentAuthUser: jest.fn(),
}));

// Mock the AgentDetail component
jest.mock("@/components/agents/agent-detail", () => {
  return function MockAgentDetail({
    agent,
    isOwner,
  }: {
    agent: any;
    isOwner: boolean;
  }) {
    return (
      <div data-testid="agent-detail">
        <div data-testid="agent-name">{agent.name}</div>
        <div data-testid="is-owner">{isOwner ? "Owner" : "Not Owner"}</div>
      </div>
    );
  };
});

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

describe("AgentDetailPage", () => {
  const mockAgent: Agent = {
    id: "agent-1",
    name: "Test Agent",
    slug: "test-agent",
    description: "A test agent",
    authorId: "user-1::additional-info",
  };

  const mockCurrentUser: User = {
    id: "user-1",
    guest: false,
    displayName: "Test User",
    username: "XXXXXXXXX",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Renders agent detail when agent exists", async () => {
    (fetchAgentBySlug as jest.Mock).mockResolvedValue(mockAgent);
    (fetchCurrentAuthUser as jest.Mock).mockResolvedValue(mockCurrentUser);

    const params = Promise.resolve({ slug: "test-agent" });
    const component = await AgentDetailPage({ params });

    render(component);

    expect(screen.getByTestId("agent-detail")).toBeInTheDocument();
    expect(screen.getByTestId("agent-name")).toHaveTextContent("Test Agent");
    expect(screen.getByTestId("is-owner")).toHaveTextContent("Owner");
  });

  test("Shows not found when agent does not exist", async () => {
    (fetchAgentBySlug as jest.Mock).mockResolvedValue(null);
    (fetchCurrentAuthUser as jest.Mock).mockResolvedValue(mockCurrentUser);

    const params = Promise.resolve({ slug: "non-existent-agent" });
    await AgentDetailPage({ params });

    expect(notFound).toHaveBeenCalled();
  });
});

describe("generateMetadata", () => {
  test("Generates metadata for existing agent", async () => {
    (fetchAgentBySlug as jest.Mock).mockResolvedValue({
      name: "Test Agent",
      description: "A test agent for testing",
    });

    const params = Promise.resolve({ slug: "test-agent" });
    const metadata = await generateMetadata({ params });

    expect(metadata).toEqual({
      title: "Test Agent agent for Amazon Q Developer",
      description: "A test agent for testing",
      openGraph: {
        title: "Test Agent agent for Amazon Q Developer",
        description: "A test agent for testing",
      },
    });
  });

  test("Generates not found metadata for non-existent agent", async () => {
    (fetchAgentBySlug as jest.Mock).mockResolvedValue(null);

    const params = Promise.resolve({ slug: "non-existent-agent" });
    const metadata = await generateMetadata({ params });

    expect(metadata).toEqual({
      title: "Agent Not Found",
    });
  });
});
