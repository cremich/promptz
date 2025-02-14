import { describe, expect, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { SignUpForm } from "@/app/ui/auth/signup-form";

describe("Signup Form", () => {
  test("renders signup form unchanged", () => {
    const { container } = render(<SignUpForm />);
    expect(container).toMatchSnapshot();
  });
});
