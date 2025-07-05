import { test, expect } from "@playwright/test";
import { toBeVisible } from "node_modules/@testing-library/jest-dom/types/matchers";

let now = "";

test.beforeEach(async () => {
  now = new Date().toISOString();
});

test("user is able to create a project rule with only required fields", async ({
  page,
}) => {
  await page.goto("/rules/create");
  await page.fill(
    'input[name="title"]',
    `Private project rule with only required fields ${now}`,
  );
  await page.fill(
    'textarea[name="description"]',
    "This is the description of an automated generated project rule",
  );

  await page.fill(
    'textarea[name="content"]',
    "This is an automated generated project rule",
  );
  await page.click('button[type="submit"]');
  await page.waitForURL("/rules/rule/*");

  await expect(
    page.getByRole("heading", {
      name: "Private project rule with only required fields",
    }),
  ).toBeVisible();

  //verify that private prompt is listed in my prompts section
  await page.goto("/rules/my");

  await expect(
    page.getByText(`Private project rule with only required fields ${now}`),
  ).toBeVisible();

  await page.goto("/rules");
  await expect(
    page.getByRole("heading", {
      name: `Private project rule with only required fields ${now}`,
    }),
  ).not.toBeVisible();
});

test("user is able to create a public project rule with only required fields", async ({
  page,
}) => {
  await page.goto("/rules/create");
  await page.fill(
    'input[name="title"]',
    `Public project rule with only required fields ${now}`,
  );
  await page.fill(
    'textarea[name="description"]',
    "This is the description of an automated generated project rule",
  );

  await page.fill(
    'textarea[name="content"]',
    "This is an automated generated project rule",
  );
  await page.click('button[role="switch"]');
  await page.click('button[type="submit"]');
  await page.waitForURL("/rules/rule/*");

  await expect(
    page.getByRole("heading", {
      name: `Public project rule with only required fields ${now}`,
    }),
  ).toBeVisible();

  //verify that private prompt is listed in my prompts section
  await page.goto("/rules/my");

  await expect(
    page.getByText(`Public project rule with only required fields ${now}`),
  ).toBeVisible();

  await page.goto("/rules");
  await expect(
    page.getByText(`Public project rule with only required fields ${now}`),
  ).toBeVisible();
});
