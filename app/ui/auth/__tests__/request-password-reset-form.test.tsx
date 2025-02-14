import { describe, expect, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { RequestPasswordForm } from "@/app/ui/auth/request-password-form";

describe("Request Password Form", () => {
  test("renders request password form unchanged", () => {
    const { container } = render(<RequestPasswordForm />);
    expect(container).toMatchSnapshot();
  });
});
