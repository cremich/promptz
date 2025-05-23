import { describe, expect, test } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PromptForm from "@/components/prompt/prompt-form";

jest.mock("@/lib/actions/submit-prompt-action", () => ({
  onSubmitAction: jest.fn(),
}));

jest.mock("@/lib/actions/delete-prompt-action", () => ({
  deletePrompt: jest.fn().mockResolvedValue({ success: true }),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock React hooks
const mockFormAction = jest.fn();
jest.mock("react", () => {
  const originalReact = jest.requireActual("react");
  return {
    ...originalReact,
    useActionState: () => [
      { message: "", success: true, errors: {} },
      mockFormAction,
      false, // isPending
    ],
    useEffect: jest.fn((fn) => fn()),
  };
});

describe("PromptForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Renders form with all required elements", () => {
    render(<PromptForm />);

    // Check if basic information section is present
    expect(screen.getByText("Basic Information")).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByText("Tags")).toBeInTheDocument();
    expect(screen.getByLabelText("Source URL")).toBeInTheDocument();
    expect(screen.getByText("Visibility")).toBeInTheDocument();

    // Check if prompt section is present
    expect(screen.getByText("Prompt")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Write your prompt here..."),
    ).toBeInTheDocument();

    // Check if how-to section is present
    expect(screen.getByText("How-To")).toBeInTheDocument();

    // Check if submit button is present
    expect(
      screen.getByRole("button", { name: "Save Prompt" }),
    ).toBeInTheDocument();
  });

  test("Form submission with required fields", () => {
    const { container } = render(<PromptForm />);

    // Fill out required fields
    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Test Prompt" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Test Description" },
    });
    fireEvent.change(screen.getByPlaceholderText("Write your prompt here..."), {
      target: { value: "Test Instruction" },
    });

    // Submit the form
    const form = container.querySelector("form");
    expect(form).toBeInTheDocument();
    fireEvent.submit(form!);

    // Verify that the form action was called
    expect(mockFormAction).toHaveBeenCalled();
  });

  test("Displays delete button only when prompt has an id", () => {
    const { rerender } = render(<PromptForm />);

    // Without prompt prop, delete button should not be present
    expect(screen.queryByText("Delete Prompt")).not.toBeInTheDocument();

    // With prompt prop containing id, delete button should be present
    rerender(
      <PromptForm
        prompt={{
          id: "test-id",
          title: "Test",
          description: "Test",
          instruction: "Test",
          tags: [],
        }}
      />,
    );
    expect(screen.getByText("Delete Prompt")).toBeInTheDocument();
  });

  test("Loads existing prompt data into form", () => {
    const testPrompt = {
      id: "test-id",
      title: "Test Title",
      description: "Test Description",
      instruction: "Test Instruction",
      tags: ["ide", "chat"],
      howto: "Test How-To",
      sourceURL: "https://test.com",
      public: true,
    };

    render(<PromptForm prompt={testPrompt} />);

    // Check if form fields are populated with prompt data
    expect(screen.getByLabelText("Title")).toHaveValue("Test Title");
    expect(screen.getByLabelText("Description")).toHaveValue(
      "Test Description",
    );
    expect(
      screen.getByPlaceholderText("Write your prompt here..."),
    ).toHaveValue("Test Instruction");
    expect(screen.getByLabelText("Source URL")).toHaveValue("https://test.com");
  });

  test("Displays error messages when form validation fails", () => {
    // Override the mock to include validation errors
    jest.spyOn(require("react"), "useActionState").mockImplementation(() => [
      {
        message: "Validation failed",
        success: false,
        errors: {
          title: ["Title is required"],
          description: ["Description is required"],
          instruction: ["Instruction is required"],
        },
      },
      jest.fn(),
      false,
    ]);

    render(<PromptForm />);

    // Check if error messages are displayed
    expect(screen.getByText("Title is required")).toBeInTheDocument();
    expect(screen.getByText("Description is required")).toBeInTheDocument();
    expect(screen.getByText("Instruction is required")).toBeInTheDocument();
  });
});
