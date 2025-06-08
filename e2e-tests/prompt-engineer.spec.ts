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
