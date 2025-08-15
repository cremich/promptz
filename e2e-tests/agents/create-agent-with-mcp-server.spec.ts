import { test, expect } from "@playwright/test";

test.describe("Create Agent with MCP Server Configuration", () => {
  // Use the authentication state from the login test
  test.use({ storageState: ".playwright/.auth/user.json" });

  test("should create an agent with git MCP server configuration", async ({
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
      await nameInput.fill("Git Operations Agent");
      await expect(nameInput).toHaveValue("Git Operations Agent");
    });

    await test.step("Fill in agent description", async () => {
      const descriptionInput = page.getByRole("textbox", {
        name: "Description",
      });
      await descriptionInput.fill(
        "An agent that helps with Git operations including repository management, commit history, and branch operations using the Git MCP server",
      );
      await expect(descriptionInput).toHaveValue(
        "An agent that helps with Git operations including repository management, commit history, and branch operations using the Git MCP server",
      );
    });

    await test.step("Fill in system prompt", async () => {
      const promptInput = page.getByRole("textbox", { name: "System Prompt" });
      await promptInput.fill(
        "You are a Git operations assistant. Help users with Git repository management, commit history analysis, branch operations, and other Git-related tasks. Use the Git MCP server to access repository information and perform Git operations efficiently.",
      );
      await expect(promptInput).toHaveValue(
        "You are a Git operations assistant. Help users with Git repository management, commit history analysis, branch operations, and other Git-related tasks. Use the Git MCP server to access repository information and perform Git operations efficiently.",
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

    await test.step("Configure Git MCP server", async () => {
      // Add a new MCP server
      const serverNameInput = page.getByRole("textbox", {
        name: "Server name (e.g., 'filesystem', 'git')",
      });
      await serverNameInput.fill("git");

      // Click the add button to add the server - the button is in the same container as the input
      // Wait for the button to be enabled after typing the server name
      await page.waitForTimeout(500); // Small delay to ensure the button is enabled

      const addServerButton = page
        .getByRole("button")
        .filter({ hasText: /^$/ }) // Button with only an icon, no text
        .nth(1); // Second button with no text (first is likely disabled)
      await addServerButton.click();

      // Verify the server was added and is expanded
      await expect(page.getByText("git").first()).toBeVisible();

      // Configure the command for the git server
      const commandInput = page.getByRole("textbox", { name: "Command *" });
      await commandInput.fill("npx @modelcontextprotocol/server-git");
      await expect(commandInput).toHaveValue(
        "npx @modelcontextprotocol/server-git",
      );

      // Add the first argument (--repository)
      const argInput = page.getByRole("textbox", {
        name: "Add argument (e.g., '--port', '3000')",
      });
      await argInput.fill("--repository");

      // Click the add argument button
      const addArgButton = page
        .locator("div")
        .filter({
          hasText:
            /^No arguments configured\. Arguments will be passed to the command in order\.$/,
        })
        .getByRole("button");
      await addArgButton.click();

      // Add the second argument (.)
      const argInput2 = page.getByRole("textbox", {
        name: "Add argument (e.g., '--port', '3000')",
      });
      await argInput2.fill(".");

      // Click the add argument button again
      const addArgButton2 = page
        .locator("div")
        .filter({ hasText: /^Arguments$/ })
        .getByRole("button")
        .nth(1);
      await addArgButton2.click();

      // Verify arguments were added
      await expect(page.locator('input[value="--repository"]')).toBeVisible();
      await expect(page.locator('input[value="."]')).toBeVisible();
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
        page.getByRole("heading", { name: "Git Operations Agent" }),
      ).toBeVisible();

      // Verify the description is displayed
      await expect(
        page.getByText(
          "An agent that helps with Git operations including repository management, commit history, and branch operations using the Git MCP server",
        ),
      ).toBeVisible();

      // Verify the system prompt is displayed
      await expect(
        page.getByText(
          "You are a Git operations assistant. Help users with Git repository management, commit history analysis, branch operations, and other Git-related tasks. Use the Git MCP server to access repository information and perform Git operations efficiently.",
        ),
      ).toBeVisible();

      // Verify the public badge is displayed
      await expect(page.getByText("Public")).toBeVisible();
    });

    await test.step("Verify MCP server configuration is displayed correctly", async () => {
      // Verify the MCP Servers section is visible
      await expect(
        page.getByRole("heading", { name: "MCP Servers" }),
      ).toBeVisible();

      // Verify the git server configuration is displayed with the complete JSON
      await expect(
        page.getByText(
          '{ "git": { "args": [ "--repository", "." ], "disabled": false, "env": {}, "command": "npx @modelcontextprotocol/server-git" } }',
        ),
      ).toBeVisible();
    });
  });
});
