import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { usePromptCollection } from "@/hooks/usePromptCollection";
import { PromptGraphQLRepository } from "@/repositories/PromptRepository";
import { PromptCategory, PromptViewModel, SdlcPhase } from "@/models/PromptViewModel";
import { PromptViewModelCollection } from "@/models/PromptViewModelCollection";

vi.mock("@/repositories/PromptRepository");

describe("usePromptCollection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch prompts and update state", async () => {
    const mockPrompts = [new PromptViewModel(), new PromptViewModel()];
    vi.mocked(PromptGraphQLRepository.prototype.listPrompts).mockResolvedValue(
      new PromptViewModelCollection(mockPrompts)
    );

    const { result } = renderHook(() => usePromptCollection());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.prompts).toEqual(mockPrompts);
      expect(result.current.error).toBe(null);
    });
  });

  it("should handle errors when fetching prompts", async () => {
    const mockError = new Error("Failed to fetch prompts");
    vi.mocked(PromptGraphQLRepository.prototype.listPrompts).mockRejectedValue(mockError);

    const { result } = renderHook(() => usePromptCollection());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.prompts).toEqual([]);
      expect(result.current.error).toBe(mockError);
    });
  });

  it("should respect the limit parameter", async () => {
    const limit = 5;
    const mockPrompts = Array(limit)
      .fill(null)
      .map((_, index) => new PromptViewModel());
    vi.mocked(PromptGraphQLRepository.prototype.listPrompts).mockResolvedValue(
      new PromptViewModelCollection(mockPrompts)
    );

    const { result } = renderHook(() => usePromptCollection(limit));

    await waitFor(() => {
      expect(result.current.prompts).toHaveLength(limit);
      expect(PromptGraphQLRepository.prototype.listPrompts).toHaveBeenCalledWith(limit);
    });
  });

  it("should not make unnecessary API calls on re-render", async () => {
    const mockPrompts = [new PromptViewModel(), new PromptViewModel()];
    vi.mocked(PromptGraphQLRepository.prototype.listPrompts).mockResolvedValue(
      new PromptViewModelCollection(mockPrompts)
    );

    const { result, rerender } = renderHook(() => usePromptCollection());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(PromptGraphQLRepository.prototype.listPrompts).toHaveBeenCalledTimes(1);

    rerender();

    expect(PromptGraphQLRepository.prototype.listPrompts).toHaveBeenCalledTimes(1);
  });
});
