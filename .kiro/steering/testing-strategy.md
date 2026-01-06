---
inclusion: fileMatch
fileMatchPattern: "__tests__/**/*.ts"
---

# Testing Strategy

## Testing Framework and Tools

- Use Jest and React Testing Library for all component testing
- Use `test()` function instead of `it()` for consistency across the codebase
- Use `@testing-library/jest-dom` for enhanced DOM assertions
- Context: Jest and React Testing Library provide comprehensive testing capabilities with excellent React integration
- Use `fast-check` library for property-based testing when applicable
- Tag property-based tests with format: `// Feature: {feature-description}, Property {number}: {property_text}`
- Context: Property-based testing validates behavior across wide input ranges and catches edge cases

## Test Organization and Structure

- Organize tests in hierarchical structure using `describe()` blocks
- Write descriptive test names that clearly explain what is being tested
- Follow arrange-act-assert pattern in all test cases
- Context: Clear test organization improves readability and makes failures easier to debug
- Place test files in `__tests__` directory mirroring source directory structure
- Use `.test.tsx` or `.test.ts` extensions for all test files
- Match test file names to the component or function being tested
- Context: Consistent file organization makes tests easy to locate and maintain

## Testing Approach and Priorities

- Focus on component testing - skip creating unit tests for server actions
- Test component behavior rather than implementation details and CSS styling
- Prefer testing user interactions over internal state changes
- Context: Behavior-focused testing provides more reliable tests that don't break with refactoring
- Test rendering of components with different props and states
- Verify that components render expected elements and text content
- Test user interactions using `fireEvent` or `userEvent` libraries
- Verify that components respond correctly to user interactions
- Context: Comprehensive component testing ensures UI reliability and user experience

## Mocking and Isolation

- Mock external dependencies such as services, server actions, libraries and APIs
- Mock child components when testing parent components to isolate behavior
- Reset mocks between tests to prevent test pollution
- Context: Proper mocking isolates components under test and prevents external dependencies from affecting test results
- Mock Next.js router and navigation functions for routing tests
- Mock data fetching functions to control test scenarios
- Use `jest.mock()` for module-level mocking
- Context: Mocking external systems enables predictable test execution and faster test runs

## Assertions and Expectations

- Use specific assertions that clearly communicate what is being tested
- Prefer `toBeInTheDocument()` over `toBeTruthy()` for DOM element verification
- Use `toHaveTextContent()` to verify text content accurately
- Use `toHaveAttribute()` to verify element attributes and properties
- Context: Specific assertions provide clearer test failure messages and better test documentation
- Use `toHaveBeenCalled()` and `toHaveBeenCalledWith()` for function call verification
- Use `toHaveLength()` to verify array lengths and collection sizes
- Use `toMatchSnapshot()` sparingly and only for stable, well-established components
- Context: Function call assertions verify component interactions while snapshot testing should be used judiciously

## Asynchronous Testing

- Use `async/await` syntax for all asynchronous test operations
- Use `waitFor()` to wait for asynchronous operations to complete properly
- Use `findBy*` queries for elements that appear asynchronously
- Handle promises properly in asynchronous tests to prevent race conditions
- Context: Proper async handling prevents flaky tests and ensures reliable test execution
- Test loading states and error states for async operations comprehensively
- Mock async functions to return resolved or rejected promises as needed
- Use appropriate timeouts for async operations
- Context: Testing async states ensures components handle all scenarios gracefully

## Accessibility Testing

- Test accessibility features when applicable to ensure inclusive design
- Prefer role-based queries over test IDs for more semantic testing
- Verify keyboard navigation functionality in interactive components
- Test screen reader compatibility using appropriate ARIA attributes
- Context: Accessibility testing ensures applications are usable by everyone and follows web standards
- Use `getByRole()`, `getByLabelText()`, and `getByText()` queries when possible
- Test focus management in complex interactive components
- Verify color contrast and visual accessibility requirements
- Context: Semantic queries make tests more robust and aligned with user experience

## Form Testing

- Test form validation with both valid and invalid inputs
- Verify form submission behavior with correct data handling
- Test error message display and user feedback mechanisms
- Mock form submission handlers to verify correct data passing
- Context: Form testing ensures data integrity and proper user interaction flows
- Test form field interactions including typing, selection, and clearing
- Verify form state management and field dependencies
- Test form accessibility including label associations and error announcements
- Context: Comprehensive form testing prevents data loss and improves user experience

## Error Handling and Edge Cases

- Test that components handle edge cases and error states gracefully
- Mock error scenarios to verify error boundary functionality
- Test component behavior with missing or malformed props
- Verify error message display and recovery mechanisms
- Context: Error testing ensures application stability and good user experience during failures
- Test network failure scenarios for data-dependent components
- Verify loading state handling during slow operations
- Test component behavior with empty data sets
- Context: Edge case testing prevents application crashes and improves reliability

## Performance Testing Considerations

- Avoid testing performance-specific implementation details
- Focus on user-perceivable performance impacts in tests
- Test that expensive operations are properly memoized when user-facing
- Verify that components don't cause unnecessary re-renders
- Context: Performance testing should focus on user experience rather than internal optimizations
- Test lazy loading behavior for code-split components
- Verify that large data sets are handled appropriately
- Test component cleanup to prevent memory leaks
- Context: Performance-conscious testing ensures scalable application behavior

## Integration Testing

- Test component integration with Next.js App Router features
- Verify Server Component and Client Component interactions
- Test data fetching integration with proper mocking
- Test routing and navigation functionality
- Context: Integration testing ensures components work correctly within the Next.js ecosystem
- Test form integration with Server Actions
- Verify cache behavior in cached components
- Test error boundary integration across component hierarchies
- Context: Integration testing catches issues that unit tests might miss

## Test Maintenance and Quality

- Keep tests simple and focused on single behaviors
- Refactor tests when components change to maintain relevance
- Remove obsolete tests that no longer provide value
- Document complex test setups and unusual testing patterns
- Context: Well-maintained tests provide ongoing value and don't become technical debt
- Review test coverage regularly but prioritize meaningful tests over coverage metrics
- Update tests when requirements change to maintain accuracy
- Share testing patterns and utilities across the team
- Context: Test quality is more important than test quantity for long-term maintainability
