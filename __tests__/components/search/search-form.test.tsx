import { describe, expect, test } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SearchForm from "@/components/search/search-form";

// Mock the Next.js router
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("Search Form", () => {
  beforeEach(() => {
    // Clear mock calls between tests
    mockPush.mockClear();
  });

  test("Renders search input and button", () => {
    render(<SearchForm />);

    // Check if search input is rendered
    const searchInput = screen.getByPlaceholderText(
      "The perfect prompt is just one click away!",
    );
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute("type", "search");
    expect(searchInput).toHaveAttribute("name", "query");

    // Check if search button is rendered
    const searchButton = screen.getByRole("button", { name: /search/i });
    expect(searchButton).toBeInTheDocument();
    expect(searchButton).toHaveAttribute("type", "submit");
  });

  test("Updates search term on input change", () => {
    render(<SearchForm />);

    const searchInput = screen.getByPlaceholderText(
      "The perfect prompt is just one click away!",
    );

    // Simulate user typing in the search box
    fireEvent.change(searchInput, { target: { value: "test query" } });

    // Check if the input value was updated
    expect(searchInput).toHaveValue("test query");
  });

  test("Navigates to browse page with query parameter on form submission", () => {
    render(<SearchForm />);

    const searchInput = screen.getByPlaceholderText(
      "The perfect prompt is just one click away!",
    );
    const searchButton = screen.getByRole("button", { name: /search/i });

    // Enter a search term and submit the form
    fireEvent.change(searchInput, { target: { value: "test query" } });
    fireEvent.click(searchButton);

    // Check if router.push was called with the correct URL
    expect(mockPush).toHaveBeenCalledWith("/browse?query=test%20query");
  });

  test("Does not navigate when search term is empty", () => {
    render(<SearchForm />);

    const searchButton = screen.getByRole("button", { name: /search/i });

    // Submit the form with empty search term
    fireEvent.click(searchButton);

    // Check that router.push was not called
    expect(mockPush).not.toHaveBeenCalled();
  });

  test("Trims whitespace from search term", () => {
    render(<SearchForm />);

    const searchInput = screen.getByPlaceholderText(
      "The perfect prompt is just one click away!",
    );
    const searchButton = screen.getByRole("button", { name: /search/i });

    // Enter a search term with whitespace and submit the form
    fireEvent.change(searchInput, { target: { value: "  test query  " } });
    fireEvent.click(searchButton);

    // Check if router.push was called with the trimmed URL
    expect(mockPush).toHaveBeenCalledWith("/browse?query=test%20query");
  });
});
