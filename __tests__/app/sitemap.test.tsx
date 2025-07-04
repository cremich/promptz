import { describe, expect, test } from "@jest/globals";
import sitemap from "@/app/sitemap";

// Mock the getAllTags function
jest.mock("@/lib/actions/fetch-tags-action", () => ({
  getAllTags: jest
    .fn()
    .mockResolvedValue(["TypeScript", "React", "AWS", "Security"]),
}));

// Mock the AWS Amplify API client
jest.mock("@aws-amplify/adapter-nextjs/api", () => ({
  generateServerClientUsingCookies: jest.fn(() => ({
    queries: {
      searchPrompts: jest.fn().mockImplementation(({ nextToken }) => {
        // First page of results
        if (!nextToken) {
          return {
            data: {
              results: [
                {
                  slug: "test-prompt-1",
                  updatedAt: "2023-01-01T12:00:00Z",
                },
                {
                  slug: "test-prompt-2",
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
                slug: "test-prompt-3",
                updatedAt: "2023-01-03T12:00:00Z",
              },
            ],
            nextToken: null,
          },
        };
      }),
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
    },
  })),
}));

// Mock the next/headers module
jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

// Mock the amplify_outputs.json import
jest.mock("../amplify_outputs.json", () => ({}), { virtual: true });

describe("Sitemap", () => {
  test("Returns correct sitemap structure with all routes including tags", async () => {
    const sitemapData = await sitemap();

    // Check if the sitemap has the correct number of entries
    // 2 weekly routes + 3 prompts + 4 tag routes + 1 monthly route = 10
    expect(sitemapData).toHaveLength(11);

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

    // Check prompt routes
    const promptRoute1 = sitemapData.find(
      (route) =>
        route.url === "https://promptz.dev/prompts/prompt/test-prompt-1",
    );
    expect(promptRoute1).toBeDefined();
    expect(promptRoute1?.lastModified).toBe("2023-01-01T12:00:00Z");
    expect(promptRoute1?.changeFrequency).toBe("monthly");
    expect(promptRoute1?.priority).toBe(1);

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

  test("Handles pagination correctly when fetching prompts", async () => {
    const sitemapData = await sitemap();

    // Check if all prompts from both pages are included
    const promptRoutes = sitemapData.filter((route) =>
      route.url.startsWith("https://promptz.dev/prompts/prompt/"),
    );
    expect(promptRoutes).toHaveLength(3);

    // Verify the last prompt from the second page is included
    const lastPromptRoute = sitemapData.find(
      (route) =>
        route.url === "https://promptz.dev/prompts/prompt/test-prompt-3",
    );
    expect(lastPromptRoute).toBeDefined();
    expect(lastPromptRoute?.lastModified).toBe("2023-01-03T12:00:00Z");
  });

  test("Includes all expected tag routes", async () => {
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

  test("Handles URL encoding for tag routes", async () => {
    // Mock getAllTags to return tags that need encoding
    const { getAllTags } = require("@/lib/actions/fetch-tags-action");
    getAllTags.mockResolvedValueOnce(["Next.js", "C++", "Node.js"]);

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

  test("Handles empty tags array gracefully", async () => {
    // Mock getAllTags to return empty array
    const { getAllTags } = require("@/lib/actions/fetch-tags-action");
    getAllTags.mockResolvedValueOnce([]);

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
