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

  test("should filter prompts by CLI facet and show only CLI-tagged prompts", async ({
    page,
  }) => {
    await test.step("Navigate to /prompts page", async () => {
      await page.goto("/prompts");
      await expect(page).toHaveTitle(
        /PROMPTZ - Discover, Create, and Share Prompts for Amazon Q Developer/,
      );
    });

    await test.step("Select the CLI facet in the filter sidebar", async () => {
      const cliCheckbox = page.getByRole("checkbox", { name: "CLI" });
      await cliCheckbox.click();
    });

    await test.step("Verify URL contains CLI filter parameter", async () => {
      await expect(page).toHaveURL(/\/prompts\?tags%5B%5D=CLI/);
    });

    await test.step("Verify CLI checkbox is checked", async () => {
      const cliCheckbox = page.getByRole("checkbox", { name: "CLI" });
      await expect(cliCheckbox).toBeChecked();
    });

    await test.step("Verify search results only show prompts with CLI tag", async () => {
      const searchResults = page.getByRole("list");
      await expect(searchResults).toBeVisible();

      // Get all main prompt card links (those that go to /prompts/prompt/ URLs)
      const promptCards = page.locator('a[href*="/prompts/prompt/"]');
      const promptCount = await promptCards.count();

      // Ensure at least one prompt is displayed
      expect(promptCount).toBeGreaterThanOrEqual(1);

      // // Verify each prompt card contains the CLI tag text
      for (let i = 0; i < promptCount; i++) {
        const promptCard = promptCards.nth(i);

        // Check if this prompt card contains CLI text
        await expect(promptCard).toContainText("CLI");
      }
    });
  });

  test("should navigate from homepage CLI card to prompts page with CLI facet selected", async ({
    page,
  }) => {
    await test.step("Navigate to homepage", async () => {
      await page.goto("/");
      await expect(page).toHaveTitle(
        /PROMPTZ - Discover, Create, and Share Prompts for Amazon Q Developer/,
      );
    });

    await test.step("Click the CLI card in the 'Browse by Interface' section", async () => {
      const cliCard = page.getByRole("link", {
        name: "Browse CLI tag with 26 items",
      });
      await cliCard.click();
    });

    await test.step("Verify user is routed to the /prompts page", async () => {
      await expect(page).toHaveURL(/\/prompts\?tags%5B%5D=CLI/);
    });

    await test.step("Verify that the CLI facet is selected", async () => {
      const cliCheckbox = page.getByRole("checkbox", { name: "CLI" });
      await expect(cliCheckbox).toBeChecked();
    });
  });
});
