import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TopNavigation from "@/components/layout/navigation/topnav";
import { User } from "@/lib/models/user-model";

// Mock the navigation links
jest.mock("@/lib/navigation", () => ({
  links: [
    { name: "Prompts", href: "/prompts" },
    { name: "Rules", href: "/rules" },
    { name: "MCP Server", href: "/mcp" },
  ],
}));

// Mock the UserMenu component
jest.mock("@/components/layout/navigation/user-menu", () => {
  return function UserMenu() {
    return <div data-testid="user-menu-mock">User Menu Mock</div>;
  };
});

// Mock the MobileMenu component
jest.mock("@/components/layout/navigation/mobile-menu", () => {
  return function MobileMenu() {
    return <div data-testid="mobile-menu-mock">Mobile Menu Mock</div>;
  };
});

// Mock the current user
jest.mock("@/lib/actions/cognito-auth-action", () => ({
  fetchCurrentAuthUser: async () => {
    return {
      id: "123",
      username: "XXXXXXXX",
      email: "test@example.com",
      displayName: "Test User",
      groups: ["Test Group"],
      isAdmin: false,
      guest: false,
    };
  },
}));

describe("TopNavigation", () => {
  test("Renders logo with correct link", async () => {
    render(await TopNavigation());

    // Check if logo link is rendered
    const logoLink = screen.getByRole("link", {
      name: "Akkodis Prompt Hub Logo",
    });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute("href", "/");

    // Check if logo image is rendered
    const logoImage = screen.getByRole("img");
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute("alt", "Akkodis Prompt Hub Logo");
    expect(logoImage).toHaveAttribute(
      "src",
      "/_next/image?url=%2Fimages%2Fsite_logo.png&w=1080&q=75",
    );
  });

  test("Renders navigation links correctly", async () => {
    render(await TopNavigation());

    // Check if all navigation links are rendered
    const promptsLink = screen.getByRole("link", { name: "Prompts" });
    expect(promptsLink).toBeInTheDocument();
    expect(promptsLink).toHaveAttribute("href", "/prompts");

    const rulesLink = screen.getByRole("link", { name: "Rules" });
    expect(rulesLink).toBeInTheDocument();
    expect(rulesLink).toHaveAttribute("href", "/rules");

    const mcpServerLink = screen.getByRole("link", { name: "MCP Server" });
    expect(mcpServerLink).toBeInTheDocument();
    expect(mcpServerLink).toHaveAttribute("href", "/mcp");
  });

  test("Renders UserMenu component", async () => {
    render(await TopNavigation());

    // Check if UserMenu component is rendered
    const userMenu = screen.getByTestId("user-menu-mock");
    expect(userMenu).toBeInTheDocument();
  });

  test("Renders MobileMenu component", async () => {
    render(await TopNavigation());

    // Check if MobileMenu component is rendered
    const mobileMenu = screen.getByTestId("mobile-menu-mock");
    expect(mobileMenu).toBeInTheDocument();
  });
});
