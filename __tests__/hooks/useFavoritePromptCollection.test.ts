import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PromptViewModel } from "@/models/PromptViewModel";
import { UserGraphQLRepository } from "@/repositories/UserRepository";
import { PromptViewModelCollection } from "@/models/PromptViewModelCollection";
import { useFavoritePromptsCollection } from "@/hooks/useFavoritePromptCollection";
import { useAuth } from "@/contexts/AuthContext";
import { UserViewModel } from "@/models/UserViewModel";

vi.mock("@/repositories/UserRepository");
vi.mock("@/contexts/AuthContext");

describe("useFavoritePromptCollection", () => {
  it("should fetch favorite prompts and update state", async () => {
    const mockPrompts = [new PromptViewModel(), new PromptViewModel()];

    vi.mocked(useAuth).mockReturnValue({
      user: UserViewModel.createGuest(),
      logout: vi.fn(),
      fetchUser: vi.fn(),
    });

    vi.mocked(
      UserGraphQLRepository.prototype.getFavoritePrompts,
    ).mockResolvedValue(new PromptViewModelCollection(mockPrompts));

    const { result } = renderHook(() => useFavoritePromptsCollection());

    await waitFor(() => {
      expect(result.current.prompts).toEqual(mockPrompts);
    });
  });
});
