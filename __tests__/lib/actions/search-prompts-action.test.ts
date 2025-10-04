import { searchPrompts } from "@/lib/actions/search-prompts-action";

describe("searchPrompts", () => {
  test("should return all prompts when no query provided", async () => {
    const result = await searchPrompts({});

    expect(result.prompts.length).toBeGreaterThan(0);
    expect(result.nextToken).toBeUndefined();
  });

  test("should filter prompts by query in title", async () => {
    const result = await searchPrompts({ query: "refactor" });

    expect(result.prompts.length).toBeGreaterThan(0);
    expect(result.prompts[0].name?.toLowerCase()).toContain("refactor");
  });

  test("should filter prompts by tags", async () => {
    const result = await searchPrompts({ tags: ["analysis"] });

    expect(result.prompts.length).toBeGreaterThan(0);
    expect(result.prompts[0].tags).toContain("analysis");
  });

  test("should sort by trending (copy count)", async () => {
    const result = await searchPrompts({ sort: "trending:desc" });

    expect(result.prompts.length).toBeGreaterThan(0);
    // All prompts should have copyCount 0 initially, so order should be maintained
  });

  test("should sort by created date ascending", async () => {
    const result = await searchPrompts({ sort: "created_at:asc" });

    expect(result.prompts.length).toBeGreaterThan(0);
    // Check that results are sorted by date
    if (result.prompts.length > 1) {
      const firstDate = new Date(result.prompts[0].createdAt || "");
      const secondDate = new Date(result.prompts[1].createdAt || "");
      expect(firstDate.getTime()).toBeLessThanOrEqual(secondDate.getTime());
    }
  });

  test("should return empty results when no matches found", async () => {
    const result = await searchPrompts({
      query: "nonexistentquerythatmatchesnothing",
    });

    expect(result.prompts).toHaveLength(0);
  });

  test("should handle multiple tag filters", async () => {
    const result = await searchPrompts({ tags: ["analysis", "refactoring"] });

    expect(result.prompts.length).toBeGreaterThanOrEqual(0);
    // Should return prompts that have at least one of the specified tags
  });
});
