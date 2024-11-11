import { describe, expect, it, vi } from "vitest";
import {
  PromptViewModel,
  SdlcPhase,
  PromptCategory,
} from "../../models/PromptViewModel";
import { UserViewModel } from "../../models/UserViewModel";
import { PromptFormInputs } from "@/components/PromptForm";
import { PromptRepository } from "@/repositories/PromptRepository";
import { DraftRepository } from "@/repositories/DraftRepository";

const createPromptMock = vi.fn();
const saveDraftMock = vi.fn();
const updatePromptMock = vi.fn();

const mockRepository: PromptRepository = {
  createPrompt: createPromptMock,
  getPrompt: vi.fn(),
  listPrompts: vi.fn(),
  updatePrompt: updatePromptMock,
  deletePrompt: vi.fn(),
};

const mockDraftRepository: DraftRepository = {
  saveDraft: saveDraftMock,
  getDraft: vi.fn(),
  deleteDraft: vi.fn(),
  getAllDrafts: vi.fn(),
  hasDraft: vi.fn(),
};

const schemaPrompt = {
  id: "1",
  name: "Test Prompt",
  description: "A test prompt",
  sdlc_phase: "Design",
  category: "Chat",
  instruction: "Test instruction",
  owner_username: "testuser",
  owner: "user123",
  createdAt: "",
  updatedAt: "",
};

describe("PromptViewModel", () => {
  it("should create a PromptViewModel instance from a schema object", () => {
    const promptViewModel = PromptViewModel.fromSchema(schemaPrompt);

    expect(promptViewModel.id).toBe(schemaPrompt.id);
    expect(promptViewModel.name).toBe(schemaPrompt.name);
    expect(promptViewModel.description).toBe(schemaPrompt.description);
    expect(promptViewModel.sdlcPhase).toBe(SdlcPhase.DESIGN);
    expect(promptViewModel.category).toBe(PromptCategory.CHAT);
    expect(promptViewModel.instruction).toBe(schemaPrompt.instruction);
  });

  it("should throw an error if the schema object has no owner", () => {
    const schemaPrompt = {
      id: "1",
      name: "Test Prompt",
      description: "A test prompt",
      sdlc_phase: "DESIGN",
      category: "CHAT",
      instruction: "Test instruction",
      owner_username: "testuser",
      createdAt: "",
      updatedAt: "",
    };

    expect(() => PromptViewModel.fromSchema(schemaPrompt)).toThrow(
      "Prompt has no owner",
    );
  });

  it("should return true if the user is the owner of the prompt", () => {
    const user = new UserViewModel("user123", "testuser");
    const promptViewModel = PromptViewModel.fromSchema(schemaPrompt);
    expect(promptViewModel.isOwnedBy(user)).toBe(true);
  });

  it("should not mark prompt as draft when created from schema", () => {
    const promptViewModel = PromptViewModel.fromSchema(schemaPrompt);
    expect(promptViewModel.isDraft()).toBeFalsy();
  });

  it("should return false if the user is not the owner of the prompt", () => {
    const user = new UserViewModel("user456", "testuser");
    const promptViewModel = PromptViewModel.fromSchema(schemaPrompt);

    expect(promptViewModel.isOwnedBy(user)).toBe(false);
  });

  it("should name a new prompt as draft", () => {
    const promptViewModel = new PromptViewModel();
    expect(promptViewModel.name).toBe("Unnamed [DRAFT]");
    expect(promptViewModel.id.startsWith("draft")).toBeTruthy();
  });

  it("should create a new prompt from a draft", async () => {
    const promptViewModel = new PromptViewModel();
    const user = new UserViewModel("user456", "testuser");

    vi.mocked(createPromptMock).mockResolvedValue(
      PromptViewModel.fromSchema(schemaPrompt),
    );

    const promptFormInputs: PromptFormInputs = {
      name: "Test Prompt",
      description: "A test prompt",
      sdlc: "Design",
      category: "Chat",
      instruction: "Test instruction",
    };

    await promptViewModel.publish(promptFormInputs, user, mockRepository);
    expect(createPromptMock).toHaveBeenCalled();
    expect(promptViewModel.isDraft()).toBeFalsy();
  });

  it("should update an existing prompt", async () => {
    const promptViewModel = PromptViewModel.fromSchema(schemaPrompt);
    const user = new UserViewModel("user456", "testuser");

    vi.mocked(createPromptMock).mockResolvedValue(new PromptViewModel());

    const promptFormInputs: PromptFormInputs = {
      name: "Test Prompt",
      description: "A test prompt",
      sdlc: "Design",
      category: "Chat",
      instruction: "Test instruction",
    };

    await promptViewModel.publish(promptFormInputs, user, mockRepository);
    expect(updatePromptMock).toHaveBeenCalled();
    expect(promptViewModel.id).toBe(schemaPrompt.id);
  });

  it("should save a prompt as draft", async () => {
    const promptViewModel = new PromptViewModel();

    vi.mocked(createPromptMock).mockResolvedValue(new PromptViewModel());

    const promptFormInputs: PromptFormInputs = {
      name: "Test Prompt",
      description: "A test prompt",
      sdlc: "Design",
      category: "Chat",
      instruction: "Test instruction",
    };

    await promptViewModel.saveDraft(promptFormInputs, mockDraftRepository);
    expect(saveDraftMock).toHaveBeenCalled();
  });
});
