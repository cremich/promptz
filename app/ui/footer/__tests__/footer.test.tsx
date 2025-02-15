import { describe, expect, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import Footer from "@/app/ui/footer/footer";

describe("Footer", () => {
  test("renders footer unchanged", () => {
    const { container } = render(<Footer />);
    expect(container).toMatchSnapshot();
  });
});
