import { describe, expect, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { ConfirmPasswordResetForm } from "@/app/ui/auth/confirm-password-reset-form";

describe("Confirm Password Reset Form", () => {
  test("renders confirm password reset form unchanged", () => {
    const { container } = render(<ConfirmPasswordResetForm />);
    expect(container).toMatchSnapshot();
  });
});
