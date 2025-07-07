import { test, expect } from "@playwright/test";

test.describe("Search prompts", () => {
  test("should search for prompts and navigate to prompt detail page", async ({
    page,
  }) => {
    await test.step("Navigate to homepage", async () => {
      await page.goto("/");
      await expect(page).toHaveTitle(
        /PROMPTZ - Discover, Create, and Share Prompts for Amazon Q Developer/,
      );
    });

    await test.step('Enter search term "git" into the input box', async () => {
      const searchBox = page.getByRole("searchbox").first();
      await searchBox.fill("git");
      await expect(searchBox).toHaveValue("git");
    });

    await test.step("Submit search by pressing Enter", async () => {
      await page.keyboard.press("Enter");
    });

    await test.step("Verify navigation to /prompts with search query parameter", async () => {
      await expect(page).toHaveURL(/\/prompts\?query=git/);
    });

    await test.step("Verify search term is visible in the input field on /prompts page", async () => {
      const searchInput = page.getByRole("textbox").first();
      await expect(searchInput).toHaveValue("git");
    });

    await test.step("Verify search results are displayed", async () => {
      const searchResults = page.getByRole("list");
      await expect(searchResults).toBeVisible();

      // Ensure at least one search result exists
      const promptLinks = await searchResults.getByRole("link").count();
      expect(promptLinks).toBeGreaterThanOrEqual(1);
    });

    await test.step("Click on the first prompt card in search results", async () => {
      const searchResults = page.getByRole("list");
      const firstPromptCard = searchResults.getByRole("link").first();
      await firstPromptCard.click();
    });

    await test.step('Verify on prompt detail page that search term "git" is found', async () => {
      // Verify we're on a prompt detail page
      await expect(page).toHaveURL(/\/prompts\/prompt\//);

      // Verify the search term "git" appears on the page using getByText
      await expect(
        page.getByText("git", { exact: false }).first(),
      ).toBeVisible();

      // Additional verification - check main content area contains git
      const mainContent = page.getByRole("main");
      await expect(mainContent).toContainText("git");
    });
  });

  test("should handle empty search results gracefully", async ({ page }) => {
    await test.step("Navigate to homepage", async () => {
      await page.goto("/");
    });

    await test.step("Search for a term that returns no results", async () => {
      const searchBox = page.getByRole("searchbox").first();

      await searchBox.fill("nonexistentterm12345");
      await page.keyboard.press("Enter");
    });

    await test.step("Verify navigation to prompts page with query parameter", async () => {
      await expect(page).toHaveURL(/\/prompts\?query=nonexistentterm12345/);
    });

    await test.step("Verify empty state or no results message", async () => {
      // This step would need to be adjusted based on how the app handles empty results
      // For now, we just verify the search input maintains the search term
      const searchInput = page.getByRole("textbox", {
        name: "Search prompts...",
      });
      await expect(searchInput).toHaveValue("nonexistentterm12345");
    });
  });
});
