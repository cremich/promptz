# Guidelines for end-to-end tests with playwright

- You are given a scenario and you need to generate a playwright test for it.
- Do run steps one by one using the tools provided by the Playwright MCP.
- Only after all steps are completed, emit a Playwright TypeScript test that uses @playwright/test based on the message history
- Save the generated test file in the e2e-tests directory
- Execute the test file and iterate until the test passes

## Testing philosophy

### Test user-visible behavior.

- Tests must verify that the application works for the users
- Avoid relying on implementation details such as things users will not typically use, see, or even know.

### Make tests as isolated as possible

- Each test must be completely isolated from another test
- To avoid repetition for a particular part of a test, use before and after hooks. For example to navigate to a particular URL.
- However it is also ok to have a little duplication when tests are simple enough especially if it keeps your tests clearer and easier to read and maintain
  Keep tests DRY (Don’t Repeat Yourself) by extracting reusable logic into helper functions.

## Best Practices

### Test organization

- Organize and group tests by feature
- Use descriptive test names and file names

```
e2e/
  ├── authentication/
  │     ├── login.spec.ts
  │     └── reset-password.spec.ts
  ├── shopping-cart/
  │     ├── add-item.spec.ts
  │     └── checkout.spec.ts
  ├── helpers/
  │     └── create-wishlist.ts
  └── homepage.spec.ts
```

- Split tests into steps with `test.step` to add more clarity to the tests improving readability and reporting
- Use `describe` blocks to logically group related tests, improving readability and maintainability.
- Use tags and annotations to categorize tests

### Locators

- Find elements on the webpage using locators that come with auto waiting and retry-ability.
- To make tests resilient, prioritize user-facing attributes and explicit contracts.
- Avoid using `page.locator` and always use the recommended built-in and role-based locators

```
// 👍
page.getByRole('button', { name: 'submit' });
```

- Use chaining and filtering to narrow down the search to a particular part of the page

```
const product = page.getByRole('listitem').filter({ hasText: 'Product 2' });
```

- Use locators that are resilient to changes in the DOM. The DOM can easily change so having tests depend on the DOM structure can lead to failing tests.

```
// 👍
await page
    .getByRole('listitem')
    .filter({ hasText: 'Product 2' })
    .getByRole('button', { name: 'Add to cart' })
    .click();
```

### Assertions

- Use web first assertions to verify that the expected result and the actual result matches.
- Prevent to use manual assertions that are not awaiting the expect.

```
// 👍
await expect(page.getByText('welcome')).toBeVisible();

// 👎
expect(await page.getByText('welcome').isVisible()).toBe(true);
```

- Use soft assertions that will compile and display a list of failed assertions once the test ended

````
// Make a few checks that will not stop the test when failed...
await expect.soft(page.getByTestId('status')).toHaveText('Success');

// ... and continue the test to check more things.
await page.getByRole('link', { name: 'next page' }).click();
```
````
