import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditAgentPage from "@/app/agents/agent/[slug]/edit/page";
import { fetchCurrentAuthUser } from "@/lib/actions/cognito-auth-action";
import { fetchAgentBySlug } from "@/lib/actions/fetch-agents-action";
import { redirect, notFound } from "next/navigation";
import { Agent } from "@/lib/models/agent-model";
import { Tag } from "@/lib/models/tags-model";

// Mock dependencies
jest.mock("@/lib/actions/cognito-auth-action", () => ({
  fetchCurrentAuthUser: jest.fn(),
}));

jest.mock("@/lib/actions/fetch-agents-action", () => ({
  fetchAgentBySlug: jest.fn(),
}));

jest.mock("@/lib/actions/fetch-tags-action", () => ({
  fetchTagsByCategory: jest.fn().mockResolvedValue([
    {
      name: "Test Tag",
      description: "Test Description",
      category: "Interface",
    },
  ]),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
  notFound: jest.fn(),
}));

// Mock the AgentForm component
jest.mock("@/components/agents/agent-form", () => {
  return function MockAgentForm({
    agent,
    tags,
  }: {
    agent: Agent;
    tags: Tag[];
  }) {
    return (
      <div data-testid="agent-form">
        <div data-testid="agent-name">{agent.name}</div>
        <div data-testid="tags-count">{tags.length}</div>
      </div>
    );
  };
});

describe("EditAgentPage", () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Calls notFound when agent does not exist", async () => {
    // Mock agent not found
    (fetchAgentBySlug as jest.Mock).mockResolvedValue(null);

    // Render the component
    await EditAgentPage({
      params: Promise.resolve({ slug: "non-existent-agent" }),
    });

    // Verify notFound was called
    expect(notFound).toHaveBeenCalled();

    // Verify that fetchCurrentAuthUser was not called
    expect(fetchCurrentAuthUser).not.toHaveBeenCalled();

    // Verify that redirect was not called
    expect(redirect).not.toHaveBeenCalled();
  });

  test("Redirects to agent page when user is not the author", async () => {
    // Mock authenticated user
    (fetchCurrentAuthUser as jest.Mock).mockResolvedValue({
      id: "user-123",
      guest: false,
    });

    // Mock agent with different author
    (fetchAgentBySlug as jest.Mock).mockResolvedValue({
      id: "agent-123",
      name: "Test Agent",
      slug: "test-agent",
      authorId: "different-user-id",
    });

    // Render the component
    await EditAgentPage({
      params: Promise.resolve({ slug: "test-agent" }),
    });

    // Verify redirect was called with agent page path
    expect(redirect).toHaveBeenCalledWith("/agents/agent/test-agent");

    // Verify that notFound was not called
    expect(notFound).not.toHaveBeenCalled();
  });

  test("Redirects to agent page when user is guest", async () => {
    // Mock guest user
    (fetchCurrentAuthUser as jest.Mock).mockResolvedValue({
      id: "user-123",
      guest: true,
    });

    // Mock agent
    (fetchAgentBySlug as jest.Mock).mockResolvedValue({
      id: "agent-123",
      name: "Test Agent",
      slug: "test-agent",
      authorId: "user-123",
    });

    // Render the component
    await EditAgentPage({
      params: Promise.resolve({ slug: "test-agent" }),
    });

    // Verify redirect was called with agent page path
    expect(redirect).toHaveBeenCalledWith("/agents/agent/test-agent");

    // Verify that notFound was not called
    expect(notFound).not.toHaveBeenCalled();
  });

  test("Handles authorId with :: separator correctly", async () => {
    // Mock authenticated user
    (fetchCurrentAuthUser as jest.Mock).mockResolvedValue({
      id: "user-123",
      guest: false,
    });

    // Mock agent with authorId containing :: separator
    (fetchAgentBySlug as jest.Mock).mockResolvedValue({
      id: "agent-123",
      name: "Test Agent",
      slug: "test-agent",
      authorId: "user-123::some-additional-info",
    });

    // Render the component
    const result = await EditAgentPage({
      params: Promise.resolve({ slug: "test-agent" }),
    });
    render(result);

    // Verify the form is rendered (user should be authorized)
    expect(screen.getByTestId("agent-form")).toBeInTheDocument();
    expect(screen.getByTestId("agent-name")).toHaveTextContent("Test Agent");

    // Verify that redirect was not called
    expect(redirect).not.toHaveBeenCalled();
    expect(notFound).not.toHaveBeenCalled();
  });

  test("Renders the agent form when user is the author", async () => {
    // Mock authenticated user
    const mockUser = {
      id: "user-123",
      guest: false,
    };
    (fetchCurrentAuthUser as jest.Mock).mockResolvedValue(mockUser);

    // Mock agent with same author
    const mockAgent: Agent = {
      id: "agent-123",
      name: "Test Agent",
      slug: "test-agent",
      authorId: "user-123",
      description: "A test agent for development",
      prompt: "You are a helpful development assistant",
      tools: ["fs_read", "fs_write"],
      scope: "PUBLIC",
    };
    (fetchAgentBySlug as jest.Mock).mockResolvedValue(mockAgent);

    // Render the component
    const result = await EditAgentPage({
      params: Promise.resolve({ slug: "test-agent" }),
    });
    render(result);

    // Verify the form is rendered with the agent data
    expect(screen.getByTestId("agent-form")).toBeInTheDocument();
    expect(screen.getByTestId("agent-name")).toHaveTextContent("Test Agent");

    // Verify page title and description are rendered
    expect(screen.getByText("Edit Agent")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Update your Amazon Q Developer CLI agent configuration.",
      ),
    ).toBeInTheDocument();

    // Verify that redirect was not called
    expect(redirect).not.toHaveBeenCalled();
    expect(notFound).not.toHaveBeenCalled();
  });
});
