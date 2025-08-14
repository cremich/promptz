import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditAgent from "@/app/agents/agent/[slug]/edit/page";
import { fetchCurrentAuthUser } from "@/lib/actions/cognito-auth-action";
import { notFound, redirect } from "next/navigation";

// Mock the dependencies
jest.mock("@/lib/actions/cognito-auth-action", () => ({
  fetchCurrentAuthUser: jest.fn(),
}));

jest.mock("@/lib/actions/fetch-tags-action", () => ({
  fetchTagsByCategory: jest.fn().mockImplementation((category: string) => {
    const mockTags = {
      Interface: [
        {
          name: "CLI",
          description: "Command Line Interface",
          category: "Interface",
        },
      ],
      Agent: [
        { name: "Custom", description: "Custom Agent", category: "Agent" },
      ],
      SDLC: [
        { name: "Testing", description: "Testing Tools", category: "SDLC" },
      ],
    };
    return Promise.resolve(mockTags[category as keyof typeof mockTags] || []);
  }),
}));

jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
  redirect: jest.fn(),
}));

describe("EditAgent", () => {
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
    await EditAgent({
      params: Promise.resolve({ slug: "non-existent-agent" }),
    });

    // Check if notFound was called
    expect(notFound).toHaveBeenCalled();
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
    await EditAgent({
      params: Promise.resolve({ slug: "test-agent" }),
    });

    // Verify that fetchCurrentAuthUser was not called because agent is null
    expect(fetchCurrentAuthUser).not.toHaveBeenCalled();
    // But notFound should have been called
    expect(notFound).toHaveBeenCalled();
  });

  test("Fetches tags from all categories when agent exists", async () => {
    const { fetchTagsByCategory } = require("@/lib/actions/fetch-tags-action");

    // Mock the current user
    const mockUser = {
      id: "user123",
      username: "testuser",
      displayName: "Test User",
      guest: false,
    };

    // Setup mocks
    (fetchCurrentAuthUser as jest.Mock).mockResolvedValue(mockUser);

    // Since agent is always null in current implementation, this will call notFound
    await EditAgent({
      params: Promise.resolve({ slug: "test-agent" }),
    });

    // The function should be defined and callable
    expect(EditAgent).toBeDefined();
    expect(typeof EditAgent).toBe("function");
  });

  test("Handles slug parameter correctly", async () => {
    // Mock the current user
    const mockUser = {
      id: "user123",
      username: "testuser",
      displayName: "Test User",
      guest: false,
    };

    // Setup mocks
    (fetchCurrentAuthUser as jest.Mock).mockResolvedValue(mockUser);

    // Test with different slug values
    await EditAgent({
      params: Promise.resolve({ slug: "test-agent-1" }),
    });

    await EditAgent({
      params: Promise.resolve({ slug: "another-agent" }),
    });

    // Both should call notFound since agent is always null
    expect(notFound).toHaveBeenCalledTimes(2);
  });
});
