import { test, expect } from "@playwright/test";

test.describe("Agent Creation with Resources and Lifecycle Hooks", () => {
  test.use({ storageState: ".playwright/.auth/user.json" });

  test("should create agent with file resources and lifecycle hooks configuration", async ({
    page,
  }) => {
    await test.step("Navigate to agent creation page", async () => {
      await page.goto("/agents/create");
      await expect(page).toHaveTitle(/PROMPTZ/);
      await expect(
        page.getByRole("heading", { name: "Create Agent" }),
      ).toBeVisible();
    });

    await test.step("Fill basic information", async () => {
      await page
        .getByRole("textbox", { name: "Agent Name" })
        .fill("DevOps Configuration Agent");
      await page
        .getByRole("textbox", { name: "Description" })
        .fill(
          "A specialized agent for DevOps tasks including infrastructure configuration, deployment automation, and monitoring setup. It has access to configuration files and runs setup commands during initialization.",
        );
      await page
        .getByRole("textbox", { name: "System Prompt" })
        .fill(
          "You are a DevOps automation assistant specializing in infrastructure configuration, deployment pipelines, and monitoring setup. You help with Docker configurations, CI/CD pipelines, cloud infrastructure, and deployment automation. You have access to configuration files and can run initialization commands to set up the development environment.",
        );
    });

    await test.step("Configure file resources", async () => {
      // Add first resource
      await page
        .getByRole("textbox", { name: "Enter file path (e.g., ./src/" })
        .fill("./docker-compose.yml");
      await page.getByRole("button", { name: "Add Resource" }).click();

      // Verify first resource was added
      await expect(page.getByText("Configured Resources (1)")).toBeVisible();
      await expect(page.getByText("./docker-compose.yml")).toBeVisible();
      await expect(page.getByText("Relative path")).toBeVisible();

      // Add second resource
      await page
        .getByRole("textbox", { name: "Enter file path (e.g., ./src/" })
        .fill("./Dockerfile");
      await page.getByRole("button", { name: "Add Resource" }).click();

      // Verify second resource was added
      await expect(page.getByText("Configured Resources (2)")).toBeVisible();
      await expect(page.getByText("./Dockerfile")).toBeVisible();
    });

    await test.step("Configure lifecycle hooks", async () => {
      // Select hook type
      await page
        .getByRole("combobox")
        .filter({ hasText: "Select hook type" })
        .click();
      await page
        .getByRole("option", { name: "Agent Spawn Executed when the" })
        .click();

      // Enter command
      await page
        .getByRole("textbox", { name: "Enter command to execute" })
        .fill("docker-compose up -d");

      // Add hook
      await page.getByRole("button", { name: "Add Hook" }).click();

      // Verify hook was added
      await expect(page.getByText("Configured Hooks (1)")).toBeVisible();
      await expect(page.getByText("Agent Spawn")).toBeVisible();
      await expect(
        page.getByText("Executed when the agent is first initialized"),
      ).toBeVisible();
    });

    await test.step("Set visibility and save agent", async () => {
      // Set visibility to Public
      await page.getByRole("combobox", { name: "Visibility" }).click();
      await page.getByRole("option", { name: "Public" }).click();

      // Save the agent
      await page.locator('[data-test-id="agent_form_submit"]').click();
    });

    await test.step("Verify agent creation and redirect to detail page", async () => {
      // Wait for redirect to agent detail page
      await expect(page).toHaveURL(
        /\/agents\/agent\/devops-configuration-agent-/,
      );
      await expect(page).toHaveTitle(
        /DevOps Configuration Agent agent for Amazon Q Developer/,
      );

      // Verify agent details
      await expect(
        page.getByRole("heading", { name: "DevOps Configuration Agent" }),
      ).toBeVisible();
      await expect(
        page.getByText(
          "A specialized agent for DevOps tasks including infrastructure configuration",
        ),
      ).toBeVisible();
      await expect(page.getByText("Public")).toBeVisible();
    });

    await test.step("Verify resources and hooks configuration display", async () => {
      // Verify System Prompt section
      await expect(
        page.getByRole("heading", { name: "System Prompt" }),
      ).toBeVisible();
      await expect(
        page.getByText(
          "You are a DevOps automation assistant specializing in infrastructure configuration",
        ),
      ).toBeVisible();

      // Verify Agent Configuration section
      await expect(
        page.getByRole("heading", { name: "Agent Configuration" }),
      ).toBeVisible();

      // Verify Resources section
      await expect(
        page.getByRole("heading", { name: "Resources" }),
      ).toBeVisible();
      await expect(page.getByText("./docker-compose.yml")).toBeVisible();
      await expect(page.getByText("./Dockerfile")).toBeVisible();

      // Verify Hooks section
      await expect(page.getByRole("heading", { name: "Hooks" })).toBeVisible();
      await expect(
        page.getByText(
          '{ "agentSpawn": { "command": "docker-compose up -d" } }',
        ),
      ).toBeVisible();

      // Verify Configuration Options
      await expect(
        page.getByRole("heading", { name: "Configuration Options" }),
      ).toBeVisible();
      await expect(page.getByText("Legacy MCP JSON: Disabled")).toBeVisible();
    });
  });
});
