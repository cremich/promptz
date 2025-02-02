import { describe, expect, it, vi } from "vitest";
import {
  PromptViewModel,
  SdlcActivity,
  PromptCategory,
  QInterface,
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

const mockUserDataPrimary = {
  id: "4304d832-1021-707b-211b-2be14c145d75",
  username: "4304d832-1021-707b-211b-2be14c145d75",
  email: "test@example.com",
  displayName: "Test User Primary",
  owner:
    "4304d832-1021-707b-211b-2be14c145d75::4304d832-1021-707b-211b-2be14c145d75",
  createdAt: "",
  updatedAt: "",
};

const mockUserDataSecondary = {
  id: "1073fb35-3671-4ea0-8859-e75be2c5eb7b",
  username: "1073fb35-3671-4ea0-8859-e75be2c5eb7b",
  email: "test2@example.com",
  displayName: "Test User Secondary",
  owner:
    "1073fb35-3671-4ea0-8859-e75be2c5eb7b::1073fb35-3671-4ea0-8859-e75be2c5eb7b",
  createdAt: "",
  updatedAt: "",
};

const schemaPrompt = {
  id: "1",
  name: "Test Prompt",
  description: "A test prompt",
  interface: "IDE",
  sdlc_phase: "Design",
  category: "Chat",
  instruction: "Test instruction",
  owner_username: mockUserDataPrimary.displayName,
  owner: mockUserDataPrimary.owner,
  createdAt: "",
  updatedAt: "",
};

const primaryUser = UserViewModel.fromSchema(mockUserDataPrimary);
const secondaryUser = UserViewModel.fromSchema(mockUserDataSecondary);

describe("PromptViewModel", () => {
  it("should create a PromptViewModel instance from a schema object", () => {
    const promptViewModel = PromptViewModel.fromSchema(schemaPrompt);

    expect(promptViewModel.id).toBe(schemaPrompt.id);
    expect(promptViewModel.name).toBe(schemaPrompt.name);
    expect(promptViewModel.description).toBe(schemaPrompt.description);
    expect(promptViewModel.sdlcPhase).toBe(SdlcActivity.DESIGN);
    expect(promptViewModel.category).toBe(PromptCategory.CHAT);
    expect(promptViewModel.interface).toBe(QInterface.IDE);
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
    const promptViewModel = PromptViewModel.fromSchema(schemaPrompt);
    expect(promptViewModel.isOwnedBy(primaryUser)).toBe(true);
  });

  it("should not mark prompt as draft when created from schema", () => {
    const promptViewModel = PromptViewModel.fromSchema(schemaPrompt);
    expect(promptViewModel.isDraft()).toBeFalsy();
  });

  it("should return false if the user is not the owner of the prompt", () => {
    const promptViewModel = PromptViewModel.fromSchema(schemaPrompt);

    expect(promptViewModel.isOwnedBy(secondaryUser)).toBe(false);
  });

  it("should name a new prompt as draft", () => {
    const promptViewModel = new PromptViewModel();
    expect(promptViewModel.name).toBe("Unnamed [DRAFT]");
    expect(promptViewModel.id.startsWith("draft")).toBeTruthy();
  });

  it("should create a new prompt from a draft", async () => {
    const promptViewModel = new PromptViewModel();

    vi.mocked(createPromptMock).mockResolvedValue(
      PromptViewModel.fromSchema(schemaPrompt),
    );

    const promptFormInputs: PromptFormInputs = {
      name: "Test Prompt",
      description: "A test prompt",
      interface: "IDE",
      sdlc: "Design",
      category: "Chat",
      instruction: "Test instruction",
    };

    await promptViewModel.publish(
      promptFormInputs,
      secondaryUser,
      mockRepository,
    );
    expect(createPromptMock).toHaveBeenCalled();
    expect(promptViewModel.isDraft()).toBeFalsy();
  });

  it("should publish prompt", async () => {
    const promptViewModel = new PromptViewModel();

    vi.mocked(createPromptMock).mockResolvedValue(
      PromptViewModel.fromSchema(schemaPrompt),
    );

    const promptFormInputs: PromptFormInputs = {
      name: "Test Prompt",
      description: "A test prompt",
      interface: "IDE",
      sdlc: "Design",
      category: "Chat",
      instruction: "Test instruction",
    };

    await promptViewModel.publish(
      promptFormInputs,
      primaryUser,
      mockRepository,
    );
    expect(createPromptMock).toHaveBeenCalled();
    expect(promptViewModel.id).toBe(schemaPrompt.id);
    expect(promptViewModel.name).toBe(promptFormInputs.name);
    expect(promptViewModel.description).toBe(promptFormInputs.description);
    expect(promptViewModel.interface).toBe(QInterface.IDE);
    expect(promptViewModel.sdlcPhase).toBe(SdlcActivity.DESIGN);
    expect(promptViewModel.category).toBe(PromptCategory.CHAT);
    expect(promptViewModel.instruction).toBe(promptFormInputs.instruction);
    expect(promptViewModel.ownerUsername).toBe(primaryUser.displayName);
    expect(promptViewModel.isDraft()).toBeFalsy();
  });

  it("should update an existing prompt", async () => {
    const promptViewModel = PromptViewModel.fromSchema(schemaPrompt);
    vi.mocked(createPromptMock).mockResolvedValue(new PromptViewModel());

    const promptFormInputs: PromptFormInputs = {
      name: "Updated",
      description: "Updated",
      interface: "IDE",
      sdlc: "Plan",
      category: "Inline",
      instruction: "Updated",
      howto: "Updated",
    };

    await promptViewModel.publish(
      promptFormInputs,
      primaryUser,
      mockRepository,
    );
    expect(updatePromptMock).toHaveBeenCalled();
    expect(promptViewModel.id).toBe(schemaPrompt.id);
    expect(promptViewModel.name).toBe(promptFormInputs.name);
    expect(promptViewModel.description).toBe(promptFormInputs.description);
    expect(promptViewModel.interface).toBe(QInterface.IDE);
    expect(promptViewModel.sdlcPhase).toBe(SdlcActivity.PLAN);
    expect(promptViewModel.category).toBe(PromptCategory.INLINE);
    expect(promptViewModel.instruction).toBe(promptFormInputs.instruction);
    expect(promptViewModel.howto).toBe(promptFormInputs.howto);
    expect(promptViewModel.ownerUsername).toBe(primaryUser.displayName);
  });

  it("should save a prompt as draft", async () => {
    const promptViewModel = new PromptViewModel();

    vi.mocked(createPromptMock).mockResolvedValue(new PromptViewModel());

    const promptFormInputs: PromptFormInputs = {
      name: "Draft",
      description: "Draft",
      interface: "CLI",
      sdlc: "Plan",
      category: "Inline",
      instruction: "Draft",
      howto: "Draft",
    };

    await promptViewModel.saveDraft(promptFormInputs, mockDraftRepository);
    expect(saveDraftMock).toHaveBeenCalled();
    expect(promptViewModel.id.startsWith("draft")).toBeTruthy();
    expect(promptViewModel.name).toBe(promptFormInputs.name);
    expect(promptViewModel.description).toBe(promptFormInputs.description);
    expect(promptViewModel.interface).toBe(QInterface.CLI);
    expect(promptViewModel.sdlcPhase).toBe(SdlcActivity.PLAN);
    expect(promptViewModel.category).toBe(PromptCategory.INLINE);
    expect(promptViewModel.instruction).toBe(promptFormInputs.instruction);
    expect(promptViewModel.howto).toBe(promptFormInputs.howto);
  });

  it("should prepend quick action for dev agent when saving prompt as draft", async () => {
    const promptViewModel = new PromptViewModel();

    vi.mocked(createPromptMock).mockResolvedValue(new PromptViewModel());

    const promptFormInputs: PromptFormInputs = {
      name: "Draft",
      description: "Draft",
      interface: "IDE",
      sdlc: "Plan",
      category: "Dev Agent",
      instruction: "Draft",
      howto: "Draft",
    };

    await promptViewModel.saveDraft(promptFormInputs, mockDraftRepository);
    expect(promptViewModel.instruction).toBe(
      `/dev ${promptFormInputs.instruction}`,
    );
  });

  it("should prepend quick action for transform agent when saving prompt as draft", async () => {
    const promptViewModel = new PromptViewModel();

    vi.mocked(createPromptMock).mockResolvedValue(new PromptViewModel());

    const promptFormInputs: PromptFormInputs = {
      name: "Draft",
      description: "Draft",
      interface: "IDE",
      sdlc: "Plan",
      category: "Transform Agent",
      instruction: "Draft",
      howto: "Draft",
    };

    await promptViewModel.saveDraft(promptFormInputs, mockDraftRepository);

    expect(promptViewModel.instruction).toBe(
      `/transform ${promptFormInputs.instruction}`,
    );
  });

  it("should prepend quick action for dev agent when publishing prompt", async () => {
    const promptViewModel = new PromptViewModel();

    vi.mocked(createPromptMock).mockResolvedValue(new PromptViewModel());

    const promptFormInputs: PromptFormInputs = {
      name: "Draft",
      description: "Draft",
      interface: "IDE",
      sdlc: "Plan",
      category: "Dev Agent",
      instruction: "Draft",
      howto: "Draft",
    };

    await promptViewModel.publish(
      promptFormInputs,
      primaryUser,
      mockRepository,
    );
    expect(promptViewModel.instruction).toBe(
      `/dev ${promptFormInputs.instruction}`,
    );
  });

  it("should prepend quick action for transform agent when saving prompt as draft", async () => {
    const promptViewModel = new PromptViewModel();

    vi.mocked(createPromptMock).mockResolvedValue(new PromptViewModel());

    const promptFormInputs: PromptFormInputs = {
      name: "Draft",
      description: "Draft",
      interface: "IDE",
      sdlc: "Plan",
      category: "Transform Agent",
      instruction: "Draft",
      howto: "Draft",
    };

    await promptViewModel.publish(
      promptFormInputs,
      primaryUser,
      mockRepository,
    );
    expect(promptViewModel.instruction).toBe(
      `/transform ${promptFormInputs.instruction}`,
    );
  });

  it("should prepend quick action for doc agent when saving prompt as draft", async () => {
    const promptViewModel = new PromptViewModel();

    vi.mocked(createPromptMock).mockResolvedValue(new PromptViewModel());

    const promptFormInputs: PromptFormInputs = {
      name: "Draft",
      description: "Draft",
      interface: "IDE",
      sdlc: "Plan",
      category: "Doc Agent",
      instruction: "Draft",
      howto: "Draft",
    };

    await promptViewModel.publish(
      promptFormInputs,
      primaryUser,
      mockRepository,
    );
    expect(promptViewModel.instruction).toBe(
      `/doc ${promptFormInputs.instruction}`,
    );
  });

  it("should prepend quick action for review agent when saving prompt as draft", async () => {
    const promptViewModel = new PromptViewModel();

    vi.mocked(createPromptMock).mockResolvedValue(new PromptViewModel());

    const promptFormInputs: PromptFormInputs = {
      name: "Draft",
      description: "Draft",
      interface: "IDE",
      sdlc: "Plan",
      category: "Review Agent",
      instruction: "Draft",
      howto: "Draft",
    };

    await promptViewModel.publish(
      promptFormInputs,
      primaryUser,
      mockRepository,
    );
    expect(promptViewModel.instruction).toBe(
      `/review ${promptFormInputs.instruction}`,
    );
  });

  it("should prepend quick action for test agent when saving prompt as draft", async () => {
    const promptViewModel = new PromptViewModel();

    vi.mocked(createPromptMock).mockResolvedValue(new PromptViewModel());

    const promptFormInputs: PromptFormInputs = {
      name: "Draft",
      description: "Draft",
      interface: "IDE",
      sdlc: "Plan",
      category: "Test Agent",
      instruction: "Draft",
      howto: "Draft",
    };

    await promptViewModel.publish(
      promptFormInputs,
      primaryUser,
      mockRepository,
    );
    expect(promptViewModel.instruction).toBe(
      `/test ${promptFormInputs.instruction}`,
    );
  });
});
