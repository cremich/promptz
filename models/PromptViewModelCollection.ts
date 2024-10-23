import { PromptViewModel } from "./PromptViewModel";

export class PromptViewModelCollection {
  private _nextToken?: string;
  private _prompts: Array<PromptViewModel>;

  constructor(prompts: Array<PromptViewModel>, nextToken?: string) {
    this._nextToken = nextToken;
    this._prompts = prompts;
  }

  public get nextToken(): string | undefined {
    return this._nextToken;
  }

  public get prompts(): Array<PromptViewModel> {
    return this._prompts;
  }
}
