import { describe, expect, test } from "@jest/globals";
import { agentFormSchema } from "@/lib/models/agent-model";

describe("Agent Form Schema", () => {
  describe("Basic validation", () => {
    test("validates valid agent data", () => {
      const validAgent = {
        name: "Test Agent",
        description: "A test agent for development",
        prompt: "You are a helpful assistant",
        tools: ["@aws/q-developer-cli-chat"],
        resources: [],
        allowedTools: [],
        useLegacyMcpJson: false,
        tags: ["test"],
        scope: "PRIVATE",
      };

      const result = agentFormSchema.safeParse(validAgent);
      expect(result.success).toBe(true);
    });

    test("requires name field", () => {
      const invalidAgent = {
        description: "A test agent",
        prompt: "You are a helpful assistant",
        tools: ["@aws/q-developer-cli-chat"],
        resources: [],
        allowedTools: [],
        useLegacyMcpJson: false,
        tags: [],
        scope: "PRIVATE",
      };

      const result = agentFormSchema.safeParse(invalidAgent);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ["name"],
            message: "Required",
          }),
        );
      }
    });

    test("requires description field", () => {
      const invalidAgent = {
        name: "Test Agent",
        prompt: "You are a helpful assistant",
        tools: ["@aws/q-developer-cli-chat"],
        resources: [],
        allowedTools: [],
        useLegacyMcpJson: false,
        tags: [],
        scope: "PRIVATE",
      };

      const result = agentFormSchema.safeParse(invalidAgent);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ["description"],
            message: "Required",
          }),
        );
      }
    });

    test("requires system prompt field", () => {
      const invalidAgent = {
        name: "Test Agent",
        description: "A test agent for development",
        tools: ["@aws/q-developer-cli-chat"],
        resources: [],
        allowedTools: [],
        useLegacyMcpJson: false,
        tags: [],
        scope: "PRIVATE",
      };

      const result = agentFormSchema.safeParse(invalidAgent);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ["prompt"],
            message: "Required",
          }),
        );
      }
    });
  });

  describe("MCP Server validation", () => {
    test("validates valid MCP server configuration", () => {
      const validAgent = {
        name: "Test Agent",
        description: "A test agent for development",
        prompt: "You are a helpful assistant",
        tools: ["@aws/q-developer-cli-chat"],
        mcpServers: {
          "test-server": {
            command: "node",
            args: ["server.js"],
            env: { NODE_ENV: "production" },
            timeout: 30000,
            disabled: false,
          },
        },
        resources: [],
        allowedTools: [],
        useLegacyMcpJson: false,
        tags: [],
        scope: "PRIVATE",
      };

      const result = agentFormSchema.safeParse(validAgent);
      expect(result.success).toBe(true);
    });

    test("validates MCP server with minimal configuration", () => {
      const validAgent = {
        name: "Test Agent",
        description: "A test agent for development",
        prompt: "You are a helpful assistant",
        tools: ["@aws/q-developer-cli-chat"],
        mcpServers: {
          "minimal-server": {
            command: "python",
          },
        },
        resources: [],
        allowedTools: [],
        useLegacyMcpJson: false,
        tags: [],
        scope: "PRIVATE",
      };

      const result = agentFormSchema.safeParse(validAgent);
      expect(result.success).toBe(true);
    });

    test("rejects MCP server without command", () => {
      const invalidAgent = {
        name: "Test Agent",
        description: "A test agent for development",
        prompt: "You are a helpful assistant",
        tools: ["@aws/q-developer-cli-chat"],
        mcpServers: {
          "invalid-server": {
            args: ["server.js"],
          },
        },
        resources: [],
        allowedTools: [],
        useLegacyMcpJson: false,
        tags: [],
        scope: "PRIVATE",
      };

      const result = agentFormSchema.safeParse(invalidAgent);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ["mcpServers", "invalid-server", "command"],
            message: "Required",
          }),
        );
      }
    });

    test("validates MCP server timeout as positive number", () => {
      const invalidAgent = {
        name: "Test Agent",
        description: "A test agent for development",
        prompt: "You are a helpful assistant",
        tools: ["@aws/q-developer-cli-chat"],
        mcpServers: {
          "timeout-server": {
            command: "node",
            timeout: -1000,
          },
        },
        resources: [],
        allowedTools: [],
        useLegacyMcpJson: false,
        tags: [],
        scope: "PRIVATE",
      };

      const result = agentFormSchema.safeParse(invalidAgent);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ["mcpServers", "timeout-server", "timeout"],
            message: "Timeout must be a positive number",
          }),
        );
      }
    });
  });

  describe("Hooks validation", () => {
    test("validates valid hooks configuration", () => {
      const validAgent = {
        name: "Test Agent",
        description: "A test agent for development",
        prompt: "You are a helpful assistant",
        tools: ["@aws/q-developer-cli-chat"],
        hooks: {
          agentSpawn: {
            command: "echo 'Agent spawned'",
          },
          userPromptSubmit: {
            command: "echo 'User prompt submitted'",
          },
        },
        resources: [],
        allowedTools: [],
        useLegacyMcpJson: false,
        tags: [],
        scope: "PRIVATE",
      };

      const result = agentFormSchema.safeParse(validAgent);
      expect(result.success).toBe(true);
    });

    test("rejects hook without command", () => {
      const invalidAgent = {
        name: "Test Agent",
        description: "A test agent for development",
        prompt: "You are a helpful assistant",
        tools: ["@aws/q-developer-cli-chat"],
        hooks: {
          agentSpawn: {},
        },
        resources: [],
        allowedTools: [],
        useLegacyMcpJson: false,
        tags: [],
        scope: "PRIVATE",
      };

      const result = agentFormSchema.safeParse(invalidAgent);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ["hooks", "agentSpawn", "command"],
            message: "Required",
          }),
        );
      }
    });

    test("validates only known hook types", () => {
      const invalidAgent = {
        name: "Test Agent",
        description: "A test agent for development",
        prompt: "You are a helpful assistant",
        tools: ["@aws/q-developer-cli-chat"],
        hooks: {
          invalidHook: {
            command: "echo 'invalid'",
          },
        },
        resources: [],
        allowedTools: [],
        useLegacyMcpJson: false,
        tags: [],
        scope: "PRIVATE",
      };

      const result = agentFormSchema.safeParse(invalidAgent);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ["hooks"],
            message: expect.stringContaining("Invalid hook type"),
          }),
        );
      }
    });
  });

  describe("Tool settings validation", () => {
    test("validates tool settings as JSON object", () => {
      const validAgent = {
        name: "Test Agent",
        description: "A test agent for development",
        prompt: "You are a helpful assistant",
        tools: ["@aws/q-developer-cli-chat"],
        toolsSettings: {
          "@aws/q-developer-cli-chat": {
            maxTokens: 1000,
            temperature: 0.7,
          },
        },
        resources: [],
        allowedTools: [],
        useLegacyMcpJson: false,
        tags: [],
        scope: "PRIVATE",
      };

      const result = agentFormSchema.safeParse(validAgent);
      expect(result.success).toBe(true);
    });
  });

  describe("Tool aliases validation", () => {
    test("validates tool aliases as string mapping", () => {
      const validAgent = {
        name: "Test Agent",
        description: "A test agent for development",
        prompt: "You are a helpful assistant",
        tools: ["@aws/q-developer-cli-chat"],
        toolAliases: {
          chat: "@aws/q-developer-cli-chat",
          dev: "@aws/q-developer-cli-dev",
        },
        resources: [],
        allowedTools: [],
        useLegacyMcpJson: false,
        tags: [],
        scope: "PRIVATE",
      };

      const result = agentFormSchema.safeParse(validAgent);
      expect(result.success).toBe(true);
    });

    test("rejects non-string alias values", () => {
      const invalidAgent = {
        name: "Test Agent",
        description: "A test agent for development",
        prompt: "You are a helpful assistant",
        tools: ["@aws/q-developer-cli-chat"],
        toolAliases: {
          chat: 123,
        },
        resources: [],
        allowedTools: [],
        useLegacyMcpJson: false,
        tags: [],
        scope: "PRIVATE",
      };

      const result = agentFormSchema.safeParse(invalidAgent);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ["toolAliases", "chat"],
            message: "Expected string, received number",
          }),
        );
      }
    });
  });

  describe("Resources validation", () => {
    test("validates file path resources", () => {
      const validAgent = {
        name: "Test Agent",
        description: "A test agent for development",
        prompt: "You are a helpful assistant",
        tools: ["@aws/q-developer-cli-chat"],
        resources: [
          "/path/to/file.txt",
          "./relative/path.md",
          "~/home/file.json",
        ],
        allowedTools: [],
        useLegacyMcpJson: false,
        tags: [],
        scope: "PRIVATE",
      };

      const result = agentFormSchema.safeParse(validAgent);
      expect(result.success).toBe(true);
    });

    test("validates promptz.dev URLs as resources", () => {
      const validAgent = {
        name: "Test Agent",
        description: "A test agent for development",
        prompt: "You are a helpful assistant",
        tools: ["@aws/q-developer-cli-chat"],
        resources: [
          "https://promptz.dev/prompts/test-prompt",
          "https://promptz.dev/rules/test-rule",
        ],
        allowedTools: [],
        useLegacyMcpJson: false,
        tags: [],
        scope: "PRIVATE",
      };

      const result = agentFormSchema.safeParse(validAgent);
      expect(result.success).toBe(true);
    });

    test("rejects invalid resource URLs", () => {
      const invalidAgent = {
        name: "Test Agent",
        description: "A test agent for development",
        prompt: "You are a helpful assistant",
        tools: ["@aws/q-developer-cli-chat"],
        resources: ["https://example.com/invalid"],
        allowedTools: [],
        useLegacyMcpJson: false,
        tags: [],
        scope: "PRIVATE",
      };

      const result = agentFormSchema.safeParse(invalidAgent);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ["resources", 0],
            message: expect.stringContaining("Invalid resource"),
          }),
        );
      }
    });
  });

  describe("Field length validation", () => {
    test("validates name length constraints", () => {
      const shortName = {
        name: "AB",
        description: "A test agent for development",
        prompt: "You are a helpful assistant",
        tools: ["@aws/q-developer-cli-chat"],
        resources: [],
        allowedTools: [],
        useLegacyMcpJson: false,
        tags: [],
        scope: "PRIVATE",
      };

      const result = agentFormSchema.safeParse(shortName);
      expect(result.success).toBe(false);
    });

    test("validates description length constraints", () => {
      const shortDescription = {
        name: "Test Agent",
        description: "Short",
        prompt: "You are a helpful assistant",
        tools: ["@aws/q-developer-cli-chat"],
        resources: [],
        allowedTools: [],
        useLegacyMcpJson: false,
        tags: [],
        scope: "PRIVATE",
      };

      const result = agentFormSchema.safeParse(shortDescription);
      expect(result.success).toBe(false);
    });

    test("validates system prompt length constraints", () => {
      const shortPrompt = {
        name: "Test Agent",
        description: "A test agent for development",
        prompt: "Short",
        tools: ["@aws/q-developer-cli-chat"],
        resources: [],
        allowedTools: [],
        useLegacyMcpJson: false,
        tags: [],
        scope: "PRIVATE",
      };

      const result = agentFormSchema.safeParse(shortPrompt);
      expect(result.success).toBe(false);
    });
  });

  describe("Optional fields", () => {
    test("allows optional fields to be undefined", () => {
      const minimalAgent = {
        name: "Test Agent",
        description: "A test agent for development",
        prompt: "You are a helpful assistant",
        tools: ["@aws/q-developer-cli-chat"],
        resources: [],
        allowedTools: [],
        useLegacyMcpJson: false,
        tags: [],
        scope: "PRIVATE",
      };

      const result = agentFormSchema.safeParse(minimalAgent);
      expect(result.success).toBe(true);
    });

    test("allows howto field to be optional", () => {
      const agentWithHowto = {
        name: "Test Agent",
        description: "A test agent for development",
        prompt: "You are a helpful assistant",
        howto: "This is how to use the agent",
        tools: ["@aws/q-developer-cli-chat"],
        resources: [],
        allowedTools: [],
        useLegacyMcpJson: false,
        tags: [],
        scope: "PRIVATE",
      };

      const result = agentFormSchema.safeParse(agentWithHowto);
      expect(result.success).toBe(true);
    });
  });
});
