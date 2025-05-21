import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Footer from "@/components/layout/footer";

// Mock the Github icon component
jest.mock("lucide-react", () => ({
  Github: () => <svg data-testid="github-icon" />,
}));

describe("Footer", () => {
  test("Renders copyright text correctly", () => {
    render(<Footer />);

    // Check if copyright text is rendered
    const copyrightText = screen.getByText(/© PROMPTZ. All rights reserved./i);
    expect(copyrightText).toBeInTheDocument();
  });

  test("Renders author link correctly", () => {
    render(<Footer />);

    // Check if author link is rendered with correct attributes
    const authorLink = screen.getByRole("link", { name: "Christian Bonzelet" });
    expect(authorLink).toBeInTheDocument();
    expect(authorLink).toHaveAttribute(
      "href",
      "https://linkedin.com/in/christian-bonzelet",
    );
    expect(authorLink).toHaveAttribute("target", "_blank");
    expect(authorLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("Renders Amazon Q Developer link correctly", () => {
    render(<Footer />);

    // Check if Amazon Q Developer link is rendered with correct attributes
    const amazonQLink = screen.getByRole("link", {
      name: "Amazon Q Developer",
    });
    expect(amazonQLink).toBeInTheDocument();
    expect(amazonQLink).toHaveAttribute(
      "href",
      "https://aws.amazon.com/q/developer/",
    );
    expect(amazonQLink).toHaveAttribute("target", "_blank");
    expect(amazonQLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("Renders GitHub link with icon correctly", () => {
    render(<Footer />);

    // Check if GitHub link is rendered with correct attributes
    const githubLink = screen.getByRole("link", { name: "GitHub" });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/cremich/promptz",
    );
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");

    // Check if GitHub icon is rendered
    const githubIcon = screen.getByTestId("github-icon");
    expect(githubIcon).toBeInTheDocument();
  });
});
