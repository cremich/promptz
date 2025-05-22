# Testing Guidelines for unit tests

## Core Testing Principles

1. Always use Jest and React Testing Library for component testing.
2. Use `test()` instead of `it()` for consistency across the codebase.
3. Organize tests in a hierarchical structure using `describe()` blocks.
4. Write descriptive test names that clearly explain what is being tested.
5. Follow the arrange-act-assert pattern in test cases.
6. Mock external dependencies and services to isolate the component under test.
7. Test component behavior rather than implementation details and CSS styling.
8. Prefer testing user interactions over internal state.

## File Structure and Naming

1. Test files must be placed in the `./__tests__` directory located in the root directory mirroring the source directory structure.
2. Test files must be named with the `.test.tsx` extension.
3. Test files should match the name of the component or function being tested.

## Component Testing

1. Test rendering of components with different props and states.
2. Verify that components render expected elements and text.
3. Test user interactions using `fireEvent` or `userEvent`.
4. Verify that components respond correctly to user interactions.
5. Test accessibility features when applicable.
6. Prefer role-based queries over test IDs when possible.
7. Test that components handle edge cases and error states gracefully.

## Mocking

1. Mock child components when testing parent components to isolate behavior.
2. Mock external dependencies such as services, server actions, libraries and APIs.
3. Reset mocks between tests to prevent test pollution.

## Assertions

1. Use specific assertions that clearly communicate what is being tested.
2. Prefer `toBeInTheDocument()` over `toBeTruthy()` for DOM elements.
3. Use `toHaveTextContent()` to verify text content.
4. Use `toHaveAttribute()` to verify element attributes.
5. Use `toHaveBeenCalled()` and `toHaveBeenCalledWith()` to verify function calls.
6. Use `toHaveLength()` to verify array lengths.
7. Use `toMatchSnapshot()` sparingly and only for stable components.

## Async Testing

1. Use `async/await` syntax for asynchronous tests.
2. Use `waitFor()` to wait for asynchronous operations to complete.
3. Use `findBy*` queries for elements that appear asynchronously.
4. Handle promises properly in asynchronous tests.
5. Test loading states and error states for async operations.

## Examples

Below are the examples to use as reference for writing tests.

### Basic Component Test

```typescript
import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MyComponent from "@/components/my-component";

describe("MyComponent", () => {
  test("Renders component with default props", () => {
    render(<MyComponent />);

    // Check if component renders expected elements
    expect(screen.getByText("Expected Text")).toBeInTheDocument();
  });

  test("Renders component with custom props", () => {
    render(<MyComponent title="Custom Title" />);

    // Check if component renders with custom props
    expect(screen.getByText("Custom Title")).toBeInTheDocument();
  });
});
```

### Testing User Interactions

```typescript
import { describe, expect, test } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Button from "@/components/button";

describe("Button", () => {
  test("Calls onClick handler when clicked", () => {
    const handleClick = jest.fn();

    render(<Button onClick={handleClick}>Click Me</Button>);

    // Find the button and click it
    const button = screen.getByRole("button", { name: "Click Me" });
    fireEvent.click(button);

    // Verify that the click handler was called
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Testing Async Components

```typescript
import { describe, expect, test } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserProfile from "@/components/user-profile";

// Mock the data fetching function
jest.mock("@/lib/actions/user", () => ({
  fetchUser: jest.fn().mockResolvedValue({ name: "Test User", email: "test@example.com" }),
}));

describe("UserProfile", () => {
  test("Renders user data after loading", async () => {
    render(<UserProfile userId="123" />);

    // Check for loading state
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // Wait for user data to load
    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });

    // Verify that user data is displayed
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });
});
```

### Testing Forms

```typescript
import { describe, expect, test } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginForm from "@/components/login-form";

describe("LoginForm", () => {
  test("Submits form with user input", () => {
    const handleSubmit = jest.fn();

    render(<LoginForm onSubmit={handleSubmit} />);

    // Fill out form fields
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "user@example.com" },
    });

    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Log In" }));

    // Verify that form was submitted with correct data
    expect(handleSubmit).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "password123",
    });
  });

  test("Shows validation errors for invalid input", () => {
    render(<LoginForm onSubmit={jest.fn()} />);

    // Submit form without filling fields
    fireEvent.click(screen.getByRole("button", { name: "Log In" }));

    // Check for validation error messages
    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
  });
});
```

### Testing with Mocked Components

```typescript
import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Dashboard from "@/components/dashboard";

// Mock child components
jest.mock("@/components/user-profile", () => {
  return function MockUserProfile() {
    return <div data-testid="user-profile-mock">User Profile Mock</div>;
  };
});

jest.mock("@/components/activity-feed", () => {
  return function MockActivityFeed() {
    return <div data-testid="activity-feed-mock">Activity Feed Mock</div>;
  };
});

describe("Dashboard", () => {
  test("Renders all dashboard components", () => {
    render(<Dashboard />);

    // Check if mocked components are rendered
    expect(screen.getByTestId("user-profile-mock")).toBeInTheDocument();
    expect(screen.getByTestId("activity-feed-mock")).toBeInTheDocument();

    // Check dashboard title
    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
  });
});
```

### Testing Navigation

```typescript
import { describe, expect, test } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Navigation from "@/components/navigation";

// Mock Next.js router
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("Navigation", () => {
  test("Navigates to the correct page when link is clicked", () => {
    render(<Navigation />);

    // Find and click a navigation link
    const aboutLink = screen.getByRole("link", { name: "About" });
    fireEvent.click(aboutLink);

    // Verify that router.push was called with the correct path
    expect(mockPush).toHaveBeenCalledWith("/about");
  });
});
```

### Testing Error Handling

```typescript
import { describe, expect, test } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import DataDisplay from "@/components/data-display";

// Mock the data fetching function to simulate an error
jest.mock("@/lib/actions/data", () => ({
  fetchData: jest.fn().mockRejectedValue(new Error("Failed to fetch data")),
}));

describe("DataDisplay", () => {
  test("Shows error message when data fetching fails", async () => {
    render(<DataDisplay />);

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText("Error: Failed to fetch data")).toBeInTheDocument();
    });

    // Verify that retry button is displayed
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });
});
```
