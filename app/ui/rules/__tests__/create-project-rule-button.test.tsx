import CreateProjectRuleButton from "@/app/ui/rules/create-project-rule-button";
import { describe, expect, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

describe("CreateProjectRuleButton", () => {
  test("renders a link with correct href", () => {
    render(<CreateProjectRuleButton />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/rules/create`);
  });
});
