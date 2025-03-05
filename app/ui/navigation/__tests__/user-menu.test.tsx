import { describe, expect, test } from "@jest/globals";
import "@testing-library/jest-dom";
import UserMenu from "@/app/ui/navigation/user-menu";
import { render } from "@testing-library/react";

describe("User Menu Button", () => {
  test("renders user menu unchanged", () => {
    const { container } = render(<UserMenu />);
    expect(container).toMatchSnapshot();
  });
});
