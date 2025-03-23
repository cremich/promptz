import { describe, expect, test } from "@jest/globals";
import {
  fetchProjectRule,
  fetchProjectRuleBySlug,
  searchProjectRules,
} from "../project-rules";

describe("Project Rules Actions", () => {
  test("fetchProjectRule should return a project rule by ID", async () => {
    const projectRule = await fetchProjectRule("test-id");

    expect(projectRule).toBeDefined();
    expect(projectRule?.id).toBe("test-id-1");
    expect(projectRule?.title).toBe("Test Project Rule 1");
    expect(projectRule?.content).toBe(
      "# Test Content 1\n\nThis is test rule 1.",
    );
    expect(projectRule?.tags).toEqual(["test", "rule"]);
  });

  test("fetchProjectRuleBySlug should return a project rule by slug", async () => {
    const projectRule = await fetchProjectRuleBySlug("test-project-rule-123");

    expect(projectRule).toBeDefined();
    expect(projectRule?.id).toBe("test-id");
    expect(projectRule?.title).toBe("Test Project Rule");
    expect(projectRule?.slug).toBe("test-project-rule-123");
  });

  test("searchProjectRules should return a list of project rules", async () => {
    const result = await searchProjectRules({});

    expect(result.projectRules).toHaveLength(2);
    // Don't test the exact order since it depends on the sort implementation
    expect(result.projectRules.map((rule) => rule.title)).toContain(
      "Test Project Rule 1",
    );
    expect(result.projectRules.map((rule) => rule.title)).toContain(
      "Test Project Rule 2",
    );
  });

  test("searchProjectRules should handle query parameter", async () => {
    const result = await searchProjectRules({ query: "test" });

    expect(result.projectRules).toHaveLength(2);
  });

  test("searchProjectRules should handle tags parameter", async () => {
    const result = await searchProjectRules({ tags: "test" });

    expect(result.projectRules).toHaveLength(2);
  });

  test("searchProjectRules should handle sort parameter", async () => {
    const result = await searchProjectRules({ sort: "created_at:asc" });

    expect(result.projectRules).toHaveLength(2);
    // Should be sorted by created date in ascending order
    expect(result.projectRules[0].id).toBe("test-id-1");
    expect(result.projectRules[1].id).toBe("test-id-2");
  });
});
