import { describe, expect, test } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import MCPSettingsPage from "@/app/mcp/page";
import { toast } from "sonner";

// Mock dependencies
jest.mock("aws-amplify", () => ({
  Amplify: {
    getConfig: jest.fn().mockReturnValue({
      API: {
        GraphQL: {
          endpoint: "https://test-api-endpoint.com",
          apiKey: "test-api-key-123456",
        },
      },
    }),
  },
}));

jest.mock("sonner", () => ({
  toast: jest.fn(),
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

describe("MCP Settings Page", () => {
  test("Renders page title and description", () => {
    render(<MCPSettingsPage />);

    // Check for page title
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("MCP Server Configuration");

    // Check for page description
    const description = screen.getByText(
      "View the MCP server connection details for PROMPTZ",
    );
    expect(description).toBeInTheDocument();
  });

  test("Displays API URL and API Key from Amplify config", () => {
    render(<MCPSettingsPage />);

    // Check if API URL is displayed
    const apiUrl = screen.getByText("https://test-api-endpoint.com");
    expect(apiUrl).toBeInTheDocument();

    // Check if API Key is displayed
    const apiKey = screen.getByText("test-api-key-123456");
    expect(apiKey).toBeInTheDocument();
  });

  test("Displays MCP settings snippet with correct values", () => {
    render(<MCPSettingsPage />);

    // Check if the snippet contains the API URL and API Key
    const snippet = screen.getByText((content) => {
      return (
        content.includes("PROMPTZ_API_URL") &&
        content.includes("https://test-api-endpoint.com") &&
        content.includes("PROMPTZ_API_KEY") &&
        content.includes("test-api-key-123456")
      );
    });
    expect(snippet).toBeInTheDocument();
  });

  test("Copies API URL to clipboard when copy button is clicked", () => {
    render(<MCPSettingsPage />);

    // Find all copy buttons (there should be 3: API URL, API Key, and Snippet)
    const copyButtons = screen.getAllByTitle("Copy to clipboard");
    expect(copyButtons.length).toBe(3);

    // Click the first copy button (API URL)
    fireEvent.click(copyButtons[0]);

    // Check if clipboard API was called with the correct value
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "https://test-api-endpoint.com",
    );

    // Check if toast notification was shown
    expect(toast).toHaveBeenCalledWith("Copied to clipboard.");
  });

  test("Copies API Key to clipboard when copy button is clicked", () => {
    render(<MCPSettingsPage />);

    // Find all copy buttons
    const copyButtons = screen.getAllByTitle("Copy to clipboard");

    // Click the second copy button (API Key)
    fireEvent.click(copyButtons[1]);

    // Check if clipboard API was called with the correct value
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "test-api-key-123456",
    );

    // Check if toast notification was shown
    expect(toast).toHaveBeenCalledWith("Copied to clipboard.");
  });

  test("Copies snippet to clipboard when copy button is clicked", () => {
    render(<MCPSettingsPage />);

    // Find all copy buttons
    const copyButtons = screen.getAllByTitle("Copy to clipboard");

    // Click the third copy button (Snippet)
    fireEvent.click(copyButtons[2]);

    // Check if clipboard API was called
    expect(navigator.clipboard.writeText).toHaveBeenCalled();

    // Check if toast notification was shown
    expect(toast).toHaveBeenCalledWith("Copied to clipboard.");
  });

  test("Displays important alert with correct information", () => {
    render(<MCPSettingsPage />);

    // Check for alert title
    const alertTitle = screen.getByText("Important");
    expect(alertTitle).toBeInTheDocument();

    // Check for alert description
    const alertDescription = screen.getByText(
      "Use these settings to configure your MCP server connection. Copy the API URL and API Key into your configuration file.",
    );
    expect(alertDescription).toBeInTheDocument();
  });
});
