import { createSelectOptions } from "@/utils/formatters";
import { describe, it, expect } from "vitest";

enum TestPhases {
  Plan = "Plan",
  Requirements = "Requirements",
  Design = "Design",
  Implement = "Implement",
  Test = "Test",
  Deploy = "Deploy",
  Maintain = "Maintain",
}

describe("createSelectOptions", () => {
  it("should create select options from enum", () => {
    const options = createSelectOptions(TestPhases);

    expect(options).toHaveLength(7);
    expect(options[0]).toEqual({
      label: "Plan",
      value: "Plan",
      description:
        "Define project scope, objectives, and feasibility while estimating resources and timelines.",
    });
  });

  it("should exclude specified values", () => {
    const excludeValues = [TestPhases.Plan, TestPhases.Test];
    const options = createSelectOptions(TestPhases, excludeValues);

    expect(options).toHaveLength(5);
    expect(options.some((opt) => opt.value === "Plan")).toBeFalsy();
    expect(options.some((opt) => opt.value === "Test")).toBeFalsy();
  });

  it("should handle empty exclude array", () => {
    const options = createSelectOptions(TestPhases, []);

    expect(options).toHaveLength(7);
  });

  it("should include description for each option", () => {
    const options = createSelectOptions(TestPhases);

    options.forEach((option) => {
      expect(option.description).toBeDefined();
      expect(typeof option.description).toBe("string");
      expect(option.description!.length).toBeGreaterThan(0);
    });
  });
});
