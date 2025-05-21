import { describe, expect, test } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ErrorBoundary from "@/app/error";

// Mock React hooks
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useEffect: jest.fn((cb) => cb()),
}));

// Mock console.error to prevent test output pollution
const originalConsoleError = console.error;
beforeEach(() => {
  console.error = jest.fn();
});

afterEach(() => {
  console.error = originalConsoleError;
});

describe("Error", () => {
  test("Renders error message and reset button", () => {
    const resetMock = jest.fn();

    const testError = new Error();

    render(<ErrorBoundary error={testError} reset={resetMock} />);

    // Check if error message is displayed
    expect(screen.getByText("Something went wrong!")).toBeInTheDocument();

    // Check if reset button is rendered
    const resetButton = screen.getByRole("button", { name: "Try again" });
    expect(resetButton).toBeInTheDocument();
  });

  test("Logs error to console", () => {
    const testError = new Error();
    render(<ErrorBoundary error={testError} reset={jest.fn()} />);

    // Check if error was logged to console
    expect(console.error).toHaveBeenCalledWith(testError);
  });

  test("Calls reset function when button is clicked", () => {
    const resetMock = jest.fn();
    const testError = new Error();

    render(<ErrorBoundary error={testError} reset={resetMock} />);

    // Click the reset button
    const resetButton = screen.getByRole("button", { name: "Try again" });
    fireEvent.click(resetButton);

    // Check if reset function was called
    expect(resetMock).toHaveBeenCalledTimes(1);
  });
});
