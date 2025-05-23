import { describe, expect, test } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ConfirmSignInForm } from "@/components/auth/confirm-signin-form";

// Mock the useActionState hook and formAction
const mockFormAction = jest.fn();
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: () => [{ message: null, errors: {} }, mockFormAction],
}));

describe("ConfirmSignInForm", () => {
  test("Renders form with all required elements", () => {
    render(<ConfirmSignInForm />);

    // Check if title and description are present
    expect(screen.getByText("You've got mail")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Your one-time password is on the way. To log in, enter the code we emailed you. It may take a minute to arrive.",
      ),
    ).toBeInTheDocument();

    // Check if input field is present
    expect(screen.getByLabelText("One-Time Password")).toBeInTheDocument();

    // Check if submit button is present
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
  });

  test("Input field has correct attributes", () => {
    render(<ConfirmSignInForm />);

    const input = screen.getByLabelText("One-Time Password");
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("required");
    expect(input).toHaveAttribute("maxLength", "8");
    expect(input).toHaveAttribute("placeholder", "12345678");
  });

  test("Form submission with input value", () => {
    const { container } = render(<ConfirmSignInForm />);

    // Get the input field and enter a value
    const input = screen.getByLabelText("One-Time Password");
    fireEvent.change(input, { target: { value: "12345678" } });

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
        message: "Invalid code provided",
        errors: {
          code: ["Please enter a valid code"],
        },
      },
      jest.fn(),
    ]);

    render(<ConfirmSignInForm />);

    // Check if error messages are displayed
    expect(screen.getByText("Invalid code provided")).toBeInTheDocument();
    expect(screen.getByText("Please enter a valid code")).toBeInTheDocument();
  });
});
