import { describe, expect, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import Benefits from "@/app/ui/landing-page/benefits";

describe("Benefits", () => {
  test("renders benefits unchanged", () => {
    const { container } = render(<Benefits />);
    expect(container).toMatchSnapshot();
  });
});
