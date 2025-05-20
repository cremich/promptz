import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "@/app/page";

// Mock child components
jest.mock("@/components/search/search-form", () => {
  return function SearchForm() {
    return <div data-testid="search-form-mock">Search Form Mock</div>;
  };
});

jest.mock("@/components/benefits/benefits-grid", () => {
  return function BenefitsGrid() {
    return <div data-testid="benefits-grid">Benefits Grid</div>;
  };
});

describe("Home Page", () => {
  test("Renders headline", () => {
    render(<App />);

    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(
      "Simplify promptingfor Amazon Q Developer",
    );
  });

  test("Renders a search form component", () => {
    render(<App />);
    expect(screen.getByTestId("search-form-mock")).toBeInTheDocument();
  });

  test("Renders a benefits grid form component", () => {
    render(<App />);
    expect(screen.getByTestId("benefits-grid")).toBeInTheDocument();
  });
});
