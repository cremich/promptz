# Next.js Development

## Purpose

This rule defines coding standards and best practices for Next.js development in the Promptz project, ensuring consistent code quality, maintainable architecture, and optimal user experience across all team members.

## Instructions

### Core Framework

- ALWAYS use Next.js App Router for all routing and page structure. (ID: USE_APP_ROUTER)
- Use early returns whenever possible to improve code readability and reduce nesting. (ID: EARLY_RETURNS)
- Use descriptive variable and function names that clearly express intent and purpose. (ID: DESCRIPTIVE_NAMES)
- Event functions MUST be named with "handle" prefix (handleClick, handleKeyDown, handleSubmit). (ID: EVENT_NAMING)
- Implement accessibility features on interactive elements including tabindex, aria-label, keyboard handlers. (ID: ACCESSIBILITY_REQUIRED)
- Use functional and declarative programming patterns - avoid classes unless absolutely necessary. (ID: FUNCTIONAL_PATTERNS)
- Use the function keyword for function declarations to maintain consistency. (ID: FUNCTION_KEYWORD)
- Use Zod for all schema validation and type inference throughout the application. (ID: ZOD_VALIDATION)
- Use path aliases (@/) to simplify import statements and improve maintainability. (ID: PATH_ALIASES)

### Naming Conventions

- Use PascalCase for React component names, variables, and function names. (ID: PASCALCASE_NAMING)
- Use lowercase with dashes for directory names (components/my-form, app/user-profile). (ID: DIRECTORY_NAMING)

### UI and Styling

- ALWAYS use Shadcn UI components as the primary component library. (ID: SHADCN_COMPONENTS)
- Use Tailwind CSS classes exclusively for styling - no custom CSS unless absolutely necessary. (ID: TAILWIND_STYLING)
- Implement responsive design using Tailwind's mobile-first approach with sm:, md:, lg: breakpoints. (ID: RESPONSIVE_DESIGN)
- Use dark mode as the primary theme with appropriate color schemes. (ID: DARK_MODE_PRIMARY)
- Optimize for fast loading times by minimizing bundle size and using appropriate loading strategies. (ID: PERFORMANCE_OPTIMIZATION)
- Ensure intuitive navigation patterns and clear user flows. (ID: INTUITIVE_NAVIGATION)

### React Components

- ALWAYS favor React Server Components over Client Components unless interactivity is required. (ID: PREFER_SERVER_COMPONENTS)
- Implement data fetching in page components, not in nested components. (ID: PAGE_DATA_FETCHING)
- Write declarative JSX with clear, readable structure and minimal nesting. (ID: DECLARATIVE_JSX)
- Avoid unnecessary curly braces in conditionals - use concise syntax for simple statements. (ID: CONCISE_CONDITIONALS)
- Define component properties using TypeScript interfaces with clear, descriptive names. (ID: TYPESCRIPT_INTERFACES)
- Place Shadcn UI components in `components/ui/` directory. (ID: SHADCN_LOCATION)
- Organize custom components by feature in `app/ui/` directory structure. (ID: FEATURE_ORGANIZATION)
- Handle authentication redirects in middleware.ts, never in components. (ID: AUTH_MIDDLEWARE)

### Server Actions

- Place all server actions in `app/lib/actions/` directory with clear organization. (ID: SERVER_ACTIONS_LOCATION)
- Separate read and write operations into different files for better maintainability. (ID: SEPARATE_READ_WRITE)
- Name read operation files after the data model (prompt.ts, project-rules.ts, tags.ts). (ID: READ_FILE_NAMING)

### Forms

- Use Zod for both client-side and server-side form validation consistently. (ID: ZOD_FORM_VALIDATION)
- Use `useActionState` and `useForm` hooks for form state management. (ID: FORM_HOOKS)
- Handle form submissions in separate files named after the form (prompt-form.ts, project-rules-form.ts). (ID: FORM_ACTION_FILES)
- Implement single `onSubmitAction` function with signature: `export async function onSubmitAction(prevState: FormState, data: FormData): Promise<FormState>`. (ID: SUBMIT_ACTION_SIGNATURE)
- Handle both create and update operations in `onSubmitAction` based on id existence. (ID: CRUD_IN_SUBMIT)
- Implement deletions in separate `delete` function with user confirmation. (ID: SEPARATE_DELETE)
- Require user confirmation for deletions using Shadcn Alert Dialog component. (ID: DELETE_CONFIRMATION)
- Add id attributes as hidden form fields using FormField pattern. (ID: HIDDEN_ID_FIELDS)

