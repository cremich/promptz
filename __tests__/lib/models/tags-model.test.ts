import { describe, expect, test } from "@jest/globals";
import { Tag } from "@/lib/models/tags-model";

describe("tags-model", () => {
  test("Tag type should have correct structure", () => {
    // Arrange
    const mockTag: Tag = {
      name: "Test Tag",
      description: "Test description",
      category: "Test Category",
      promptCount: 5,
      ruleCount: 3,
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-02T00:00:00Z",
    };

    // Assert
    expect(mockTag.name).toBe("Test Tag");
    expect(mockTag.description).toBe("Test description");
    expect(mockTag.category).toBe("Test Category");
    expect(mockTag.promptCount).toBe(5);
    expect(mockTag.ruleCount).toBe(3);
    expect(mockTag.createdAt).toBe("2023-01-01T00:00:00Z");
    expect(mockTag.updatedAt).toBe("2023-01-02T00:00:00Z");
  });

  test("Tag type should work with minimal required fields", () => {
    // Arrange
    const minimalTag: Tag = {
      name: "Minimal Tag",
    };

    // Assert
    expect(minimalTag.name).toBe("Minimal Tag");
    expect(minimalTag.description).toBeUndefined();
    expect(minimalTag.category).toBeUndefined();
    expect(minimalTag.promptCount).toBeUndefined();
    expect(minimalTag.ruleCount).toBeUndefined();
    expect(minimalTag.createdAt).toBeUndefined();
    expect(minimalTag.updatedAt).toBeUndefined();
  });
});
