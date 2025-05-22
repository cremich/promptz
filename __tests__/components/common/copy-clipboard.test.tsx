import { describe, expect, test } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CopyClipBoardButton from "@/components/common/copy-clipboard";
import { ModelType } from "@/lib/forms/schema-definitions";
import { toast } from "sonner";

// Mock dependencies
jest.mock("aws-amplify/api", () => ({
  generateClient: () => ({
    mutations: {
      copyPrompt: jest.fn(),
      copyProjectRule: jest.fn(),
    },
  }),
}));

jest.mock("sonner", () => ({
  toast: jest.fn(),
}));

// Mock the clipboard API
const mockClipboard = {
  writeText: jest.fn(),
};

describe("CopyClipBoardButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(navigator, "clipboard", {
      value: mockClipboard,
      writable: true,
    });
  });

  test("renders with icon only by default", () => {
    // Arrange
    render(
      <CopyClipBoardButton
        id="test-id"
        text="Test text"
        type={ModelType.PROMPT}
      />,
    );

    // Assert
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(screen.queryByText("Copy Prompt")).not.toBeInTheDocument();
  });

  test("renders with text when showButtonText is true", () => {
    // Arrange
    render(
      <CopyClipBoardButton
        id="test-id"
        text="Test text"
        type={ModelType.PROMPT}
        showButtonText={true}
      />,
    );

    // Assert
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(screen.getByText("Copy Prompt")).toBeInTheDocument();
  });

  test("copies text to clipboard and calls API when clicked for prompt type", async () => {
    // Arrange
    render(
      <CopyClipBoardButton
        id="test-id"
        text="Test text"
        type={ModelType.PROMPT}
      />,
    );

    // Act
    const button = screen.getByRole("button");
    fireEvent.click(button);

    // Assert
    expect(mockClipboard.writeText).toHaveBeenCalledWith("Test text");
    expect(toast).toHaveBeenCalled();
  });

  test("copies text to clipboard and calls API when clicked for rule type", async () => {
    // Arrange
    render(
      <CopyClipBoardButton
        id="test-id"
        text="Test text"
        type={ModelType.RULE}
      />,
    );

    // Act
    const button = screen.getByRole("button");
    fireEvent.click(button);

    // Assert
    expect(mockClipboard.writeText).toHaveBeenCalledWith("Test text");
    expect(toast).toHaveBeenCalled();
  });
});
