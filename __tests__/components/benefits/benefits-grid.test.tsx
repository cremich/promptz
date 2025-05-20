import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import BenefitsGrid from "@/components/benefits/benefits-grid";

// Mock child components
jest.mock("@/components/benefits/benefits-card", () => {
  return function BenefitsCard() {
    return <div data-testid="benefits-card">Benefits Card</div>;
  };
});

describe("Benefits Grid", () => {
  test("Renders headline", () => {
    render(<BenefitsGrid />);

    const heading = screen.getByRole("heading", { level: 2 });

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Why Promptz?");
  });

  test("Renders four benefits", async () => {
    render(<BenefitsGrid />);
    expect(await screen.findAllByTestId("benefits-card")).toHaveLength(4);
  });
});
