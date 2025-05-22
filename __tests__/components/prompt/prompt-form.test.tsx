import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PromptForm from "@/components/prompt/prompt-form";
import React from "react";

// Mock the necessary modules
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock the server actions
jest.mock("@/lib/actions/submit-prompt-action", () => ({
  onSubmitAction: jest.fn(),
}));

jest.mock("@/lib/actions/delete-prompt-action", () => ({
  deletePrompt: jest.fn(),
}));

describe("PromptForm", () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Renders form with empty fields when no prompt is provided", () => {
    render(<PromptForm />);

    // Check if form elements are rendered
    expect(screen.getByRole("textbox", { name: "Title" })).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Description" }),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Write your prompt here.../i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Save Prompt/i)).toBeInTheDocument();
  });

  test("Renders form with provided prompt data", () => {
    const mockPrompt = {
      id: "test-id",
      title: "Test Title",
      description: "Test Description",
      instruction: "Test Instruction",
      tags: ["IDE", "chat"],
      howto: "Test How-To",
      sourceURL: "https://example.com",
      public: true,
    };

    render(<PromptForm prompt={mockPrompt} />);

    // Check if form is populated with the provided prompt data
    expect(screen.getByDisplayValue("Test Title")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Description")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Instruction")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test How-To")).toBeInTheDocument();
    expect(screen.getByDisplayValue("https://example.com")).toBeInTheDocument();
  });

  test("Renders delete button when prompt is provided", () => {
    const mockPrompt = {
      id: "test-id",
      title: "Test Title",
      description: "Test Description",
      instruction: "Test Instruction",
      tags: ["IDE", "chat"],
      howto: "Test How-To",
      sourceURL: "https://example.com",
      public: true,
    };

    render(<PromptForm prompt={mockPrompt} />);

    // Check if the delete button is rendered when a prompt is provided
    expect(screen.getByText(/Delete Prompt/i)).toBeInTheDocument();
  });

  test("Does not render delete button when no prompt is provided", () => {
    render(<PromptForm />);

    // Check that the delete button is not rendered when no prompt is provided
    expect(screen.queryByText(/Delete Prompt/i)).not.toBeInTheDocument();
  });
});
