import { describe, expect, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import BenefitCard from "@/app/ui/landing-page/benefits-card";
import { Code } from "lucide-react";

describe("Benefits Card", () => {
  test("renders benefits card unchanged", () => {
    const { container } = render(
      <BenefitCard
        icon={Code}
        title="Ready-to-Use Solutions"
        content=" Simplify software development with our curated collection of
        production-ready prompt templates"
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
