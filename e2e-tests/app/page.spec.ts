import { test, expect } from "@playwright/test";

test("user is authenticated", async ({ page }) => {
  await page.goto("/");
  const username = page.getByTestId("user-menu_username");

  // Expect a title "to contain" a substring.
  await expect(username).toHaveText("e2e-test");
});