### Testing Standards

- Use Jest and React Testing Library for all component testing. (ID: TESTING_TOOLS)
- Use `test()` function instead of `it()` for consistency across codebase. (ID: TEST_FUNCTION)
- Organize tests hierarchically using `describe()` blocks for better structure. (ID: TEST_ORGANIZATION)
- Write descriptive test names that clearly explain the behavior being tested. (ID: DESCRIPTIVE_TEST_NAMES)
- Follow arrange-act-assert pattern in all test cases. (ID: AAA_PATTERN)
- Mock external dependencies and services to isolate components under test. (ID: MOCK_DEPENDENCIES)
- Test component behavior rather than implementation details or CSS styling. (ID: BEHAVIOR_TESTING)
- Prefer testing user interactions over internal state changes. (ID: USER_INTERACTION_TESTING)
- Focus on component testing - skip unit tests for server actions. (ID: COMPONENT_FOCUS)

### Test File Organization

- Place test files in `__tests__` directory mirroring source structure. (ID: TEST_DIRECTORY)
- Use `.test.tsx` extension for all test files. (ID: TEST_EXTENSION)
- Match test file names to component or function being tested. (ID: TEST_FILE_NAMING)

### Test Implementation

- Test component rendering with different props and states. (ID: RENDER_TESTING)
- Verify expected elements and text content are rendered correctly. (ID: CONTENT_VERIFICATION)
- Test user interactions using `fireEvent` or `userEvent` libraries. (ID: INTERACTION_TESTING)
- Verify components respond correctly to user interactions. (ID: RESPONSE_VERIFICATION)
- Test accessibility features when applicable to ensure inclusive design. (ID: ACCESSIBILITY_TESTING)
- Prefer role-based queries over test IDs for more semantic testing. (ID: ROLE_BASED_QUERIES)
- Test edge cases and error states to ensure robust component behavior. (ID: EDGE_CASE_TESTING)

### Test Mocking

- Mock child components when testing parent components for isolation. (ID: MOCK_CHILDREN)
- Mock external dependencies including services, server actions, and APIs. (ID: MOCK_EXTERNALS)
- Reset mocks between tests to prevent test pollution and ensure clean state. (ID: RESET_MOCKS)

### Test Assertions

- Use specific assertions that clearly communicate what is being tested. (ID: SPECIFIC_ASSERTIONS)
- Prefer `toBeInTheDocument()` over `toBeTruthy()` for DOM element verification. (ID: DOM_ASSERTIONS)
- Use `toHaveTextContent()` to verify text content accurately. (ID: TEXT_ASSERTIONS)
- Use `toHaveAttribute()` to verify element attributes and properties. (ID: ATTRIBUTE_ASSERTIONS)
- Use `toHaveBeenCalled()` and `toHaveBeenCalledWith()` for function call verification. (ID: FUNCTION_ASSERTIONS)
- Use `toHaveLength()` to verify array lengths and collection sizes. (ID: LENGTH_ASSERTIONS)
- Use `toMatchSnapshot()` sparingly and only for stable, well-established components. (ID: SNAPSHOT_SPARINGLY)

### Async Testing

- Use `async/await` syntax for all asynchronous test operations. (ID: ASYNC_SYNTAX)
- Use `waitFor()` to wait for asynchronous operations to complete properly. (ID: WAIT_FOR_ASYNC)
- Use `findBy*` queries for elements that appear asynchronously. (ID: ASYNC_QUERIES)
- Handle promises properly in asynchronous tests to prevent race conditions. (ID: PROMISE_HANDLING)
- Test loading states and error states for async operations comprehensively. (ID: ASYNC_STATES)

## Priority

High

## Error Handling

- If Shadcn UI components are unavailable, use semantic HTML with Tailwind classes and note the deviation
- If TypeScript interfaces conflict, prioritize type safety and create union types where necessary
- If server actions fail, implement proper error boundaries and user feedback mechanisms
- If tests fail due to async timing, increase wait timeouts and add proper async handling
- If accessibility requirements cannot be met, document the limitation and provide alternative solutions
