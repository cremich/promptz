import { describe, expect, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { ConfirmSignUpForm } from "@/app/ui/auth/confirm-signup-form";

describe("Confirm Signup Form", () => {
  test("renders confirm signup form unchanged", () => {
    const { container } = render(<ConfirmSignUpForm />);
    expect(container).toMatchSnapshot();
  });
});
