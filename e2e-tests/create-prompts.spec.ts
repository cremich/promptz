import { test, expect } from "@playwright/test";

let now = "";

test.beforeEach(async () => {
  now = new Date().toISOString();
});

test("user is able to click the 'create prompt' button in the browse page and navigate to create page", async ({
  page,
}) => {
  // Navigate to the prompts page
  await page.goto("/prompts");

  // Verify the create prompt button is visible
  const createPromptLink = page.getByRole("link", { name: "Create Prompt" });
  await expect(createPromptLink).toBeVisible();

  // Click on the create prompt button
  await createPromptLink.click();

  // Verify navigation to the create page
  await expect(page).toHaveURL("/prompts/create");

  // Verify the create page has loaded correctly by checking for the form
  await expect(
    page.getByRole("heading", { name: "Create Prompt" }),
  ).toBeVisible();
});

test("user is able to create a prompt with only required fields", async ({
  page,
}) => {
  await page.goto("/prompts/create");
  await page.fill(
    'input[name="title"]',
    `Private prompt with only required fields ${now}`,
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
  await page.waitForURL("/prompts/prompt/*");

  await expect(
    page.getByRole("heading", {
      name: "Private prompt with only required fields",
    }),
  ).toBeVisible();

  //verify that private prompt is listed in my prompts section
  await page.goto("/prompts/my");

  await expect(
    page.getByText(`Private prompt with only required fields ${now}`),
  ).toBeVisible();

  await page.goto("/prompts");
  await expect(
    page.getByRole("heading", {
      name: `Private prompt with only required fields ${now}`,
    }),
  ).not.toBeVisible();
});

test("user is able to create a public prompt with only required fields", async ({
  page,
}) => {
  await page.goto("/prompts/create");
  await page.fill(
    'input[name="title"]',
    `Public prompt with only required fields ${now}`,
  );
  await page.fill(
    'textarea[name="description"]',
    "This is the description of an automated generated prompt",
  );

  await page.fill(
    'textarea[name="instruction"]',
    "This is an automated generated prompt",
  );
  await page.click('button[role="switch"]');
  await page.click('button[type="submit"]');
  await page.waitForURL("/prompts/prompt/*");

  await expect(
    page.getByRole("heading", {
      name: `Public prompt with only required fields ${now}`,
    }),
  ).toBeVisible();

  //verify that private prompt is listed in my prompts section
  await page.goto("/prompts/my");

  await expect(
    page.getByText(`Public prompt with only required fields ${now}`),
  ).toBeVisible();
});
