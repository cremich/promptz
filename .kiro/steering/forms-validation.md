---
inclusion: fileMatch
fileMatchPattern: "**/*{form,Form}*.{tsx,ts}"
---

# Forms and Validation Standards

## Schema Validation

- Use Zod for all schema validation and type inference
- Define schemas close to where they're used or in a shared schemas directory
- Use Zod's built-in validation methods for common patterns (email, URL, etc.)
- Context: Zod provides runtime validation with TypeScript integration and excellent error messages
- Validate data at form boundaries - both client and server side
- Use the same Zod schema for client and server validation
- Provide immediate feedback for validation errors
- Context: Consistent validation prevents data corruption and improves user experience

## Form State Management

- Use `useForm` hook for form state management and validation
- Use `useActionState` for server action integration
- Register form fields with proper validation rules
- Context: React Hook Form provides performant form handling with minimal re-renders
- Handle form submissions through Server Actions
- Implement single `onSubmitAction` function with signature: `(prevState: FormState, data: FormData) => Promise<FormState>`
- Handle both create and update operations based on ID presence
- Context: Server Actions provide type-safe form handling without API routes

## Server Actions

- Place Server Actions in `app/lib/actions/` directory
- Create separate files for different form types (user-form.ts, product-form.ts)
- Separate read and write operations into different files
- Context: Organized Server Actions are easier to maintain and test
- Validate form data using Zod schemas before processing
- Return structured FormState objects with success/error information
- Handle both creation and updates in the same action based on ID
- Context: Consistent action patterns reduce complexity and improve reliability
- Catch and handle validation errors gracefully
- Return user-friendly error messages
- Log detailed errors server-side for debugging
- Context: Good error handling improves user experience and aids debugging

## Form UI Patterns

- Use consistent form field components across the application
- Implement proper label associations for accessibility
- Show validation errors inline near the relevant fields
- Context: Consistent form UI improves usability and accessibility
- Add ID fields as hidden form inputs for update operations
- Use FormField pattern for hidden fields to maintain form state
- Context: Hidden fields enable proper CRUD operations without exposing internal IDs
- Show loading states during form submission
- Display success messages after successful operations
- Provide clear error messages with actionable guidance
- Context: Clear feedback helps users understand form state and next steps

## CRUD Operations

- Validate all required fields before creation
- Generate appropriate IDs server-side for new records
- Redirect to appropriate page after successful creation
- Context: Proper creation flow ensures data integrity and good user experience
- Pre-populate forms with existing data for updates
- Validate changes before applying updates
- Show confirmation for successful updates
- Context: Update operations should be intuitive and preserve user data
- Implement deletions in separate functions from create/update
- Require user confirmation before deleting data
- Use Shadcn Alert Dialog component for delete confirmations
- Context: Delete confirmations prevent accidental data loss

## Form Accessibility

- Ensure all form elements are keyboard accessible
- Implement logical tab order through form fields
- Provide keyboard shortcuts for common actions
- Context: Keyboard accessibility is essential for users who cannot use a mouse
- Use proper labels and descriptions for form fields
- Announce validation errors to screen readers
- Provide clear instructions for complex form interactions
- Context: Screen reader support makes forms accessible to visually impaired users

## Form Security

- Sanitize all user inputs before processing
- Use parameterized queries for database operations
- Validate file uploads for type and size restrictions
- Context: Input sanitization prevents injection attacks and data corruption
- Use Next.js built-in CSRF protection for forms
- Validate form tokens server-side before processing
- Implement proper session management
- Context: CSRF protection prevents unauthorized form submissions