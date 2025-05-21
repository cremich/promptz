import { describe, expect, test } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import LogoutButton from "@/components/layout/navigation/logout-button";

// Mock the AWS Amplify auth signOut function
const mockSignOut = jest.fn();
jest.mock("@aws-amplify/auth", () => ({
  signOut: () => mockSignOut(),
}));

describe("Logout Button", () => {
  test("Renders sign out button", () => {
    render(<LogoutButton />);

    // Check if button is rendered with correct text
    const button = screen.getByRole("button", { name: "Sign out" });
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe("BUTTON");
  });

  test("Button has correct styling class", () => {
    render(<LogoutButton />);

    const button = screen.getByRole("button", { name: "Sign out" });
    expect(button).toHaveClass("w-full");
  });

  test("Calls signOut function when clicked", () => {
    render(<LogoutButton />);

    const button = screen.getByRole("button", { name: "Sign out" });
    fireEvent.click(button);

    // Check if signOut was called
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});
