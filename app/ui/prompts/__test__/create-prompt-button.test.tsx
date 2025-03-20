import CreatePromptButton from "@/app/ui/prompts/create-prompt-button";
import { describe, expect, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

describe("CreatePromptButton", () => {
  test("renders a link with correct href", () => {
    render(<CreatePromptButton />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/prompts/create`);
  });
});
