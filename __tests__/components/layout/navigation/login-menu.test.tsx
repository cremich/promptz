import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginMenu from "@/components/layout/navigation/login-menu";

describe("Login Menu", () => {
  test("Renders login and create account links", () => {
    render(<LoginMenu />);

    // Check if login link is rendered with correct attributes
    const loginLink = screen.getByRole("link", { name: "Log In" });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/login");

    // Check if create account link is rendered with correct attributes
    const createAccountLink = screen.getByRole("link", {
      name: "Create Account",
    });
    expect(createAccountLink).toBeInTheDocument();
    expect(createAccountLink).toHaveAttribute("href", "/signup");
  });
});
