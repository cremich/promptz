import { describe, expect, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import MobileMenu from "@/app/ui/navigation/mobile-menu";

describe("Mobile Menu Navigation ", () => {
  test("renders mobile menu unchanged", () => {
    const { container } = render(<MobileMenu />);
    expect(container).toMatchSnapshot();
  });

  test("changes value when clicked", async () => {
    render(<MobileMenu />);

    // get a hold of the button element, and trigger some clicks on it
    const button = screen.getByTestId("menu-button");

    act(() => {
      fireEvent.click(button);
    });

    expect(screen.getByTestId("menu-button-x")).toBeInTheDocument();
  });
});
