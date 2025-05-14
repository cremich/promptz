import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  const testId = test.info().testId;

  await page.goto("/prompts/create");
  await page.fill(
    'input[name="title"]',
    `Automated generated prompt for test ${testId}`,
  );
  await page.fill(
    'textarea[name="description"]',
    "This is the description of an automated generated prompt",
  );

  await page.fill(
    'textarea[name="instruction"]',
    "This is an automated generated prompt",
  );
  await page.click('button[type="submit"]');
});

test("user is able to see own created prompt", async ({ page }) => {
  const testId = test.info().testId;

  await page.goto("/prompts/my");
  const username = page.getByTestId("user-menu_username");
  await expect(
    page.getByText(`Automated generated prompt for test ${testId}`),
  ).toBeVisible();
});
