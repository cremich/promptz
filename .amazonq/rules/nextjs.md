# Development Guidelines for Next.js

## Code Implementation Guidelines

Follow these rules when you write code:

- Use next.js app router.
- Use early returns whenever possible to make the code more readable.
- Use descriptive variable and function names.
- Event functions should be named with a “handle” prefix, like “handleClick” for onClick and “handleKeyDown” for onKeyDown.
- Implement accessibility features on elements. For example, a tag should have a tabindex, aria-label, on:click, on:keydown, and similar attributes.
- Use functional and declarative programming patterns. Avoid classes.
- Use the function keyword for functions.
- Use Zod for schema validation and type inference.
- Use path alias to simplify import statements

### Naming conventions

- Use PascalCase for variable, function or react component names.
- Use lowercase with dashes for directors (e.g. components/my-form.tsx)

### UI and Styling

- Use Shadcn UI components and tailwind for components ant styling.
- Always use Tailwind classes for styling HTML elements.
- Implement responsive design with Tailwind CSS.
- Use a mobile-first approach.
- Focus on a clean and minimal UI design.
- Use dark mode as the primary theme.
- Optimize for fast loading times.
- Ensure intuitive navigation.

### React components

- Favor react server components and minimize the use of client components
- Data fetching is implemented in pages.
- Write declarative JSX with clear and readable structure.
- Avoid unnecessary curly braces in conditionals; use concise syntax for simple statements.
- Use interfaces to define component properties.
- Use `components/ui` for Shadcn UI components.
- Use `app/ui/` to organized custom components by feature.
- Avoid handling authentication releated redirects in components. Use the middleware.ts instead.

### Server Actions

- Use `app/lib/actions` for server actions.
- Read and write operations must be organized in separate files.
- Read operations are added to a file that is named like the data model (e.g. prompt.ts for reading operations of prompts, project-rules.ts for reading operations of project rules, etc.)

### Forms

- Utilize Zod for both client-side and server-side form validation.
- Use `useActionState` and `useForm` for form handling.
- Form submissions are handled by separate files (e.g. prompt-form.ts for the prompt form server actions, project-rules-form.ts for project rules server actions, etc.)
- Handle form submissions in a single `onSubmitAction` function with the following signature: `export async function onSubmitAction(prevState: FormState, data: FormData): Promise<FormState>`
- `onSubmitAction` handles both creating and updating data depending on the existence of an id attribute.
- Deletions are handled in a separate `delete` function.
- Deletions need to be confirmed by the user using a Shadcn alert component
- Id attributes are added as hidden form fields using
  ```typescript
  <FormField
      control={form.control}
      name="id"
      render={({ field }) => <input type="hidden" {...field} />}
  />
  ```

## Unit Testing

1. Always use Jest and React Testing Library for component testing.
2. Use `test()` instead of `it()` for consistency across the codebase.
3. Organize tests in a hierarchical structure using `describe()` blocks.
4. Write descriptive test names that clearly explain what is being tested.
5. Follow the arrange-act-assert pattern in test cases.
6. Mock external dependencies and services to isolate the component under test.
7. Test component behavior rather than implementation details and CSS styling.
8. Prefer testing user interactions over internal state.
9. Focus on component testing. Skip creating unit tests for server-actions.

### File Structure and Naming

1. Test files must be placed in the `./__tests__` directory located in the root directory mirroring the source directory structure.
2. Test files must be named with the `.test.tsx` extension.
3. Test files should match the name of the component or function being tested.

### Component Testing

1. Test rendering of components with different props and states.
2. Verify that components render expected elements and text.
3. Test user interactions using `fireEvent` or `userEvent`.
4. Verify that components respond correctly to user interactions.
5. Test accessibility features when applicable.
6. Prefer role-based queries over test IDs when possible.
7. Test that components handle edge cases and error states gracefully.

### Mocking

1. Mock child components when testing parent components to isolate behavior.
2. Mock external dependencies such as services, server actions, libraries and APIs.
3. Reset mocks between tests to prevent test pollution.

### Assertions

1. Use specific assertions that clearly communicate what is being tested.
2. Prefer `toBeInTheDocument()` over `toBeTruthy()` for DOM elements.
3. Use `toHaveTextContent()` to verify text content.
4. Use `toHaveAttribute()` to verify element attributes.
5. Use `toHaveBeenCalled()` and `toHaveBeenCalledWith()` to verify function calls.
6. Use `toHaveLength()` to verify array lengths.
7. Use `toMatchSnapshot()` sparingly and only for stable components.

### Async Testing

1. Use `async/await` syntax for asynchronous tests.
2. Use `waitFor()` to wait for asynchronous operations to complete.
3. Use `findBy*` queries for elements that appear asynchronously.
4. Handle promises properly in asynchronous tests.
5. Test loading states and error states for async operations.
