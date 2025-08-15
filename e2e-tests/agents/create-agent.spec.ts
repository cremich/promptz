import { test, expect } from "@playwright/test";

test.describe("Create Agent", () => {
  // Use the authentication state from the login test
  test.use({ storageState: ".playwright/.auth/user.json" });

  test("should create a minimal agent with basic information", async ({
    page,
  }) => {
    await test.step("Navigate to agent creation page", async () => {
      await page.goto("/agents/create");
      await expect(page).toHaveTitle(
        /PROMPTZ - Discover, Create, and Share Prompts for Amazon Q Developer/,
      );
      await expect(
        page.getByRole("heading", { name: "Create Agent" }),
      ).toBeVisible();
    });

    await test.step("Fill in agent name", async () => {
      const nameInput = page.getByRole("textbox", { name: "Agent Name" });
      await nameInput.fill("Test Frontend Agent");
      await expect(nameInput).toHaveValue("Test Frontend Agent");
    });

    await test.step("Fill in agent description", async () => {
      const descriptionInput = page.getByRole("textbox", {
        name: "Description",
      });
      await descriptionInput.fill(
        "A test agent for frontend development tasks",
      );
      await expect(descriptionInput).toHaveValue(
        "A test agent for frontend development tasks",
      );
    });

    await test.step("Fill in system prompt", async () => {
      const promptInput = page.getByRole("textbox", { name: "System Prompt" });
      await promptInput.fill(
        "You are a helpful frontend development assistant. Help with React, TypeScript, and modern web development practices.",
      );
      await expect(promptInput).toHaveValue(
        "You are a helpful frontend development assistant. Help with React, TypeScript, and modern web development practices.",
      );
    });

    await test.step("Set agent visibility to public", async () => {
      const visibilityCombobox = page.getByRole("combobox", {
        name: "Visibility",
      });
      await visibilityCombobox.click();

      // Wait for the dropdown options to appear and select "Public"
      await page.getByRole("option", { name: "Public" }).click();

      // Verify the selection
      await expect(visibilityCombobox).toContainText("Public");
    });

    await test.step("Save the agent", async () => {
      const saveButton = page.getByRole("button", { name: "Save Agent" });
      await saveButton.click();
    });

    await test.step("Verify redirection to agent detail page", async () => {
      // Wait for navigation to the agent detail page
      await expect(page).toHaveURL(/\/agents\/agent\/.+/);
    });

    await test.step("Verify agent details are displayed correctly", async () => {
      // Verify the agent name is displayed
      await expect(
        page.getByRole("heading", { name: "Test Frontend Agent" }),
      ).toBeVisible();

      // Verify the description is displayed
      await expect(
        page.getByText("A test agent for frontend development tasks"),
      ).toBeVisible();

      // Verify the system prompt is displayed
      await expect(
        page.getByText(
          "You are a helpful frontend development assistant. Help with React, TypeScript, and modern web development practices.",
        ),
      ).toBeVisible();

      // Verify the public badge is displayed
      await expect(page.getByText("Public")).toBeVisible();
    });
  });
});
