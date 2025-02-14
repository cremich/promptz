import { describe, expect, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { ErrorMessage } from "@/app/ui/error-message";

describe("Error Message", () => {
  test("renders error message unchanged", () => {
    const { container } = render(<ErrorMessage description="error" />);
    expect(container).toMatchSnapshot();
  });
});
