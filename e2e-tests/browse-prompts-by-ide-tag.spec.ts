import { test, expect } from "@playwright/test";

test.describe("Browse Prompts by IDE Tag", () => {
  test("should allow user to browse prompts by IDE tag", async ({ page }) => {
    // Step 1: Navigate to the homepage
    await page.goto("/");

    // Verify we're on the homepage
    await expect(page).toHaveTitle(
      /PROMPTZ - Discover, Create, and Share Prompts for Amazon Q Developer/,
    );
    await expect(
      page.getByRole("heading", {
        name: "Simplify prompting for Amazon Q Developer",
      }),
    ).toBeVisible();

    // Step 2: Click on the IDE tag card to browse prompts for this interface
    await page
      .getByRole("link", { name: "Browse IDE tag with 47 items" })
      .click();

    // Wait for navigation to complete
    await page.waitForURL("**/prompts?tags%5B%5D=IDE");

    // Step 3: Verify the user is linked to the browse page
    expect(page.url()).toContain("/prompts?tags%5B%5D=IDE");
    await expect(
      page.getByRole("heading", { name: "Browse Prompts" }),
    ).toBeVisible();

    // Verify the IDE filter is active
    await expect(page.getByRole("checkbox", { name: "IDE" })).toBeChecked();

    // Step 4: Verify that all prompt cards listed have the IDE tag associated
    const promptCards = page.getByTestId("prompt-card");
    const promptCount = await promptCards.count();

    // Ensure we have prompts to verify
    expect(promptCount).toBeGreaterThan(0);

    // Check each prompt card has the IDE tag
    for (let i = 0; i < promptCount; i++) {
      const promptCard = promptCards.nth(i);
      const ideTag = promptCard
        .locator("div")
        .filter({ hasText: /^IDE$/ })
        .first();
      await expect(ideTag).toBeVisible();
    }

    // Additional verification: Check that the page shows IDE-filtered results
    await expect(page.locator("text=IDE").first()).toBeVisible();

    // Verify the search context shows we're filtering by IDE
    await expect(
      page.getByText("Discover and explore prompts created by the community"),
    ).toBeVisible();
  });

  test("should show correct prompt count for IDE tag", async ({ page }) => {
    // Navigate to homepage first
    await page.goto("/");

    // Verify the IDE tag card shows the correct count
    const ideTagCard = page.getByRole("link", {
      name: "Browse IDE tag with 47 items",
    });
    await expect(ideTagCard).toBeVisible();

    // Verify the tag card contains the expected information
    await expect(ideTagCard.locator("text=IDE")).toBeVisible();
    await expect(ideTagCard.locator("text=47 Prompts")).toBeVisible();
    await expect(ideTagCard.locator("text=0 Rules")).toBeVisible();
  });

  test("should maintain IDE filter when navigating", async ({ page }) => {
    // Navigate directly to IDE filtered page
    await page.goto("/prompts?tags%5B%5D=IDE");

    // Verify the filter is maintained
    await expect(page.getByRole("checkbox", { name: "IDE" })).toBeChecked();

    // Verify URL contains the IDE filter
    expect(page.url()).toContain("tags%5B%5D=IDE");

    // Verify page shows filtered results
    await expect(
      page.getByRole("heading", { name: "Browse Prompts" }),
    ).toBeVisible();
  });
});
