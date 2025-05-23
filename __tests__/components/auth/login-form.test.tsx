import { describe, expect, test } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LoginForm } from "@/components/auth/login-form";

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

describe("LoginForm", () => {
  test("Renders form with all required elements", () => {
    render(<LoginForm />);

    // Check if title and description are present
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Enter your email below to request a one-time password to login to your account.",
      ),
    ).toBeInTheDocument();

    // Check if input field is present
    expect(screen.getByLabelText("Email")).toBeInTheDocument();

    // Check if submit button is present
    expect(
      screen.getByRole("button", { name: "Send One-Time Password" }),
    ).toBeInTheDocument();

    // Check if signup link is present
    expect(screen.getByText("Create an account")).toBeInTheDocument();
  });

  test("Input field has correct attributes", () => {
    render(<LoginForm />);

    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("required");
    expect(input).toHaveAttribute("placeholder", "m@example.com");
  });

  test("Form submission with input value", () => {
    const { container } = render(<LoginForm />);

    // Get the input field and enter a value
    const input = screen.getByLabelText("Email");
    fireEvent.change(input, { target: { value: "test@example.com" } });

    // Get the form and submit it
    const form = container.querySelector("form");
    expect(form).toBeInTheDocument();

    fireEvent.submit(form!);

    // Verify that the form action was called
    expect(mockFormAction).toHaveBeenCalled();
  });

  test("Displays error message when present in state", () => {
    // Override the mock to include an error message
    jest.spyOn(require("react"), "useActionState").mockImplementation(() => [
      {
        message: null,
        errors: {
          email: ["Please enter a valid email address"],
        },
      },
      jest.fn(),
    ]);

    render(<LoginForm />);

    // Check if error message is displayed
    expect(
      screen.getByText("Please enter a valid email address"),
    ).toBeInTheDocument();
  });
});
