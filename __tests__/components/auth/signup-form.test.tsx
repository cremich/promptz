import { describe, expect, test } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SignUpForm } from "@/components/auth/signup-form";

// Mock the useActionState hook and formAction
const mockFormAction = jest.fn();
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn().mockImplementation((init) => [init, jest.fn()]),
  useActionState: () => [{ message: null, errors: {} }, mockFormAction],
}));

// Mock Next.js Link component
jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) {
    return <a href={href}>{children}</a>;
  };
});

describe("SignUpForm", () => {
  test("Renders form with all required elements", () => {
    render(<SignUpForm />);

    // Check if title and description are present
    expect(screen.getByText("Create Your Account")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Enter your email, and preferred username below to create a new account for Promptz.",
      ),
    ).toBeInTheDocument();

    // Check if input fields are present
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();

    // Check if submit button is present
    expect(
      screen.getByRole("button", { name: "Create Account" }),
    ).toBeInTheDocument();

    // Check if login link is present
    expect(screen.getByText("Log In")).toBeInTheDocument();
  });

  test("Input fields have correct attributes", () => {
    render(<SignUpForm />);

    const emailInput = screen.getByLabelText("Email");
    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toHaveAttribute("required");
    expect(emailInput).toHaveAttribute("placeholder", "m@example.com");

    const usernameInput = screen.getByLabelText("Username");
    expect(usernameInput).toHaveAttribute("type", "text");
    expect(usernameInput).toHaveAttribute("required");
  });

  test("Form submission with input values", () => {
    const { container } = render(<SignUpForm />);

    // Get the input fields and enter values
    const emailInput = screen.getByLabelText("Email");
    const usernameInput = screen.getByLabelText("Username");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(usernameInput, { target: { value: "testuser" } });

    // Get the form and submit it
    const form = container.querySelector("form");
    expect(form).toBeInTheDocument();

    fireEvent.submit(form!);

    // Verify that the form action was called
    expect(mockFormAction).toHaveBeenCalled();
  });

  test("Displays error messages when present in state", () => {
    // Override the mock to include error messages
    jest.spyOn(require("react"), "useActionState").mockImplementation(() => [
      {
        message: "Account creation failed",
        errors: {
          email: ["Please enter a valid email address"],
          username: ["Username must be at least 3 characters"],
        },
      },
      jest.fn(),
    ]);

    render(<SignUpForm />);

    // Check if error messages are displayed
    expect(
      screen.getByText("Please enter a valid email address"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Username must be at least 3 characters"),
    ).toBeInTheDocument();
    expect(screen.getByText("Account creation failed")).toBeInTheDocument();
  });
});
