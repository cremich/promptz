import { describe, expect, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import LoadingButton from "@/app/ui/navigation/loading-button";

describe("Loading Button", () => {
  test("renders loading button unchanged", () => {
    const { container } = render(<LoadingButton />);
    expect(container).toMatchSnapshot();
  });
});
