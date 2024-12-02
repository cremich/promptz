import { describe, it, expect, vi, beforeEach } from "vitest";
import sitemap from "../app/sitemap";
import { ServerSideAppsyncRepository } from "@/repositories/ServerSideAppsyncRepository";
import { PromptViewModel } from "@/models/PromptViewModel";
import { PromptViewModelCollection } from "@/models/PromptViewModelCollection";

// Mock the ServerSideAppsyncRepository
vi.mock("@/repositories/ServerSideAppsyncRepository");

describe("sitemap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should generate sitemap entries for all prompts", async () => {
    // Mock the repository response
    const pvm1 = new PromptViewModel();
    const pvm2 = new PromptViewModel();
    const mockPrompts = [pvm1, pvm2];

    vi.mocked(
      ServerSideAppsyncRepository.prototype.listPrompts,
    ).mockResolvedValue(new PromptViewModelCollection(mockPrompts));

    const result = await sitemap();

    // Verify sitemap structure
    expect(result).toEqual([
      {
        url: "https://promptz.dev",
        changeFrequency: "monthly",
        priority: 1,
      },
      {
        url: "https://promptz.dev/browse",
        changeFrequency: "monthly",
        priority: 1,
      },
      {
        url: `https://promptz.dev/prompt/${pvm1.id}`,
        lastModified: pvm1.updatedAt,
        changeFrequency: "monthly",
        priority: 0.8,
      },
      {
        url: `https://promptz.dev/prompt/${pvm2.id}`,
        lastModified: pvm1.updatedAt,
        changeFrequency: "monthly",
        priority: 0.8,
      },
    ]);
  });
});
