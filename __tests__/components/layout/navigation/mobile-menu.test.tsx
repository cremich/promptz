import { describe, expect, test } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import MobileMenu from "@/components/layout/navigation/mobile-menu";

// Mock the navigation links
jest.mock("@/lib/navigation", () => ({
  links: [
    { name: "Prompts", href: "/prompts" },
    { name: "Rules", href: "/rules" },
    { name: "Agents", href: "/agents" },
    { name: "MCP Server", href: "/mcp" },
  ],
}));

// Mock the UserMenu component
jest.mock("@/components/layout/navigation/user-menu", () => {
  return function UserMenu() {
    return <div data-testid="user-menu-mock">User Menu Mock</div>;
  };
});

describe("Mobile Menu", () => {
  test("Renders hamburger menu button when closed", () => {
    render(<MobileMenu />);

    // Check if menu button is rendered
    const menuButton = screen.getByTestId("menu-button");
    expect(menuButton).toBeInTheDocument();

    // Check if burger icon is visible when menu is closed
    expect(screen.getByTestId("menu-button-burger")).toBeInTheDocument();

    // Menu content should not be visible initially
    expect(screen.queryByText("Prompts")).not.toBeInTheDocument();
  });

  test("Opens menu when button is clicked", () => {
    render(<MobileMenu />);

    const menuButton = screen.getByTestId("menu-button");
    fireEvent.click(menuButton);

    // Check if X icon is visible when menu is open
    expect(screen.getByTestId("menu-button-x")).toBeInTheDocument();

    // Check if navigation links are rendered
    expect(screen.getByText("Prompts")).toBeInTheDocument();
    expect(screen.getByText("Rules")).toBeInTheDocument();
    expect(screen.getByText("Agents")).toBeInTheDocument();
    expect(screen.getByText("MCP Server")).toBeInTheDocument();

    // Check if UserMenu is rendered
    expect(screen.getByTestId("user-menu-mock")).toBeInTheDocument();
  });

  test("Closes menu when a navigation link is clicked", () => {
    render(<MobileMenu />);

    // Open the menu first
    const menuButton = screen.getByTestId("menu-button");
    fireEvent.click(menuButton);

    // Click on a navigation link
    const promptsLink = screen.getByText("Prompts");
    fireEvent.click(promptsLink);

    // Menu should be closed and burger icon should be visible again
    expect(screen.queryByText("Prompts")).not.toBeInTheDocument();
    expect(screen.getByTestId("menu-button-burger")).toBeInTheDocument();
  });
});
