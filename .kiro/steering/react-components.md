---
inclusion: fileMatch
fileMatchPattern: "**/*.{tsx,jsx}"
---

# React Components Standards

## Component Architecture

- Use functional components exclusively - avoid class components
- Use the `function` keyword for component declarations for consistency
- Implement early returns to reduce nesting and improve readability
- Context: Functional components are simpler, have better performance, and align with modern React patterns
- Use PascalCase for all React component names
- Use descriptive names that clearly express component purpose
- Prefix event handler functions with "handle" (handleClick, handleSubmit, handleKeyDown)
- Context: Consistent naming improves code readability and follows React conventions
- Define component properties using TypeScript interfaces
- Use descriptive interface names that match the component name
- Make props immutable - avoid mutating props within components
- Context: TypeScript interfaces provide compile-time safety and serve as documentation

## JSX Best Practices

- Write declarative JSX with clear, readable structure
- Minimize nesting depth - extract complex JSX into separate components
- Avoid unnecessary curly braces in conditionals - use concise syntax
- Use semantic HTML elements for better accessibility
- Context: Clean JSX improves maintainability and accessibility

## Component Organization

- Organize components by feature in logical directory structures
- Use kebab-case for directory names (user-profile, auth-forms)
- Place shared components in a common `components/` directory
- Context: Feature-based organization makes components easier to find and maintain
- Use kebab-case for component file names
- Match file names to the primary component they export
- Use `.tsx` extension for components with JSX, `.ts` for utilities
- Context: Consistent file naming prevents confusion and follows web standards

## State Management

- Use `useState` for simple local component state
- Use `useReducer` for complex state logic with multiple sub-values
- Keep state as close to where it's used as possible
- Context: Local state is easier to reason about and test than global state
- Use functional updates when new state depends on previous state
- Batch related state updates to prevent unnecessary re-renders
- Avoid directly mutating state objects or arrays
- Context: Proper state updates prevent bugs and improve performance

## Event Handling

- Prefix all event handlers with "handle" (handleClick, handleSubmit)
- Use descriptive names that indicate the action being performed
- Keep event handlers close to where they're used in the JSX
- Context: Consistent naming makes event flow easier to follow
- Extract complex event logic into separate functions
- Prevent default behavior when necessary using `event.preventDefault()`
- Use event delegation for lists of similar elements when appropriate
- Context: Clean event handlers improve code organization and performance

## Accessibility

- Add appropriate ARIA labels to interactive elements
- Implement keyboard navigation with tabindex and key handlers
- Provide focus indicators for keyboard users
- Use semantic HTML elements when possible
- Context: Accessibility ensures your application is usable by everyone
- Use descriptive alt text for images
- Implement proper heading hierarchy (h1, h2, h3)
- Add ARIA roles and properties where semantic HTML isn't sufficient
- Context: Screen reader support makes content accessible to visually impaired users

## Performance Optimization

- Use `React.memo` for components that receive the same props frequently
- Use `useMemo` for expensive calculations that depend on specific dependencies
- Use `useCallback` for event handlers passed to child components
- Context: Memoization prevents unnecessary re-renders and improves performance
- Split large components into smaller, focused components
- Extract reusable logic into custom hooks
- Use dynamic imports for components that aren't immediately needed
- Context: Smaller components are easier to test, debug, and maintain

## Error Handling

- Implement error boundaries to catch and handle component errors gracefully
- Provide meaningful error messages and recovery options
- Log errors to monitoring services for debugging
- Context: Error boundaries prevent entire application crashes from component errors
- Validate props and data before using them in components
- Provide default values for optional props
- Handle loading and error states explicitly
- Context: Defensive programming prevents runtime errors and improves user experience