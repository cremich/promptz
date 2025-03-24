import { describe, expect, test, beforeEach, jest } from "@jest/globals";
import { render, fireEvent, screen } from "@testing-library/react";
import { DownloadButton } from "../download-button";

describe("DownloadButton", () => {
  const mockContent = "# Test Content\nThis is test content";
  const mockFilename = "test-file.md";

  beforeEach(() => {
    // Mock URL.createObjectURL and URL.revokeObjectURL
    global.URL.createObjectURL = jest.fn(() => "mock-url");
    global.URL.revokeObjectURL = jest.fn();
  });

  test("renders with default props", () => {
    render(<DownloadButton content={mockContent} filename={mockFilename} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Download");
  });

  test("renders with custom label", () => {
    render(
      <DownloadButton
        content={mockContent}
        filename={mockFilename}
        label="Custom Label"
      />,
    );

    expect(screen.getByText("Custom Label")).toBeInTheDocument();
  });

  test("triggers download when clicked", () => {
    const createElementSpy = jest.spyOn(document, "createElement");
    const appendChildSpy = jest.spyOn(document.body, "appendChild");
    const removeChildSpy = jest.spyOn(document.body, "removeChild");

    render(<DownloadButton content={mockContent} filename={mockFilename} />);

    fireEvent.click(screen.getByRole("button"));

    expect(createElementSpy).toHaveBeenCalledWith("a");
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalled();
  });

  // test("adds .md extension if not present", () => {
  //   const mockClickEvent = jest.fn();
  //   Object.defineProperty(HTMLAnchorElement.prototype, "click", {
  //     value: mockClickEvent,
  //   });

  //   render(<DownloadButton content={mockContent} filename="test-file" />);
  //   fireEvent.click(screen.getByRole("button"));

  //   const anchorElements = document.getElementsByTagName("a");
  //   expect(anchorElements[0].download).toBe("test-file.md");
  // });
});
