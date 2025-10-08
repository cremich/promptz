import { fetchPromptBySlug } from "@/lib/actions/fetch-prompts-action";

describe("fetchPromptBySlug", () => {
  test("should return prompt when slug exists", async () => {
    // Use a real slug from the generated index
    const result = await fetchPromptBySlug("12-factor-refactoring-dac01c8d");

    expect(result).toBeDefined();
    expect(result?.slug).toBe("12-factor-refactoring-dac01c8d");
    expect(result?.name).toBe("12-factor refactoring");
    expect(result?.author).toBe("cremich");
    expect(result?.tags).toContain("analysis");
  });

  test("should return undefined when slug does not exist", async () => {
    const result = await fetchPromptBySlug("non-existent-slug");

    expect(result).toBeUndefined();
  });

  test("should return prompt with all required fields", async () => {
    const result = await fetchPromptBySlug("12-factor-refactoring-dac01c8d");

    expect(result).toBeDefined();
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("slug");
    expect(result).toHaveProperty("name");
    expect(result).toHaveProperty("description");
    expect(result).toHaveProperty("tags");
    expect(result).toHaveProperty("content");
    expect(result).toHaveProperty("author");
    expect(result).toHaveProperty("scope");
    expect(result).toHaveProperty("createdAt");
    expect(result).toHaveProperty("updatedAt");
  });
});
