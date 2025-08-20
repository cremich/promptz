import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AgentConfiguration from "@/components/agents/agent-configuration";
import { Settings } from "lucide-react";
import { Agent } from "@/lib/models/agent-model";

describe("AgentConfiguration", () => {
  const baseAgent: Agent = {
    id: "agent-1",
    name: "Test Agent",
  };

  const defaultProps = {
    title: "Agent Configuration",
    agent: baseAgent,
    icon: Settings,
  };

  test("Renders configuration title", () => {
    render(<AgentConfiguration {...defaultProps} />);

    expect(screen.getByText("Agent Configuration")).toBeInTheDocument();
  });

  test("Displays tools section when tools exist", () => {
    const agentWithTools = {
      ...baseAgent,
      tools: ["tool1", "tool2", "tool3"],
    };

    render(<AgentConfiguration {...defaultProps} agent={agentWithTools} />);

    expect(screen.getByText("Tools")).toBeInTheDocument();
    expect(screen.getByText("tool1")).toBeInTheDocument();
    expect(screen.getByText("tool2")).toBeInTheDocument();
    expect(screen.getByText("tool3")).toBeInTheDocument();
  });

  test("Hides tools section when no tools", () => {
    render(<AgentConfiguration {...defaultProps} />);

    expect(screen.queryByText("Tools")).not.toBeInTheDocument();
  });

  test("Displays allowed tools section when allowed tools exist", () => {
    const agentWithAllowedTools = {
      ...baseAgent,
      allowedTools: ["allowed1", "allowed2"],
    };

    render(
      <AgentConfiguration {...defaultProps} agent={agentWithAllowedTools} />,
    );

    expect(screen.getByText("Allowed Tools")).toBeInTheDocument();
    expect(screen.getByText("allowed1")).toBeInTheDocument();
    expect(screen.getByText("allowed2")).toBeInTheDocument();
  });

  test("Displays resources section when resources exist", () => {
    const agentWithResources = {
      ...baseAgent,
      resources: ["resource1.txt", "resource2.md"],
    };

    render(<AgentConfiguration {...defaultProps} agent={agentWithResources} />);

    expect(screen.getByText("Resources")).toBeInTheDocument();
    expect(screen.getByText("resource1.txt")).toBeInTheDocument();
    expect(screen.getByText("resource2.md")).toBeInTheDocument();
  });

  test("Displays MCP servers section when MCP servers exist", () => {
    const agentWithMcpServers = {
      ...baseAgent,
      mcpServers: {
        server1: { command: "test-command", args: ["arg1"] },
        server2: { command: "another-command" },
      },
    };

    render(
      <AgentConfiguration {...defaultProps} agent={agentWithMcpServers} />,
    );

    expect(screen.getByText("MCP Servers")).toBeInTheDocument();
    expect(screen.getByText(/"server1"/)).toBeInTheDocument();
    expect(screen.getByText(/"command": "test-command"/)).toBeInTheDocument();
  });

  test("Displays hooks section when hooks exist", () => {
    const agentWithHooks = {
      ...baseAgent,
      hooks: {
        agentSpawn: "spawn-hook",
        userPromptSubmit: "submit-hook",
      },
    };

    render(<AgentConfiguration {...defaultProps} agent={agentWithHooks} />);

    expect(screen.getByText("Hooks")).toBeInTheDocument();
    expect(screen.getByText(/"agentSpawn"/)).toBeInTheDocument();
    expect(screen.getByText(/"spawn-hook"/)).toBeInTheDocument();
  });

  test("Displays tool settings section when tool settings exist", () => {
    const agentWithToolSettings = {
      ...baseAgent,
      toolsSettings: {
        setting1: "value1",
        setting2: { nested: "value" },
      },
    };

    render(
      <AgentConfiguration {...defaultProps} agent={agentWithToolSettings} />,
    );

    expect(screen.getByText("Tool Settings")).toBeInTheDocument();
    expect(screen.getByText(/"setting1"/)).toBeInTheDocument();
    expect(screen.getByText(/"value1"/)).toBeInTheDocument();
  });

  test("Displays tool aliases section when tool aliases exist", () => {
    const agentWithToolAliases = {
      ...baseAgent,
      toolAliases: {
        alias1: "tool1",
        alias2: "tool2",
      },
    };

    render(
      <AgentConfiguration {...defaultProps} agent={agentWithToolAliases} />,
    );

    expect(screen.getByText("Tool Aliases")).toBeInTheDocument();
    expect(screen.getByText(/"alias1"/)).toBeInTheDocument();
    expect(screen.getByText(/"tool1"/)).toBeInTheDocument();
  });

  test("Displays configuration options section with legacy MCP JSON flag", () => {
    const agentWithLegacyFlag = {
      ...baseAgent,
      useLegacyMcpJson: true,
    };

    render(
      <AgentConfiguration {...defaultProps} agent={agentWithLegacyFlag} />,
    );

    expect(screen.getByText("Configuration Options")).toBeInTheDocument();
    expect(screen.getByText("Legacy MCP JSON: Enabled")).toBeInTheDocument();
  });

  test("Shows disabled legacy MCP JSON flag", () => {
    const agentWithLegacyFlag = {
      ...baseAgent,
      useLegacyMcpJson: false,
    };

    render(
      <AgentConfiguration {...defaultProps} agent={agentWithLegacyFlag} />,
    );

    expect(screen.getByText("Legacy MCP JSON: Disabled")).toBeInTheDocument();
  });

  test("Hides all sections when agent has no configuration", () => {
    render(<AgentConfiguration {...defaultProps} />);

    expect(screen.queryByText("Tools")).not.toBeInTheDocument();
    expect(screen.queryByText("Allowed Tools")).not.toBeInTheDocument();
    expect(screen.queryByText("Resources")).not.toBeInTheDocument();
    expect(screen.queryByText("MCP Servers")).not.toBeInTheDocument();
    expect(screen.queryByText("Hooks")).not.toBeInTheDocument();
    expect(screen.queryByText("Tool Settings")).not.toBeInTheDocument();
    expect(screen.queryByText("Tool Aliases")).not.toBeInTheDocument();
    expect(screen.queryByText("Configuration Options")).not.toBeInTheDocument();
  });

  test("Handles empty arrays and objects", () => {
    const agentWithEmptyConfig = {
      ...baseAgent,
      tools: [],
      allowedTools: [],
      resources: [],
      mcpServers: {},
      hooks: {},
      toolsSettings: {},
      toolAliases: {},
    };

    render(
      <AgentConfiguration {...defaultProps} agent={agentWithEmptyConfig} />,
    );

    expect(screen.queryByText("Tools")).not.toBeInTheDocument();
    expect(screen.queryByText("Allowed Tools")).not.toBeInTheDocument();
    expect(screen.queryByText("Resources")).not.toBeInTheDocument();
    expect(screen.queryByText("MCP Servers")).not.toBeInTheDocument();
    expect(screen.queryByText("Hooks")).not.toBeInTheDocument();
    expect(screen.queryByText("Tool Settings")).not.toBeInTheDocument();
    expect(screen.queryByText("Tool Aliases")).not.toBeInTheDocument();
  });
});
