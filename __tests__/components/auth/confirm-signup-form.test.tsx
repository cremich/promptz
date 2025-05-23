import { describe, expect, test } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ConfirmSignUpForm } from "@/components/auth/confirm-signup-form";

// Mock the useActionState hook and formAction
const mockFormAction = jest.fn();
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: () => [{ message: null, errors: {} }, mockFormAction],
}));

describe("ConfirmSignUpForm", () => {
  test("Renders form with all required elements", () => {
    render(<ConfirmSignUpForm />);

    // Check if title and description are present
    expect(screen.getByText("You've got mail")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Your confirmation code is on the way. Enter the code we emailed you to confirm your account creation. It may take a minute to arrive.",
      ),
    ).toBeInTheDocument();

    // Check if input field is present
    expect(screen.getByLabelText("Confirmation Code")).toBeInTheDocument();

    // Check if submit button is present
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
  });

  test("Input field has correct attributes", () => {
    render(<ConfirmSignUpForm />);

    const input = screen.getByLabelText("Confirmation Code");
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("required");
    expect(input).toHaveAttribute("maxLength", "6");
    expect(input).toHaveAttribute("placeholder", "123456");
  });

  test("Form submission with input value", () => {
    const { container } = render(<ConfirmSignUpForm />);

    // Get the input field and enter a value
    const input = screen.getByLabelText("Confirmation Code");
    fireEvent.change(input, { target: { value: "123456" } });

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
        message: "Invalid confirmation code",
        errors: {
          code: ["Please enter a valid confirmation code"],
        },
      },
      jest.fn(),
    ]);

    render(<ConfirmSignUpForm />);

    // Check if error messages are displayed
    expect(screen.getByText("Invalid confirmation code")).toBeInTheDocument();
    expect(
      screen.getByText("Please enter a valid confirmation code"),
    ).toBeInTheDocument();
  });
});
