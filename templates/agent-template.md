# Agent Template (Page Bundle Structure)

Agents use a page bundle structure with separate files for better organization:

## Directory Structure

```
your-agent-name/
├── index.md      # Frontmatter and description
├── prompt.md     # System prompt content
└── agent.json    # Agent configuration
```

## Template Files

- Use `agent-index-template.md` for the index.md file
- Use `agent-prompt-template.md` for the prompt.md file
- Use `agent-config-template.json` for the agent.json file

## Benefits

- Clean separation of concerns
- Easy to edit system prompts as markdown
- JSON configuration without escaped strings
- Better version control and collaboration
