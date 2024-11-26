import {
  createSelectOptions,
  switchCategories,
  IDEPromptCategory,
  CLIPromptCategory,
  ConsolePromptCateogry,
} from "@/utils/formatters";
import { QInterface, PromptCategory } from "@/models/PromptViewModel";
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

describe("switchCategories", () => {
  it("should return IDE categories when interface is IDE", () => {
    const options = switchCategories(QInterface.IDE);
    expect(options).toEqual(createSelectOptions(IDEPromptCategory));
    expect(options.map((o) => o.value)).toEqual(
      Object.values(IDEPromptCategory),
    );
  });

  it("should return CLI categories when interface is CLI", () => {
    const options = switchCategories(QInterface.CLI);
    expect(options).toEqual(createSelectOptions(CLIPromptCategory));
    expect(options.map((o) => o.value)).toEqual(
      Object.values(CLIPromptCategory),
    );
  });

  it("should return Console categories when interface is CONSOLE", () => {
    const options = switchCategories(QInterface.CONSOLE);
    expect(options).toEqual(createSelectOptions(ConsolePromptCateogry));
    expect(options.map((o) => o.value)).toEqual(
      Object.values(ConsolePromptCateogry),
    );
  });

  it("should return filtered PromptCategory options for unknown interface", () => {
    const options = switchCategories("unknown" as QInterface);
    expect(options).toEqual(
      createSelectOptions(PromptCategory, [PromptCategory.UNKNOWN]),
    );
    expect(options.map((o) => o.value)).not.toContain(PromptCategory.UNKNOWN);
  });
});

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
