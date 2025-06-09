import { describe, expect, test } from "@jest/globals";
import {
  getToolInterfaceTags,
  getCategoryTags,
  getSdlcTags,
  ToolInterface,
  PromptCategory,
  SdlcActivity,
  ProjectRuleTag,
} from "@/lib/models/tags-model";

describe("tags-model", () => {
  test("getToolInterfaceTags returns all ToolInterface enum values", () => {
    // Act
    const result = getToolInterfaceTags();

    // Assert
    expect(result.length).toBe(Object.keys(ToolInterface).length);
  });

  test("getCategoryTags returns all PromptCategory enum values", () => {
    // Act
    const result = getCategoryTags();

    // Assert
    expect(result.length).toBe(Object.keys(PromptCategory).length);
  });

  test("getSdlcTags returns all SdlcActivity enum values", () => {
    // Act
    const result = getSdlcTags();

    // Assert
    expect(result.length).toBe(Object.keys(SdlcActivity).length);
  });

  test("ProjectRuleTag enum contains expected values", () => {
    // Act
    const projectRuleTags = Object.values(ProjectRuleTag);

    // Assert
    expect(projectRuleTags.length).toBe(Object.keys(ProjectRuleTag).length);
  });
});
