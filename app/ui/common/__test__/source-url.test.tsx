import { SourceURL } from "@/app/ui/common/source-url";
import { describe, expect, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

describe("SourceURL", () => {
  test("renders the prompt form component unchanged", () => {
    const { container } = render(<SourceURL url="https://promptz.dev" />);
    expect(container).toMatchSnapshot();
  });
});
