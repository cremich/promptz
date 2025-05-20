import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import BenefitCard from "@/components/benefits/benefits-card";
import { Lightbulb } from "lucide-react";

describe("Benefit Card", () => {
  const defaultProps = {
    title: "Test Title",
    content: "Test Content",
    icon: Lightbulb,
  };

  test("Renders card with title, content and icon", () => {
    render(<BenefitCard {...defaultProps} />);

    // Check if title is rendered
    expect(screen.getByText("Test Title")).toBeInTheDocument();

    // Check if content is rendered
    expect(screen.getByText("Test Content")).toBeInTheDocument();

    // Check if icon is rendered (by its role)
    const icon = document.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  test("Does not render CTA when not provided", () => {
    render(<BenefitCard {...defaultProps} />);

    // The link should not be in the document
    const links = document.querySelectorAll("a");
    expect(links.length).toBe(0);
  });

  test("Renders CTA link when provided", () => {
    const propsWithCta = {
      ...defaultProps,
      cta: {
        href: "/test-link",
        text: "Learn More",
      },
    };

    render(<BenefitCard {...propsWithCta} />);

    // Check if CTA link is rendered with correct text and href
    const link = screen.getByText("Learn More");
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/test-link");
  });
});
