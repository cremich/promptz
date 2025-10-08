import { describe, expect, test, beforeEach } from "@jest/globals";

// Mock the dependencies
jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

jest.mock("@aws-amplify/adapter-nextjs/api", () => ({
  generateServerClientUsingCookies: jest.fn(),
}));

jest.mock("@/lib/actions/fetch-tags-action", () => ({
  getAllTags: jest.fn(),
}));

jest.mock("../../amplify_outputs.json", () => ({}), { virtual: true });

describe("sitemap", () => {
  let mockAppsync: any;
  let getAllTags: jest.MockedFunction<any>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules(); // Clear module cache to ensure fresh imports

    // Mock the appsync client with default implementations
    mockAppsync = {
      queries: {
        searchProjectRules: jest.fn().mockImplementation(({ nextToken }) => {
          // First page of results
          if (!nextToken) {
            return {
              data: {
                results: [
                  {
                    slug: "test-rule-1",
                    updatedAt: "2023-01-01T12:00:00Z",
                  },
                  {
                    slug: "test-rule-2",
                    updatedAt: "2023-01-02T12:00:00Z",
                  },
                ],
                nextToken: "next-page-token",
              },
            };
          }
          // Second page of results (last page)
          return {
            data: {
              results: [
                {
                  slug: "test-rule-3",
                  updatedAt: "2023-01-03T12:00:00Z",
                },
              ],
              nextToken: null,
            },
          };
        }),
        searchAgents: jest.fn().mockImplementation(({ nextToken }) => {
          // First page of results
          if (!nextToken) {
            return {
              data: {
                results: [
                  {
                    slug: "test-agent-1",
                    updatedAt: "2023-01-01T12:00:00Z",
                  },
                  {
                    slug: "test-agent-2",
                    updatedAt: "2023-01-02T12:00:00Z",
                  },
                ],
                nextToken: "next-page-token",
              },
            };
          }
          // Second page of results (last page)
          return {
            data: {
              results: [
                {
                  slug: "test-agent-3",
                  updatedAt: "2023-01-03T12:00:00Z",
                },
              ],
              nextToken: null,
            },
          };
        }),
      },
    };

    const {
      generateServerClientUsingCookies,
    } = require("@aws-amplify/adapter-nextjs/api");
    generateServerClientUsingCookies.mockReturnValue(mockAppsync);

    getAllTags = require("@/lib/actions/fetch-tags-action").getAllTags;
    getAllTags.mockResolvedValue(["TypeScript", "React", "AWS", "Security"]);
  });

  test("returns correct sitemap structure with all routes including agents", async () => {
    // Import sitemap function after mocks are set up
    const sitemap = (await import("@/app/sitemap")).default;
    const sitemapData = await sitemap();

    // Check that sitemap has a reasonable number of entries (should be > 10)
    expect(sitemapData.length).toBeGreaterThan(10);

    // Check weekly routes
    const homeRoute = sitemapData.find(
      (route) => route.url === "https://promptz.dev",
    );
    expect(homeRoute).toBeDefined();
    expect(homeRoute?.changeFrequency).toBe("weekly");
    expect(homeRoute?.priority).toBe(0.7);

    const promptsRoute = sitemapData.find(
      (route) => route.url === "https://promptz.dev/prompts",
    );
    expect(promptsRoute).toBeDefined();
    expect(promptsRoute?.changeFrequency).toBe("weekly");
    expect(promptsRoute?.priority).toBe(0.7);

    const agentsRoute = sitemapData.find(
      (route) => route.url === "https://promptz.dev/agents",
    );
    expect(agentsRoute).toBeDefined();
    expect(agentsRoute?.changeFrequency).toBe("weekly");
    expect(agentsRoute?.priority).toBe(0.7);

    // Check that prompt routes exist and have correct structure
    const promptRoutes = sitemapData.filter((route) =>
      route.url.includes("/prompts/prompt/"),
    );
    expect(promptRoutes.length).toBeGreaterThan(0);

    // Verify first prompt route has correct structure
    expect(promptRoutes[0]).toEqual(
      expect.objectContaining({
        url: expect.stringMatching(
          /^https:\/\/promptz\.dev\/prompts\/prompt\/.+/,
        ),
        lastModified: expect.any(String),
        changeFrequency: "monthly",
        priority: 1,
      }),
    );

    // Check agent routes
    const agentRoute1 = sitemapData.find(
      (route) => route.url === "https://promptz.dev/agents/agent/test-agent-1",
    );
    expect(agentRoute1).toBeDefined();
    expect(agentRoute1?.lastModified).toBe("2023-01-01T12:00:00Z");
    expect(agentRoute1?.changeFrequency).toBe("monthly");
    expect(agentRoute1?.priority).toBe(1);

    // Check tag routes
    const tagRoutes = sitemapData.filter((route) =>
      route.url.includes("/tag/"),
    );
    expect(tagRoutes).toHaveLength(4); // 4 tags from mock

    const typescriptTagRoute = sitemapData.find(
      (route) => route.url === "https://promptz.dev/tag/TypeScript",
    );
    expect(typescriptTagRoute).toBeDefined();
    expect(typescriptTagRoute?.changeFrequency).toBe("monthly");
    expect(typescriptTagRoute?.priority).toBe(0.8);

    // Check monthly routes
    const mcpRoute = sitemapData.find(
      (route) => route.url === "https://promptz.dev/mcp",
    );
    expect(mcpRoute).toBeDefined();
    expect(mcpRoute?.changeFrequency).toBe("monthly");
    expect(mcpRoute?.priority).toBe(0.3);
  });

  test("includes agent routes in sitemap", async () => {
    // Override mocks for this specific test
    mockAppsync.queries.searchProjectRules.mockResolvedValue({
      data: {
        results: [
          {
            slug: "test-rule",
            updatedAt: "2024-01-01T00:00:00Z",
          },
        ],
        nextToken: null,
      },
    });

    mockAppsync.queries.searchAgents.mockResolvedValue({
      data: {
        results: [
          {
            slug: "test-agent",
            updatedAt: "2024-01-01T00:00:00Z",
          },
        ],
        nextToken: null,
      },
    });

    const sitemap = (await import("@/app/sitemap")).default;
    const result = await sitemap();

    // Verify agent routes are included
    const agentRoutes = result.filter((route) =>
      route.url.includes("/agents/agent/"),
    );

    expect(agentRoutes).toHaveLength(1);
    expect(agentRoutes[0]).toEqual({
      url: "https://promptz.dev/agents/agent/test-agent",
      lastModified: "2024-01-01T00:00:00Z",
      changeFrequency: "monthly",
      priority: 1,
    });
  });

  test("handles pagination correctly when fetching all content types", async () => {
    const sitemap = (await import("@/app/sitemap")).default;
    const sitemapData = await sitemap();

    // Check that prompts from markdown index are included
    const promptRoutes = sitemapData.filter((route) =>
      route.url.startsWith("https://promptz.dev/prompts/prompt/"),
    );
    expect(promptRoutes.length).toBeGreaterThan(10); // Should have many prompts from markdown

    // Check if all rules from both pages are included
    const ruleRoutes = sitemapData.filter((route) =>
      route.url.startsWith("https://promptz.dev/rules/rule/"),
    );
    expect(ruleRoutes).toHaveLength(3);

    // Check if all agents from both pages are included
    const agentRoutes = sitemapData.filter((route) =>
      route.url.startsWith("https://promptz.dev/agents/agent/"),
    );
    expect(agentRoutes).toHaveLength(3);

    // Verify that all prompt routes have the correct structure
    promptRoutes.forEach((route) => {
      expect(route).toEqual(
        expect.objectContaining({
          url: expect.stringMatching(
            /^https:\/\/promptz\.dev\/prompts\/prompt\/.+/,
          ),
          lastModified: expect.any(String),
          changeFrequency: "monthly",
          priority: 1,
        }),
      );
    });

    const lastAgentRoute = sitemapData.find(
      (route) => route.url === "https://promptz.dev/agents/agent/test-agent-3",
    );
    expect(lastAgentRoute).toBeDefined();
    expect(lastAgentRoute?.lastModified).toBe("2023-01-03T12:00:00Z");
  });

  test("handles pagination for agents search", async () => {
    // Override mocks for empty rules
    mockAppsync.queries.searchProjectRules.mockResolvedValue({
      data: { results: [], nextToken: null },
    });

    // First call returns results with nextToken
    mockAppsync.queries.searchAgents
      .mockResolvedValueOnce({
        data: {
          results: [
            {
              slug: "agent-1",
              updatedAt: "2024-01-01T00:00:00Z",
            },
          ],
          nextToken: "token123",
        },
      })
      // Second call returns more results without nextToken
      .mockResolvedValueOnce({
        data: {
          results: [
            {
              slug: "agent-2",
              updatedAt: "2024-01-02T00:00:00Z",
            },
          ],
          nextToken: null,
        },
      });

    const sitemap = (await import("@/app/sitemap")).default;
    const result = await sitemap();

    // Verify both agents are included
    const agentRoutes = result.filter((route) =>
      route.url.includes("/agents/agent/"),
    );

    expect(agentRoutes).toHaveLength(2);
    expect(agentRoutes).toContainEqual({
      url: "https://promptz.dev/agents/agent/agent-1",
      lastModified: "2024-01-01T00:00:00Z",
      changeFrequency: "monthly",
      priority: 1,
    });
    expect(agentRoutes).toContainEqual({
      url: "https://promptz.dev/agents/agent/agent-2",
      lastModified: "2024-01-02T00:00:00Z",
      changeFrequency: "monthly",
      priority: 1,
    });

    // Verify searchAgents was called twice for pagination
    expect(mockAppsync.queries.searchAgents).toHaveBeenCalledTimes(2);
    expect(mockAppsync.queries.searchAgents).toHaveBeenNthCalledWith(1, {
      nextToken: undefined,
    });
    expect(mockAppsync.queries.searchAgents).toHaveBeenNthCalledWith(2, {
      nextToken: "token123",
    });
  });

  test("uses markdown prompts instead of API calls", async () => {
    // This test verifies that the sitemap is using markdown prompts from the index
    // rather than making API calls to searchPrompts
    const sitemap = (await import("@/app/sitemap")).default;
    const sitemapData = await sitemap();

    // Should have prompt routes from markdown index
    const promptRoutes = sitemapData.filter((route) =>
      route.url.includes("/prompts/prompt/"),
    );
    expect(promptRoutes.length).toBeGreaterThan(0);

    // Verify that searchPrompts was never called (since we removed it from mockAppsync)
    // If the sitemap was still using API calls, this test would fail because
    // mockAppsync.queries.searchPrompts is undefined
    expect(mockAppsync.queries.searchPrompts).toBeUndefined();
  });

  test("includes all expected tag routes", async () => {
    const sitemap = (await import("@/app/sitemap")).default;
    const sitemapData = await sitemap();

    // Check if all mocked tags are included
    const expectedTags = ["TypeScript", "React", "AWS", "Security"];
    expectedTags.forEach((tag) => {
      const tagRoute = sitemapData.find(
        (route) => route.url === `https://promptz.dev/tag/${tag}`,
      );
      expect(tagRoute).toBeDefined();
      expect(tagRoute?.changeFrequency).toBe("monthly");
      expect(tagRoute?.priority).toBe(0.8);
    });
  });

  test("handles URL encoding for tag routes", async () => {
    // Mock getAllTags to return tags that need encoding
    getAllTags.mockResolvedValueOnce(["Next.js", "C++", "Node.js"]);

    const sitemap = (await import("@/app/sitemap")).default;
    const sitemapData = await sitemap();

    // Check if encoded tag routes are included
    const nextjsRoute = sitemapData.find(
      (route) => route.url === "https://promptz.dev/tag/Next.js",
    );
    expect(nextjsRoute).toBeDefined();

    const cppRoute = sitemapData.find(
      (route) => route.url === "https://promptz.dev/tag/C++",
    );
    expect(cppRoute).toBeDefined();
  });

  test("handles empty tags array gracefully", async () => {
    // Mock getAllTags to return empty array
    getAllTags.mockResolvedValueOnce([]);

    const sitemap = (await import("@/app/sitemap")).default;
    const sitemapData = await sitemap();

    // Check that no tag routes are included
    const tagRoutes = sitemapData.filter((route) =>
      route.url.includes("/tag/"),
    );
    expect(tagRoutes).toHaveLength(0);

    // But other routes should still be present
    expect(sitemapData.length).toBeGreaterThan(0);
  });
});
