import { test, expect } from "@playwright/test";

test.describe("Create Agent with Tool Configuration", () => {
  // Use the authentication state from the login test
  test.use({ storageState: ".playwright/.auth/user.json" });

  test("should create an agent with comprehensive tool configuration", async ({
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
      await nameInput.fill("File Management Agent");
      await expect(nameInput).toHaveValue("File Management Agent");
    });

    await test.step("Fill in agent description", async () => {
      const descriptionInput = page.getByRole("textbox", {
        name: "Description",
      });
      await descriptionInput.fill(
        "An agent that helps with file system operations including reading and writing files",
      );
      await expect(descriptionInput).toHaveValue(
        "An agent that helps with file system operations including reading and writing files",
      );
    });

    await test.step("Fill in system prompt", async () => {
      const promptInput = page.getByRole("textbox", { name: "System Prompt" });
      await promptInput.fill(
        "You are a file management assistant. Help users with reading, writing, and managing files efficiently. Use the available file system tools to assist with file operations.",
      );
      await expect(promptInput).toHaveValue(
        "You are a file management assistant. Help users with reading, writing, and managing files efficiently. Use the available file system tools to assist with file operations.",
      );
    });

    await test.step("Configure available tools (fs_read and fs_write)", async () => {
      // First expand the Tools Configuration section
      await page.getByText("Tools Configuration").click();

      // Click on the Available Tools combobox
      const availableToolsCombobox = page
        .getByRole("combobox")
        .filter({ hasText: "Select tools your agent can" });
      await availableToolsCombobox.click();

      // Select fs_read
      await page.getByRole("option", { name: "fs_read" }).click();

      // Select fs_write
      await page.getByRole("option", { name: "fs_write" }).click();

      // Close the dropdown by clicking elsewhere
      await page.getByRole("heading", { name: "Create Agent" }).click();

      // Verify both tools are selected
      await expect(page.getByText("fs_read").first()).toBeVisible();
      await expect(page.getByText("fs_write").first()).toBeVisible();
    });

    await test.step("Configure tool alias (read -> fs_read)", async () => {
      // Fill in alias name
      const aliasNameInput = page.getByRole("textbox", {
        name: "Alias name (e.g., 'read')",
      });
      await aliasNameInput.fill("read");

      // Fill in tool name
      const toolNameInput = page.getByRole("textbox", {
        name: "Tool name (e.g., 'fs_read')",
      });
      await toolNameInput.fill("fs_read");

      // Click the add button to add the alias
      await page
        .locator("div")
        .filter({ hasText: /^→$/ })
        .getByRole("button")
        .click();

      // Verify the alias was added
      await expect(page.getByText("read").first()).toBeVisible();
    });

    await test.step("Configure allowed tools restriction (fs_read only)", async () => {
      // Click on the Allowed Tools combobox
      const allowedToolsCombobox = page
        .getByRole("combobox")
        .filter({ hasText: "Optionally restrict to" });
      await allowedToolsCombobox.click();

      // Select fs_read (use .first() to select the first occurrence)
      await page.getByRole("option", { name: "fs_read" }).first().click();

      // Verify fs_read is selected in allowed tools
      await expect(page.getByText("fs_read").nth(2)).toBeVisible(); // Third occurrence should be in allowed tools
    });

    await test.step("Activate legacy MCP JSON support", async () => {
      const legacyMcpSwitch = page.getByRole("switch");
      await legacyMcpSwitch.click();

      // Verify the switch is checked
      await expect(legacyMcpSwitch).toBeChecked();
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
        page.getByRole("heading", { name: "File Management Agent" }),
      ).toBeVisible();

      // Verify the description is displayed
      await expect(
        page.getByText(
          "An agent that helps with file system operations including reading and writing files",
        ),
      ).toBeVisible();

      // Verify the system prompt is displayed
      await expect(
        page.getByText(
          "You are a file management assistant. Help users with reading, writing, and managing files efficiently. Use the available file system tools to assist with file operations.",
        ),
      ).toBeVisible();

      // Verify the public badge is displayed
      await expect(page.getByText("Public")).toBeVisible();
    });

    await test.step("Verify tool configuration is displayed correctly", async () => {
      // Verify the tools section shows both fs_read and fs_write
      await expect(
        page.getByRole("heading", { name: "Tools", exact: true }),
      ).toBeVisible();
      await expect(page.getByText("fs_read").first()).toBeVisible();
      await expect(page.getByText("fs_write").first()).toBeVisible();

      // Verify the allowed tools section shows only fs_read
      await expect(
        page.getByRole("heading", { name: "Allowed Tools" }),
      ).toBeVisible();

      // Verify the tool aliases section shows the configured alias
      await expect(
        page.getByRole("heading", { name: "Tool Aliases" }),
      ).toBeVisible();
      await expect(page.getByText('{ "read": "fs_read" }')).toBeVisible();

      // Verify the configuration options show Legacy MCP JSON as enabled
      await expect(
        page.getByRole("heading", { name: "Configuration Options" }),
      ).toBeVisible();
      await expect(page.getByText("Legacy MCP JSON: Enabled")).toBeVisible();
    });
  });
});
