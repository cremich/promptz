import { Prompt } from "@/app/lib/definitions";
import PromptForm from "@/app/ui/prompts/form";
import { describe, expect, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

describe("Prompt Form", () => {
  const prompt: Prompt = {
    id: "12345",
    title: "Test Prompt",
    description: "This is a test prompt",
    instruction: "What is the meaning of life?",
    howto: "this is cool",
    tags: ["IDE"],
    author: "cremich",
    authorId: "12345",
    public: true,
  };

  test("renders the prompt form component unchanged", () => {
    const { container } = render(<PromptForm prompt={prompt} />);
    expect(container).toMatchSnapshot();
  });
});
