import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { PromptGraphQLRepository } from "@/repositories/PromptRepository";
import {
  PromptCategory,
  PromptViewModel,
  SdlcActivity,
} from "@/models/PromptViewModel";
import { usePrompt } from "@/hooks/usePrompt";

vi.mock("@/repositories/PromptRepository");

describe("Test usePrompt hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch prompt data on mount", async () => {
    const mockPrompt = new PromptViewModel();

    vi.mocked(PromptGraphQLRepository.prototype.getPrompt).mockResolvedValue(
      mockPrompt,
    );

    const { result } = renderHook(() => usePrompt("testPromptId"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.promptViewModel).toEqual(mockPrompt);
    });
  });

  it("should handle error when fetching prompt data fails", async () => {
    const error = new Error("Failed to fetch prompt");
    vi.mocked(PromptGraphQLRepository.prototype.getPrompt).mockRejectedValue(
      error,
    );

    const { result } = renderHook(() => usePrompt("testPromptId"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(error);
      expect(result.current.promptViewModel).toBeDefined();
    });
  });
});
