import { describe, expect, test } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SearchBox from "@/components/search/search-box";

// Mock lodash debounce to execute immediately in tests
jest.mock("lodash/debounce", () => (fn: Function) => fn);

// Mock the Next.js navigation hooks
const mockReplace = jest.fn();
const mockPathname = "/test-path";
const mockParams = new Map();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
  useSearchParams: () => ({
    get: (key: string) => mockParams.get(key),
    toString: () => "",
  }),
  usePathname: () => mockPathname,
}));

describe("SearchBox", () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockReplace.mockClear();
    mockParams.clear();
  });

  test("Renders search input with correct placeholder", () => {
    render(<SearchBox placeholder="Test placeholder" />);

    const searchInput = screen.getByPlaceholderText("Test placeholder");
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute("name", "query");
  });

  test("Renders search icon", () => {
    render(<SearchBox placeholder="Test placeholder" />);

    // Check if the search icon is rendered (by its parent container)
    const searchIcon = screen.getByTestId("search-icon");
    expect(searchIcon).toBeInTheDocument();
  });

  test("Updates search term on input change", () => {
    render(<SearchBox placeholder="Test placeholder" />);

    const searchInput = screen.getByRole("textbox");

    // Simulate user typing in the search box
    fireEvent.change(searchInput, { target: { value: "test query" } });

    // Check if router.replace was called (we can't check exact URL due to URLSearchParams complexity)
    expect(mockReplace).toHaveBeenCalled();
    // Verify the call contains our search term
    expect(mockReplace.mock.calls[0][0]).toContain("query=test");
  });

  test("Has correct default value from search params", () => {
    // Set up mock search params
    mockParams.set("query", "initial query");

    render(<SearchBox placeholder="Test placeholder" />);

    const searchInput = screen.getByRole("textbox");
    expect(searchInput).toHaveAttribute("value", "initial query");
  });
});
