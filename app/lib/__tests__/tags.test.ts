import { describe, expect, test } from "@jest/globals";

import {
  QInterface,
  PromptCategory,
  SdlcActivity,
} from "@/app/lib/definitions";
import {
  getQInterfaceTags,
  getCategoryTags,
  getSdlcTags,
} from "@/app/lib/tags";

describe("Data utility functions", () => {
  describe("getQInterfaceTags", () => {
    test("should convert QInterface enum to array of tags", () => {
      const result = getQInterfaceTags();

      // Verify the result is an array
      expect(Array.isArray(result)).toBe(true);

      // Verify all values from QInterface enum are present
      const qInterfaceValues = Object.values(QInterface).filter(
        (value) => typeof value === "string",
      );
      expect(result).toEqual(expect.arrayContaining(qInterfaceValues));

      // Verify numeric keys are filtered out
      expect(result.some((item) => !isNaN(Number(item)))).toBe(false);
    });
  });

  describe("getCategoryTags", () => {
    test("should convert PromptCategory enum to array of tags", () => {
      const result = getCategoryTags();

      // Verify the result is an array
      expect(Array.isArray(result)).toBe(true);

      // Verify all values from PromptCategory enum are present
      const categoryValues = Object.values(PromptCategory).filter(
        (value) => typeof value === "string",
      );
      expect(result).toEqual(expect.arrayContaining(categoryValues));

      // Verify numeric keys are filtered out
      expect(result.some((item) => !isNaN(Number(item)))).toBe(false);
    });
  });

  describe("getSdlcTags", () => {
    test("should convert SdlcActivity enum to array of tags", () => {
      const result = getSdlcTags();

      // Verify the result is an array
      expect(Array.isArray(result)).toBe(true);

      // Verify all values from SdlcActivity enum are present
      const sdlcValues = Object.values(SdlcActivity).filter(
        (value) => typeof value === "string",
      );
      expect(result).toEqual(expect.arrayContaining(sdlcValues));

      // Verify numeric keys are filtered out
      expect(result.some((item) => !isNaN(Number(item)))).toBe(false);
    });
  });
});
