import { describe, expect, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { LoginForm } from "@/app/ui/auth/login-form";

describe("Login  Form", () => {
  test("renders login  form unchanged", () => {
    const { container } = render(<LoginForm />);
    expect(container).toMatchSnapshot();
  });
});
