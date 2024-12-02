import { Schema } from "@/amplify/data/resource";
import { UserViewModel } from "./UserViewModel";
import { v4 as uuidv4 } from "uuid";
import { PromptFormInputs } from "@/components/PromptForm";
import {
  PromptGraphQLRepository,
  PromptRepository,
} from "@/repositories/PromptRepository";
import { DraftRepository } from "@/repositories/DraftRepository";

export enum SdlcActivity {
  DEBUG = "Debugging",
  DEPLOY = "Deploy",
  DESIGN = "Design",
  DOCUMENT = "Documentation",
  ENHANCE = "Enhance",
  IMPLEMENT = "Implement",
  OPERATE = "Operate",
  OPTIMIZE = "Optimize",
  PATCH = "Patch Management",
  PLAN = "Plan",
  REFACTOR = "Refactoring",
  REQ = "Requirements",
  SECURITY = "Security",
  SUPPORT = "Support",
  TEST = "Test",
  UNKNOWN = "Unknown",
}

export enum PromptCategory {
  CHAT = "Chat",
  DEV_AGENT = "Dev Agent",
  INLINE = "Inline",
  TRANSLATE = "Translate",
  UNKNOWN = "Unknown",
}

export enum QInterface {
  IDE = "IDE",
  CLI = "CLI",
  CONSOLE = "Management Console",
  UNKNOWN = "Unknown",
}

export type ValidationError = { key: string; value: string };

export type ValidationResult = {
  isValid: boolean;
  errors: Array<ValidationError>;
};

export class PromptViewModel {
  private _id: string;
  private _name: string;
  private _description: string;
  private _interface: QInterface;
  private _sdlcPhase: SdlcActivity;
  private _category: PromptCategory;
  private _instruction: string;
  private _howto: string;
  private _owner?: string;
  private _ownerUsername?: string;
  private _draft: boolean;
  private _updatedAt: string;

  constructor() {
    this._id = `draft_${uuidv4()}`;
    this._name = "Unnamed [DRAFT]";
    this._description = "";
    this._interface = QInterface.UNKNOWN;
    this._sdlcPhase = SdlcActivity.UNKNOWN;
    this._category = PromptCategory.UNKNOWN;
    this._instruction = "";
    this._howto = "";
    this._draft = true;
    this._updatedAt = new Date().toISOString();
  }

  public static fromSchema(prompt: Schema["prompt"]["type"]): PromptViewModel {
    if (!prompt.owner) {
      throw new Error("Prompt has no owner");
    }

    const pvm = new PromptViewModel();
    pvm._id = prompt.id;
    pvm._name = prompt.name;
    pvm._description = prompt.description;
    pvm._interface = (prompt.interface as QInterface) || QInterface.UNKNOWN;
    pvm._sdlcPhase = prompt.sdlc_phase as SdlcActivity;
    pvm._category = prompt.category as PromptCategory;
    pvm._instruction = prompt.instruction;
    pvm._owner = prompt.owner;
    pvm._ownerUsername = prompt.owner_username;
    pvm._howto = prompt.howto || "";
    pvm._draft = false;
    pvm._updatedAt = prompt.updatedAt;
    return pvm;
  }

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }

  public get description(): string {
    return this._description;
  }
  public set description(value: string) {
    this._description = value;
  }

  public get interface(): QInterface {
    return this._interface;
  }
  public set interface(value: QInterface) {
    this._interface = value;
  }

  public get sdlcPhase(): SdlcActivity {
    return this._sdlcPhase;
  }
  public set sdlcPhase(value: SdlcActivity) {
    this._sdlcPhase = value;
  }

  public get category(): PromptCategory {
    return this._category;
  }
  public set category(value: PromptCategory) {
    this._category = value;
  }

  public get instruction(): string {
    return this._instruction;
  }
  public set instruction(value: string) {
    this._instruction = value;
  }

  public get howto(): string {
    return this._howto;
  }
  public set howto(value: string) {
    this._howto = value;
  }

  public get ownerUsername(): string {
    return this._ownerUsername || "unknown";
  }

  public get owner(): string {
    return this._owner || "unknown";
  }

  public get updatedAt(): string {
    return this._updatedAt;
  }

  public isOwnedBy(user: UserViewModel) {
    return this._owner === user.userId || this._owner === user.userName;
  }

  public createdBy() {
    return `created by ${this._ownerUsername}`;
  }

  public async publish(
    promptData: PromptFormInputs,
    owner: UserViewModel,
    repository: PromptRepository,
  ) {
    this._name = promptData.name;
    this._description = promptData.description;
    this._interface = promptData.interface as QInterface;
    this._sdlcPhase = promptData.sdlc as SdlcActivity;
    this._category = promptData.category as PromptCategory;
    this._instruction = promptData.instruction;
    this._howto = promptData.howto || "";
    this._ownerUsername = owner.preferredUsername;

    if (this.id.startsWith("draft")) {
      const publishedPrompt = await repository.createPrompt(this);
      this._id = publishedPrompt.id;
    } else {
      await repository.updatePrompt(this);
    }
    this._draft = false;
  }

  public async delete(
    user: UserViewModel,
    repository: PromptGraphQLRepository,
  ) {
    if (!this.isDraft() && this.isOwnedBy(user)) {
      await repository.deletePrompt(this);
    }
  }

  saveDraft(promptData: PromptFormInputs, repository: DraftRepository) {
    this._name = promptData.name;
    this._description = promptData.description;
    this._interface = promptData.interface as QInterface;
    this._sdlcPhase = promptData.sdlc as SdlcActivity;
    this._category = promptData.category as PromptCategory;
    this._instruction = promptData.instruction;
    this._howto = promptData.howto || "";
    this._draft = true;
    repository.saveDraft(this);
  }

  public isDraft() {
    return this._draft;
  }

  public hasSDLCPhaseAssigned() {
    return this._sdlcPhase !== SdlcActivity.UNKNOWN;
  }
}
