import { describe, expect, test } from "@jest/globals";
import { act, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserMenu from "@/components/layout/navigation/user-menu";
import { User } from "@/lib/models/user-model";
import { fetchCurrentUser } from "@/lib/actions/signin-action";

// Mock the fetchCurrentUser function
jest.mock("@/lib/actions/signin-action", () => ({
  fetchCurrentUser: jest.fn().mockImplementation(() => {
    return Promise.resolve({ displayName: "Test User", guest: false });
  }),
}));

// Mock the Hub from aws-amplify
jest.mock("aws-amplify/utils", () => ({
  Hub: {
    listen: jest.fn((channel, callback) => {
      // Store the callback for testing
      mockHubCallback = callback;
    }),
  },
}));

// Mock the LoginMenu component
jest.mock("@/components/layout/navigation/login-menu", () => {
  return function LoginMenu() {
    return <div data-testid="login-menu-mock">Login Menu Mock</div>;
  };
});

// Mock the LogoutButton component
jest.mock("@/components/layout/navigation/logout-button", () => {
  return function LogoutButton() {
    return <button data-testid="logout-button-mock">Sign out</button>;
  };
});

// Variable to store the Hub callback for testing
let mockHubCallback: (arg: {
  payload: { event: string } | { event: string };
}) => void;

describe("User Menu", () => {
  test("Renders user menu with username when user is logged in", async () => {
    render(<UserMenu />);

    // Wait for the fetchUser effect to complete
    await waitFor(() => {
      expect(screen.getByTestId("user-menu_username")).toBeInTheDocument();
    });

    // Check if username is displayed correctly
    expect(screen.getByTestId("user-menu_username")).toHaveTextContent(
      "Test User",
    );

    // Check if dropdown trigger button is rendered
    const menuButton = screen.getByRole("button");
    expect(menuButton).toBeInTheDocument();
    expect(menuButton).toHaveClass("flex items-center text-sm font-medium");
  });

  test("Renders login menu when user is guest", async () => {
    // Override the mock to return a guest user
    jest.mocked(fetchCurrentUser).mockImplementationOnce(() => {
      return Promise.resolve({ displayName: "", guest: true } as User);
    });

    render(<UserMenu />);

    // Wait for the fetchUser effect to complete
    await waitFor(() => {
      expect(screen.getByTestId("login-menu-mock")).toBeInTheDocument();
    });

    // Check if login menu is displayed
    expect(screen.getByTestId("login-menu-mock")).toBeInTheDocument();

    // User menu button should not be present
    expect(screen.queryByTestId("user-menu_username")).not.toBeInTheDocument();
  });

  test("Updates user state when auth events occur", async () => {
    render(<UserMenu />);

    // Wait for initial render

    await waitFor(() => {
      expect(screen.getByTestId("user-menu_username")).toBeInTheDocument();
    });

    act(() => {
      // Simulate signedOut event
      mockHubCallback({ payload: { event: "signedOut" } });
    });

    // Should show login menu after signedOut
    await waitFor(() => {
      expect(screen.getByTestId("login-menu-mock")).toBeInTheDocument();
    });

    act(() => {
      // Simulate signedIn event
      mockHubCallback({ payload: { event: "signedIn" } });
    });

    await waitFor(() => {
      expect(screen.getByTestId("user-menu_username")).toBeInTheDocument();
    });
  });
});
