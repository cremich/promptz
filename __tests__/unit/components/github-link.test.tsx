import { render, screen } from '@testing-library/react'
import { GitHubLink } from '@/components/github-link'
import type { Agent, Prompt } from '@/lib/types/content'

describe('GitHubLink', () => {
  const mockKiroPowersAgent: Agent = {
    id: 'test-agent',
    type: 'agent',
    title: 'Test Agent',
    author: 'Test Author',
    date: '2024-01-01',
    path: 'libraries/kiro-powers/agents/test-agent/agent.md',
    description: 'A test agent',
    config: { mcpServers: ['test-server'] },
    content: 'Test content'
  }

  const mockPromptzPrompt: Prompt = {
    id: 'test-prompt',
    type: 'prompt',
    title: 'Test Prompt',
    author: 'Test Author',
    date: '2024-01-01',
    path: 'libraries/promptz/prompts/test-prompt.md',
    content: 'Test prompt content'
  }

  it('should render GitHub link with correct URL for kiro-powers library', () => {
    render(<GitHubLink content={mockKiroPowersAgent} />)
    
    const link = screen.getByRole('link', { name: /view on github/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://github.com/kirodotdev/powers/blob/main/agents/test-agent/agent.md')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('should render GitHub link with correct URL for promptz library', () => {
    render(<GitHubLink content={mockPromptzPrompt} />)
    
    const link = screen.getByRole('link', { name: /view on github/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://github.com/cremich/promptz.lib/blob/main/prompts/test-prompt.md')
  })

  it('should use default GitHub URL for unknown library', () => {
    const unknownLibraryContent: Agent = {
      ...mockKiroPowersAgent,
      path: 'libraries/unknown-lib/agents/test-agent/agent.md'
    }

    render(<GitHubLink content={unknownLibraryContent} />)
    
    const link = screen.getByRole('link', { name: /view on github/i })
    expect(link).toHaveAttribute('href', 'https://github.com/cremich/promptz.lib/blob/main/agents/test-agent/agent.md')
  })

  it('should apply custom className when provided', () => {
    render(<GitHubLink content={mockKiroPowersAgent} className="custom-link-class" />)
    
    const link = screen.getByRole('link', { name: /view on github/i })
    expect(link).toHaveClass('custom-link-class')
  })

  it('should render GitHub icon', () => {
    render(<GitHubLink content={mockKiroPowersAgent} />)
    
    const icon = screen.getByRole('link').querySelector('svg')
    expect(icon).toBeInTheDocument()
  })

  it('should handle paths without libraries directory', () => {
    const contentWithoutLibraries: Agent = {
      ...mockKiroPowersAgent,
      path: 'agents/test-agent/agent.md'
    }

    render(<GitHubLink content={contentWithoutLibraries} />)
    
    const link = screen.getByRole('link', { name: /view on github/i })
    // Should default to promptz.lib URL when library name is unknown
    expect(link).toHaveAttribute('href', 'https://github.com/cremich/promptz.lib/blob/main/agents/test-agent/agent.md')
  })

  it('should extract correct relative path from complex paths', () => {
    const complexPathContent: Agent = {
      ...mockKiroPowersAgent,
      path: '/full/path/to/libraries/kiro-powers/category/subcategory/test-agent/agent.md'
    }

    render(<GitHubLink content={complexPathContent} />)
    
    const link = screen.getByRole('link', { name: /view on github/i })
    expect(link).toHaveAttribute('href', 'https://github.com/kirodotdev/powers/blob/main/category/subcategory/test-agent/agent.md')
  })
})