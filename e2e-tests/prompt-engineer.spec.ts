import { test, expect } from "@playwright/test";

let now = "";

test.beforeEach(async () => {
  now = new Date().toISOString();
});

test("prompt engineer can delete prompts", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Prompts" }).click();
  await page.getByRole("link", { name: "Create Prompt" }).click();
  await page
    .getByRole("textbox", { name: "Title" })
    .fill(`${test.info().title}_${now}`);
  await page
    .getByRole("textbox", { name: "Description" })
    .fill("prompt description");
  await page
    .getByRole("textbox", { name: "Write your prompt here..." })
    .fill("prompt instruction");

  await page.getByRole("switch").click();
  await page.locator('[data-test-id="prompt_form_submit"]').click();
  await page.getByTestId("edit-button").click();
  await page.getByRole("button", { name: "Delete Prompt" }).click();
  await page.getByRole("button", { name: "Delete" }).click();
  await page.waitForURL("/prompts");

  await expect(
    page.getByRole("heading", { name: `${test.info().title}_${now}` }),
  ).not.toBeVisible();
});

test("prompt engineer can delete rules", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Rules" }).click();
  await page.getByRole("link", { name: "Create Rule" }).click();
  await page
    .getByRole("textbox", { name: "Title" })
    .fill(`${test.info().title}_${now}`);
  await page
    .getByRole("textbox", { name: "Description" })
    .fill("prompt description");
  await page.fill(
    'textarea[name="content"]',
    "This is an automated generated project rule",
  );

  await page.getByRole("switch").click();
  await page.click('button[type="submit"]');
  await page.getByTestId("edit-button").click();
  await page.getByRole("button", { name: "Delete Project Rule" }).click();
  await page.getByRole("button", { name: "Delete" }).click();
  await page.waitForURL("/rules");

  await expect(
    page.getByRole("heading", { name: `${test.info().title}_${now}` }),
  ).not.toBeVisible();
});

test("should allow a prompt engineer to select tags when creating a new prompt", async ({
  page,
}) => {
  // Step 1: Navigate to /prompts/create to create a new prompt
  await page.goto("/prompts/create");

  // Verify we're on the create prompt page
  await expect(page).toHaveTitle(
    /PROMPTZ - Discover, Create, and Share Prompts for Amazon Q Developer/,
  );
  await expect(
    page.getByRole("heading", { name: "Create Prompt", level: 1 }),
  ).toBeVisible();

  // Step 2: Click on the "Edit Tags" button
  await page.getByRole("button", { name: "Edit Tags" }).click();

  // Step 3: Verify the sheet with the title "Tags" opens
  const tagsDialog = page.getByRole("dialog", { name: "Tags" });
  await expect(tagsDialog).toBeVisible();
  await expect(
    tagsDialog.getByRole("heading", { name: "Tags", level: 2 }),
  ).toBeVisible();

  // Step 4: Verify the Tags IDE, Chat and Debugging are visible
  await expect(tagsDialog.getByText("IDE", { exact: true })).toBeVisible();
  await expect(tagsDialog.getByText("Chat", { exact: true })).toBeVisible();
  await expect(
    tagsDialog.getByText("Debugging", { exact: true }),
  ).toBeVisible();

  // Step 5: Select the IDE tag
  await tagsDialog.getByText("IDE", { exact: true }).click();

  // Step 6: Close the sheet
  await tagsDialog.getByRole("button", { name: "Close" }).click();

  // Verify the dialog is closed
  await expect(tagsDialog).not.toBeVisible();

  // Step 7: Verify the IDE tag is marked as selected in the form
  await expect(page.getByText("IDE", { exact: true }).first()).toBeVisible();
});
