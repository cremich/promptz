import { describe, expect, test } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProjectRuleForm from "@/components/rules/project-rule-form";

jest.mock("@/lib/actions/submit-rule-action", () => ({
  onSubmitAction: jest.fn(),
}));

jest.mock("@/lib/actions/delete-rule-action", () => ({
  deleteProjectRule: jest.fn().mockResolvedValue({ success: true }),
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

describe("ProjectRuleForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Renders form with all required elements", () => {
    render(<ProjectRuleForm />);

    // Check if basic information section is present
    expect(screen.getByText("Basic Information")).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByText("Tags")).toBeInTheDocument();
    expect(screen.getByLabelText("Source URL")).toBeInTheDocument();
    expect(screen.getByText("Visibility")).toBeInTheDocument();

    // Check if rule content section is present
    expect(screen.getByText("Rule Content")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Your Project Rule Content in Markdown/),
    ).toBeInTheDocument();

    // Check if submit button is present
    expect(
      screen.getByRole("button", { name: "Save Project Rule" }),
    ).toBeInTheDocument();
  });

  test("Form submission with required fields", () => {
    const { container } = render(<ProjectRuleForm />);

    // Fill out required fields
    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Test Project Rule" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Test Description" },
    });
    fireEvent.change(
      screen.getByPlaceholderText(/Your Project Rule Content in Markdown/),
      {
        target: { value: "# Test Content" },
      },
    );

    // Submit the form
    const form = container.querySelector("form");
    expect(form).toBeInTheDocument();
    fireEvent.submit(form!);

    // Verify that the form action was called
    expect(mockFormAction).toHaveBeenCalled();
  });

  test("Displays delete button only when project rule has an id", () => {
    const { rerender } = render(<ProjectRuleForm />);

    // Without projectRule prop, delete button should not be present
    expect(screen.queryByText("Delete Project Rule")).not.toBeInTheDocument();

    // With projectRule prop containing id, delete button should be present
    rerender(
      <ProjectRuleForm
        projectRule={{
          id: "test-id",
          title: "Test",
          description: "Test",
          content: "Test",
          tags: [],
        }}
      />,
    );
    expect(screen.getByText("Delete Project Rule")).toBeInTheDocument();
  });

  test("Loads existing project rule data into form", () => {
    const testProjectRule = {
      id: "test-id",
      title: "Test Title",
      description: "Test Description",
      content: "# Test Content",
      tags: ["typescript", "nextjs"],
      sourceURL: "https://test.com",
      public: true,
    };

    render(<ProjectRuleForm projectRule={testProjectRule} />);

    // Check if form fields are populated with project rule data
    expect(screen.getByLabelText("Title")).toHaveValue("Test Title");
    expect(screen.getByLabelText("Description")).toHaveValue(
      "Test Description",
    );
    expect(
      screen.getByPlaceholderText(/Your Project Rule Content in Markdown/),
    ).toHaveValue("# Test Content");
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
          content: ["Content is required"],
        },
      },
      jest.fn(),
      false,
    ]);

    render(<ProjectRuleForm />);

    // Check if error messages are displayed
    expect(screen.getByText("Title is required")).toBeInTheDocument();
    expect(screen.getByText("Description is required")).toBeInTheDocument();
    expect(screen.getByText("Content is required")).toBeInTheDocument();
  });
});
