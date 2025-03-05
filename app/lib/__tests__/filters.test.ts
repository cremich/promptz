import {
  getCaseVariations,
  buildTextSearchFilter,
  buildTagFilter,
} from "@/app/lib/filters";
import { describe, expect, test } from "@jest/globals";

describe("getCaseVariations", () => {
  test("should return three variations of the input text", () => {
    const input = "hello";
    const variations = getCaseVariations(input);

    expect(variations).toHaveLength(3);
    expect(variations).toEqual(["hello", "HELLO", "Hello"]);
  });

  test("should handle empty string", () => {
    const variations = getCaseVariations("");

    expect(variations).toHaveLength(3);
    expect(variations).toEqual(["", "", ""]);
  });

  test("should handle single character", () => {
    const variations = getCaseVariations("a");

    expect(variations).toEqual(["a", "A", "A"]);
  });
});

describe("buildTextSearchFilter", () => {
  test("should create a filter condition with case variations for name and description", () => {
    const query = "test";
    const filter = buildTextSearchFilter(query);

    expect(filter).toEqual({
      or: [
        { name: { contains: "test" } },
        { description: { contains: "test" } },
        { name: { contains: "TEST" } },
        { description: { contains: "TEST" } },
        { name: { contains: "Test" } },
        { description: { contains: "Test" } },
      ],
    });
  });

  test("should handle empty query string", () => {
    const filter = buildTextSearchFilter("");

    expect(filter).toEqual({
      or: [
        { name: { contains: "" } },
        { description: { contains: "" } },
        { name: { contains: "" } },
        { description: { contains: "" } },
        { name: { contains: "" } },
        { description: { contains: "" } },
      ],
    });
  });
});

describe("buildTagFilter", () => {
  test("should create filter condition for a single tag string", () => {
    const tag = "javascript";
    const filter = buildTagFilter(tag);

    expect(filter).toEqual([{ tags: { contains: "javascript" } }]);
  });

  test("should create filter conditions for multiple tags", () => {
    const tags = ["javascript", "typescript"];
    const filter = buildTagFilter(tags);

    expect(filter).toEqual([
      { tags: { contains: "javascript" } },
      { tags: { contains: "typescript" } },
    ]);
  });

  test("should handle empty tag array", () => {
    const filter = buildTagFilter([]);

    expect(filter).toEqual([]);
  });

  test("should handle empty tag string", () => {
    const filter = buildTagFilter("");

    expect(filter).toEqual([{ tags: { contains: "" } }]);
  });
});
