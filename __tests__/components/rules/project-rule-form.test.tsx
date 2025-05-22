import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProjectRuleForm from "@/components/rules/project-rule-form";
import { ProjectRuleTag } from "@/lib/models/tags-model";
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
jest.mock("@/lib/actions/submit-rule-action", () => ({
  onSubmitAction: jest.fn(),
}));

jest.mock("@/lib/actions/delete-rule-action", () => ({
  deleteProjectRule: jest.fn(),
}));

describe("ProjectRuleForm", () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Renders form with empty fields when no project rule is provided", () => {
    render(<ProjectRuleForm />);

    // Check if form elements are rendered by placeholder text instead of label
    expect(screen.getByRole("textbox", { name: "Title" })).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Description" }),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/# Your Project Rule Content in Markdown*/i),
    ).toBeInTheDocument();
  });

  test("Renders delete button when project rule provided", () => {
    const mockProjectRule = {
      id: "test-id",
      title: "Test Title",
      description: "Test Description",
      content: "# Test Content",
      tags: [ProjectRuleTag.NEXTJS, ProjectRuleTag.REACT],
      sourceURL: "https://example.com",
      public: true,
    };

    render(<ProjectRuleForm projectRule={mockProjectRule} />);

    // Check if the delete button is rendered when a project rule is provided
    expect(screen.getByText(/Delete Project Rule/i)).toBeInTheDocument();
  });

  //   // Mock the deleteProjectRule function to return success
  //   (deleteRuleAction.deleteProjectRule as jest.Mock).mockResolvedValue({
  //     success: true,
  //     message: "Project rule deleted",
  //   });

  //   const mockProjectRule = {
  //     id: "test-id",
  //     title: "Test Title",
  //   };

  //   render(<ProjectRuleForm projectRule={mockProjectRule} />);

  //   // Check if the delete button is rendered
  //   expect(screen.getByText(/Delete Project Rule/i)).toBeInTheDocument();
  // });
});
