# Implementation Plan for Amazon Q Developer Project Rules

This document outlines a step-by-step implementation plan for adding support for Amazon Q Developer project rules to promptz.dev. The plan is broken down into small, iterative chunks that build on each other, ensuring incremental progress with strong testing at each stage.

## Overview

We'll implement support for Amazon Q project rules with the following key components:

1. Data model for project rules
2. CRUD operations for project rules
3. UI components for creating, editing, and browsing project rules
4. Download functionality for project rules
5. OpenGraph image generation for social sharing

## Implementation Steps

### Step 1: Define Project Rule Data Model

```
I need to create a data model for Amazon Q project rules in the Amplify schema. The model should include fields for title, description, content, tags, visibility control, source URL, and owner information. Please help me implement this following the Amplify modeling best practices.

The project rule model should have the following fields:
- id: string (auto-generated)
- title: string (required)
- description: string (required)
- content: string (required, for markdown content)
- tags: string array
- isPublic: boolean (required)
- sourceURL: string (optional)
- owner_username: string (required)

The authorization should allow:
- Public API key to read
- Authenticated users to read
- Owners to create, update, and delete their own rules

Please provide the schema definition that I can add to my Amplify data model.
```

### Step 2: Create API Actions for Project Rules

```
Create server actions for CRUD operations on project rules. To fulfill the task, you must
- adhere to coding guidelines described in the ./.amazonq/rules folder. This is mandatory.
- read relevant documentation in the ./memory-bank folder. This is mandatory.
- read relevant documentation about the feature in the ./.amazonq/specs/features/project-rules/spec.md file. This is mandatory.
- implement the requested changes.
- validate that the implementation works by running unit tests
- fix errors related to the requested change until all tests pass.

Your goal is to ensure that the requested changes are implemented, tested and ready for me to review.

Create following server actions:

1. createProjectRule: Create a new project rule
2. updateProjectRule: Update an existing project rule
3. deleteProjectRule: Delete a project rule
4. getProjectRule: Get a single project rule by slug
5. listProjectRules: List project rules with optional filtering

The implementation must follow our existing patterns for server actions.
```

### Step 3: Create Project Rules List Page

```
Create a page to list all project rules. This must be similar to our existing prompts page but focused on project rules. To fulfill the task, you must
- adhere to coding guidelines described in the ./.amazonq/rules folder. This is mandatory.
- read relevant documentation in the ./memory-bank folder. This is mandatory.
- read relevant documentation about the feature in the ./.amazonq/specs/features/project-rules/spec.md file. This is mandatory.
- implement the requested changes.
- validate that the implementation works by running unit tests
- fix errors related to the requested change until all tests pass.

Your goal is to ensure that the requested changes are implemented, tested and ready for me to review.

Create a new page at app/rules/page.tsx that:
1. Lists all public project rules
2. Allows user to filter rules by tags
3. Shows project rule cards with title, description, and tags
4. Links to individual project rule pages

The page must use server components where appropriate and follow our existing UI patterns. Include pagination similar to how we handle it for prompts.
```

### Step 4: Create Project Rule Card Component

```
Create a reusable card component for displaying project rules. This must be similar to our existing prompt card but tailored for project rules. To fulfill the task, you must
- adhere to coding guidelines described in the ./.amazonq/rules folder. This is mandatory.
- read relevant documentation in the ./memory-bank folder. This is mandatory.
- read relevant documentation about the feature in the ./.amazonq/specs/features/project-rules/spec.md file. This is mandatory.
- implement the requested changes.
- validate that the implementation works by running unit tests
- fix errors related to the requested change until all tests pass.

Your goal is to ensure that the requested changes are implemented, tested and ready for me to review.

Create a component at app/ui/rules/project-rule-card.tsx that:
1. Displays the project rule title, description, and tags
2. Shows the owner username
3. Includes a link to the full project rule
4. Has a clean, consistent design matching our existing UI

The component should be responsive and follow our accessibility standards.
```

### Step 5: Create Project Rule Detail Page

```
Create a detail page for viewing a single project rule. This must display the full content of a project rule and provide actions like edit (for owners). To fulfill the task, you must
- adhere to coding guidelines described in the ./.amazonq/rules folder. You must read all coding guidelines before starting with the task. This is mandatory.
- you must read about the feature in the ./.amazonq/specs/features/project-rules/spec.md file. This is mandatory.
- implement the requested changes.
- validate that the implementation works by running unit tests
- fix errors related to the requested change until all tests pass.

Your goal is to ensure that the requested changes are implemented, tested and ready for me to review.

Create a new page at app/rules/rule/[slug]/page.tsx that:
1. Fetches and displays a single project rule by slug
2. Renders the content as preformatted text
3. Shows metadata like author, creation date, tags
4. Includes edit button for owner
5. Handles not found and unauthorized cases appropriately

The page must use server components where appropriate and follow our existing UI patterns.
```

