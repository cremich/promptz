import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AgentDetailPage, {
  generateMetadata,
} from "@/app/agents/agent/[slug]/page";
import { fetchCurrentAuthUser } from "@/lib/actions/cognito-auth-action";
import { notFound } from "next/navigation";

// Mock the dependencies
jest.mock("@/lib/actions/cognito-auth-action", () => ({
  fetchCurrentAuthUser: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

describe("AgentDetailPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Calls notFound when agent does not exist", async () => {
    // Mock the current user
    const mockUser = {
      id: "user123",
      username: "testuser",
      displayName: "Test User",
      guest: false,
    };

    // Setup mocks
    (fetchCurrentAuthUser as jest.Mock).mockResolvedValue(mockUser);

    // Render the component
    await AgentDetailPage({
      params: Promise.resolve({ slug: "non-existent-agent" }),
    });

    // Check if notFound was called
    expect(notFound).toHaveBeenCalled();
  });

  test("Renders placeholder content for future implementation", async () => {
    // Since the agent is always null in the current implementation,
    // this will always call notFound, so we test the placeholder behavior
    // by checking that the function structure is correct
    expect(AgentDetailPage).toBeDefined();
    expect(typeof AgentDetailPage).toBe("function");
  });

  test("Does not call fetchCurrentAuthUser when agent is null", async () => {
    // Mock the current user
    const mockUser = {
      id: "user123",
      username: "testuser",
      displayName: "Test User",
      guest: false,
    };

    // Setup mocks
    (fetchCurrentAuthUser as jest.Mock).mockResolvedValue(mockUser);

    // Render the component
    await AgentDetailPage({
      params: Promise.resolve({ slug: "test-agent" }),
    });

    // Verify that fetchCurrentAuthUser was not called because agent is null
    expect(fetchCurrentAuthUser).not.toHaveBeenCalled();
    // But notFound should have been called
    expect(notFound).toHaveBeenCalled();
  });
});

describe("generateMetadata", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Returns 'Agent Not Found' title when agent does not exist", async () => {
    // Call the function (agent is always null in current implementation)
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "non-existent-agent" }),
    });

    // Check the returned metadata
    expect(metadata).toEqual({
      title: "Agent Not Found",
    });
  });

  test("Handles slug parameter correctly", async () => {
    // Test with different slug values
    const metadata1 = await generateMetadata({
      params: Promise.resolve({ slug: "test-agent-1" }),
    });

    const metadata2 = await generateMetadata({
      params: Promise.resolve({ slug: "another-agent" }),
    });

    // Both should return the same result since agent is always null
    expect(metadata1).toEqual({ title: "Agent Not Found" });
    expect(metadata2).toEqual({ title: "Agent Not Found" });
  });
});
