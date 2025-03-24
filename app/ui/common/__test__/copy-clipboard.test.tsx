import CopyClipBoardButton from "@/app/ui/common/copy-clipboard";
import { beforeEach, describe, expect, test, jest } from "@jest/globals";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { toast } from "sonner";

describe("CopyClipBoardButton", () => {
  // Mock the clipboard API
  const mockClipboard = {
    writeText: jest.fn(),
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    // Setup clipboard mock
    Object.defineProperty(navigator, "clipboard", {
      value: mockClipboard,
      writable: true,
    });
  });

  test("renders the button with correct text and icon", () => {
    render(<CopyClipBoardButton text="test text" showButtonText={true} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Copy Prompt");
    expect(button.querySelector("svg")).toBeInTheDocument();
  });

  test("copies text to clipboard and shows success toast when clicked", async () => {
    const testText = "test text";

    render(<CopyClipBoardButton text={testText} />);

    const button = screen.getByRole("button");
    await fireEvent.click(button);

    expect(mockClipboard.writeText).toHaveBeenCalledWith(testText);
    expect(toast).toHaveBeenCalledWith("Copied.", {
      description: "Now, go build.",
    });
  });

  test("shows error toast when clipboard copy fails", async () => {
    mockClipboard.writeText.mockImplementationOnce(() => {
      throw new Error("Clipboard error");
    });

    render(<CopyClipBoardButton text="test text" />);

    const button = screen.getByRole("button");
    await fireEvent.click(button);

    expect(toast).toHaveBeenCalledWith("Failed to copy", {
      description: "Please try again",
    });
  });
});