### Step 6: Create Project Rule Form Component

```
Create a form component for creating and editing project rules. This must handle validation, submission, and error states. To fulfill the task, you must
- adhere to coding guidelines described in the ./.amazonq/rules folder. This is mandatory.
- read relevant documentation in the ./memory-bank folder. This is mandatory.
- read relevant documentation about the feature in the ./.amazonq/specs/features/project-rules/spec.md file. This is mandatory.
- implement the requested changes.
- validate that the implementation works by running unit tests
- fix errors related to the requested change until all tests pass.

Your goal is to ensure that the requested changes are implemented, tested and ready for me to review.

Create a component at app/ui/rules/project-rule-form.tsx that:
1. Accepts initial values for editing existing rules
2. Includes fields for title, description, content, tags, visibility, and source URL
3. Validates required fields
4. Handles form submission via server actions
5. Shows appropriate loading and error states

The component must use React Hook Form for form management and follow our existing form patterns.
```

### Step 7: Create Project Rule Creation Page

```
Create a page for creating new project rules. This must use the form component created earlier. To fulfill the task, you must
- adhere to coding guidelines described in the ./.amazonq/rules folder. This is mandatory.
- read relevant documentation in the ./memory-bank folder. This is mandatory.
- read relevant documentation about the feature in the ./.amazonq/specs/features/project-rules/spec.md file. This is mandatory.
- implement the requested changes.
- validate that the implementation works by running unit tests
- fix errors related to the requested change until all tests pass.

Your goal is to ensure that the requested changes are implemented, tested and ready for me to review.

Create a new page at app/rules/create/page.tsx that:
1. Renders the project rule form component
2. Handles authentication checks (redirects unauthenticated users)
3. Provides clear instructions for creating a project rule
4. Redirects to the new rule after successful creation

The page must use server components where appropriate and follow our existing UI patterns.
```

### Step 8: Create Project Rule Edit Page

```
Create a page for editing existing project rules. This must use the form component created earlier and pre-populate it with the existing rule data. To fulfill the task, you must
- adhere to coding guidelines described in the ./.amazonq/rules folder. This is mandatory.
- read relevant documentation in the ./memory-bank folder. This is mandatory.
- read relevant documentation about the feature in the ./.amazonq/specs/features/project-rules/spec.md file. This is mandatory.
- implement the requested changes.
- validate that the implementation works by running unit tests
- fix errors related to the requested change until all tests pass.

Your goal is to ensure that the requested changes are implemented, tested and ready for me to review.

Create a new page that:
1. Fetches the existing project rule data via slug
2. Renders the project rule form component with initial values
3. Handles authentication and authorization checks
5. Handles not found and unauthorized cases appropriately

The page must use server components where appropriate and follow our existing UI patterns.
```

### Step 9: Implement Project Rule Download Functionality

```
Implement functionality to download project rules as markdown files. This must be available from the project rule detail page. To fulfill the task, you must
- adhere to coding guidelines described in the ./.amazonq/rules folder. This is mandatory.
- read relevant documentation in the ./memory-bank folder. This is mandatory.
- read relevant documentation about the feature in the ./.amazonq/specs/features/project-rules/spec.md file. This is mandatory.
- implement the requested changes.
- validate that the implementation works by running unit tests
- fix errors related to the requested change until all tests pass.

Your goal is to ensure that the requested changes are implemented, tested and ready for me to review.

Create:
1. A client component at app/ui/common/download-button.tsx that triggers the download
2. Integration of this button in the project rule detail page

The download must include only the rule content formatted as markdown.
```

### Step 10: Add Navigation and Layout Updates

```
Update the navigation and layout to include the new project rules section. This must be a top-level navigation item similar to "Prompts". To fulfill the task, you must
- adhere to coding guidelines described in the ./.amazonq/rules folder. This is mandatory.
- read relevant documentation in the ./memory-bank folder. This is mandatory.
- read relevant documentation about the feature in the ./.amazonq/specs/features/project-rules/spec.md file. This is mandatory.
- implement the requested changes.
- validate that the implementation works by running unit tests
- fix errors related to the requested change until all tests pass.

Your goal is to ensure that the requested changes are implemented, tested and ready for me to review.

1. Update the navigation component to include a "Project Rules" link
2. Ensure mobile navigation also includes the new section

The navigation must be consistent with our existing UI patterns and be responsive.
```

