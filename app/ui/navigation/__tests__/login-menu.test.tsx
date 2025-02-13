import { describe, expect, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import LoginMenu from "@/app/ui/navigation/login-menu";

describe("Login Menu ", () => {
  test("renders login menu unchanged", () => {
    const { container } = render(<LoginMenu />);
    expect(container).toMatchSnapshot();
  });
});
