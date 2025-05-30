import { test, expect } from "@playwright/test";

let now = "";

test.beforeEach(async () => {
  now = new Date().toISOString();
});

test("user is able to search for prompts", async ({ page }) => {
  // Define the search query
  const searchQuery = "git";

  // Navigate to prompts page
  await page.goto("/prompts");

  // Wait for initial prompt cards to load
  await page.waitForSelector('[data-testid="prompt-card"]');

  // Perform search
  await page.fill('input[name="query"]', searchQuery);

  // Wait for debounce (300ms) plus a small buffer
  await page.waitForTimeout(350);

  // Wait for URL to contain the search query
  await expect(page).toHaveURL(new RegExp(`query=${searchQuery}`));

  // Get filtered prompt cards
  const filteredCards = await page.locator('[data-testid="prompt-card"]').all();

  // Verify we have at least one result
  expect(filteredCards.length).toBeGreaterThan(0);

  // Check each prompt card to verify it contains the search query
  for (const card of filteredCards) {
    const titleElement = card.locator("h3");
    const descriptionElement = card.locator("p.text-muted-foreground");

    const title = (await titleElement.textContent()) || "";
    const description = (await descriptionElement.textContent()) || "";

    // Check if either title or description contains the search query (case insensitive)
    const containsQuery =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase());

    expect(containsQuery).toBeTruthy();
  }
});

test("user is able to filter prompts by tags", async ({ page }) => {
  const tag = "IDE";

  // Navigate to prompts page
  await page.goto("/prompts");

  // Wait for initial prompt cards to load
  await page.waitForSelector('[data-testid="prompt-card"]');

  // Get initial prompt cards count
  const initialCards = await page.locator('[data-testid="prompt-card"]').all();

  // Select a tag from the filter sidebar (using the first checkbox in the Interface section)
  const firstTagCheckbox = await page.getByRole("checkbox", {
    name: tag,
  });
  await firstTagCheckbox.click();

  // Wait for URL to update with the tag filter
  await page.waitForTimeout(350);
  await expect(page).toHaveURL(new RegExp(`tags`));

  // Get filtered prompt cards
  const filteredCards = await page.locator('[data-testid="prompt-card"]').all();

  // Verify we have results
  expect(filteredCards.length).toBeGreaterThan(0);

  // Check each card's tags to verify they contain the selected tag
  for (const card of filteredCards) {
    // Look for tags in the card
    const tagElements = await card.locator('[data-testid="tag"]').all();

    // Extract tag texts
    const cardTags = [];
    for (const tagElement of tagElements) {
      const tagText = await tagElement.textContent();
      if (tagText) cardTags.push(tagText.trim());
    }

    // Verify the selected tag is present in the card's tags
    expect(cardTags.some((tag) => tag === tag)).toBeTruthy();
  }
});