### Step 11: Implement OpenGraph Image Generation

```
Implement dynamic OpenGraph image generation for project rules to improve social sharing. This must be similar to how we handle it for prompts. To fulfill the task, you must
- adhere to coding guidelines described in the ./.amazonq/rules folder. This is mandatory.
- read relevant documentation in the ./memory-bank folder. This is mandatory.
- read relevant documentation about the feature in the ./.amazonq/specs/features/project-rules/spec.md file. This is mandatory.
- implement the requested changes.
- validate that the implementation works by running unit tests
- fix errors related to the requested change until all tests pass.

Your goal is to ensure that the requested changes are implemented, tested and ready for me to review.

Please help me create:
1. An opengraph-image route segment at app/rules/rule/[slug]/opengraph-image.tsx that generates an image similar to how opengraph-images for prompts are created.
2. A template for the OpenGraph image that includes the rule title, description, author, tags and branding

The implementation must use the same image generation approach we use for prompts.
```

### Step 12: Implement User Profile Integration

```
Create a new page to show project rules submitted by the logged in user. This should allow users to manage all their rules in one place. To fulfill the task, you must
- adhere to coding guidelines described in the ./.amazonq/rules folder. This is mandatory.
- read relevant documentation in the ./memory-bank folder. This is mandatory.
- read relevant documentation about the feature in the ./.amazonq/specs/features/project-rules/spec.md file. This is mandatory.
- implement the requested changes.
- validate that the implementation works by running unit tests
- fix errors related to the requested change until all tests pass.

Your goal is to ensure that the requested changes are implemented, tested and ready for me to review.

Please help me:
1. Create a new page similar to the `MyPrompts`page.
2. Ensure proper authorization checks

```

### Step 13: Add Tag Management for Project Rules

```
Implement tag management for project rules, similar to how we handle tags for prompts. This includes assigning tags from a predefined list. To fulfill the task, you must
- adhere to coding guidelines described in the ./.amazonq/rules folder. This is mandatory.
- read relevant documentation in the ./memory-bank folder. This is mandatory.
- read relevant documentation about the feature in the ./.amazonq/specs/features/project-rules/spec.md file. This is mandatory.
- implement the requested changes.
- validate that the implementation works by running unit tests
- fix errors related to the requested change until all tests pass.

Your goal is to ensure that the requested changes are implemented, tested and ready for me to review.

1. Update the project rule form to include tag selection
2. Implement tag filtering on the project rules list page
3. Create a component for displaying and selecting tags
4. Ensure tags are properly stored and retrieved with project rules

The implementation should be consistent with our existing tag system for prompts.
```

### Step 14: Add Search Functionality for Project Rules

```
Implement search functionality specifically for project rules. This should allow users to find rules by title, description, or content. To fulfill the task, you must
- adhere to coding guidelines described in the ./.amazonq/rules folder. This is mandatory.
- read relevant documentation in the ./memory-bank folder. This is mandatory.
- read relevant documentation about the feature in the ./.amazonq/specs/features/project-rules/spec.md file. This is mandatory.
- implement the requested changes.
- validate that the implementation works by running unit tests
- fix errors related to the requested change until all tests pass.

Your goal is to ensure that the requested changes are implemented, tested and ready for me to review.

Please help me create:
1. A search component for the project rules list page
2. Server actions to handle search queries
3. Integration with our existing search patterns
4. Proper handling of search results and empty states

The search functionality should be efficient and provide a good user experience.
```

### Step 15: Add Documentation and Help Content

```
Create documentation and help content for the project rules feature. This should help users understand what project rules are and how to use them. To fulfill the task, you must
- adhere to coding guidelines described in the ./.amazonq/rules folder. This is mandatory.
- read relevant documentation in the ./memory-bank folder. This is mandatory.
- read relevant documentation about the feature in the ./.amazonq/specs/features/project-rules/spec.md file. This is mandatory.
- implement the requested changes.
- validate that the implementation works by running unit tests
- fix errors related to the requested change until all tests pass.

Your goal is to ensure that the requested changes are implemented, tested and ready for me to review.

Please help me create:
1. A help page explaining Amazon Q project rules
2. Inline help and tooltips in the UI
3. Example project rules that users can reference
4. Documentation on how to use downloaded rules in their projects

The documentation should be clear, concise, and helpful for users of all experience levels.
```

## Conclusion

This implementation plan provides a step-by-step approach to adding support for Amazon Q Developer project rules to promptz.dev. Each step builds on the previous ones, ensuring incremental progress with strong testing at each stage. The plan follows best practices for Next.js and AWS Amplify development, and is consistent with the existing patterns in the project.
