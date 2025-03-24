# Next.js rules

## General

- Follow the user’s requirements carefully & to the letter.
- Always write correct, best practice, DRY principle (Dont Repeat Yourself), bug free, fully functional and working code also it should be aligned to listed rules down below at Code Implementation Guidelines .
- Focus on easy and readability code, over being performant.
- Fully implement all requested functionality.
- Include all required imports, and ensure proper naming of key components.
- Use next.js app router.

### Code Implementation Guidelines

Follow these rules when you write code:

- Use early returns whenever possible to make the code more readable.
- Use descriptive variable and function names.
- Event functions should be named with a “handle” prefix, like “handleClick” for onClick and “handleKeyDown” for onKeyDown.
- Implement accessibility features on elements. For example, a tag should have a tabindex, aria-label, on:click, on:keydown, and similar attributes.
- Use functional and declarative programming patterns. Avoid classes.
- Use the function keyword for functions.
- Use Zod for schema validation and type inference.
- Use the `app/lib/definitions.ts` file for data model and schema related type definitions
- Use the `lib/formatter.ts` file for formatter related utility functions.
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

### Testing

- Write unit tests using Jest and React Testing Library
- Use snapshot tests to validate the rendering output of a component
- Use fine-grained assertions to test component behaviour and state management.
- When testing components, test the actual component behavior rather than mocking child components.
- Use the existing `./__mocks__` folder to mock AWS Amplify and next.js libraries.
- Always import jest globals `import { describe, expect, test } from "@jest/globals";`
- Use `test()` instead of `it()`
- Add tests into `__tests__` folder in the same folder where the unit to test is located.
