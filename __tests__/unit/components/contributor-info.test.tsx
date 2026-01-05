import { render, screen } from '@testing-library/react'
import { ContributorInfo } from '@/components/contributor-info'
import type { Agent, ContentItem } from '@/lib/types/content'

// Mock the date formatter
jest.mock('@/lib/formatter/date', () => ({
  getFormattedDisplayDate: jest.fn((gitDate: string | undefined, fallbackDate: string | null) => {
    if (gitDate) return `Formatted: ${gitDate}`
    if (fallbackDate) return `Formatted: ${fallbackDate}`
    return null
  })
}))

// Mock the GitHubLink component
jest.mock('@/components/github-link', () => ({
  GitHubLink: ({ content }: { content: ContentItem }) => (
    <a 
      href={`https://github.com/test/repo/blob/main/${content.id}`}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="github-link"
    >
      View on GitHub
    </a>
  )
}))

describe('ContributorInfo', () => {
  const mockAgent: Agent = {
    id: 'test-agent',
    type: 'agent',
    title: 'Test Agent',
    author: 'Test Author',
    date: '2024-01-01',
    path: 'libraries/test-lib/agents/test-agent',
    description: 'A test agent',
    config: { mcpServers: ['test-server'] },
    content: 'Test content'
  }

  it('should render basic contributor information', () => {
    render(<ContributorInfo content={mockAgent} />)
    
    // Component displays author name directly without label
    expect(screen.getByText('Test Author')).toBeInTheDocument()
  })

  it('should prioritize frontmatter author over git author', () => {
    const agentWithGit: Agent = {
      ...mockAgent,
      git: {
        author: 'Git Author',
        authorEmail: 'git@example.com',
        createdDate: '2024-01-01T00:00:00Z',
        lastModifiedDate: '2024-01-02T00:00:00Z',
        commitHash: 'abc123def456',
        commitMessage: 'Initial commit'
      }
    }

    render(<ContributorInfo content={agentWithGit} />)
    
    // Frontmatter author is displayed, not git author
    expect(screen.getByText('Test Author')).toBeInTheDocument()
    expect(screen.queryByText('Git Author')).not.toBeInTheDocument()
    // Updated label is shown for last modified
    expect(screen.getByText('Updated')).toBeInTheDocument()
    // Short hash is displayed
    expect(screen.getByText('abc123d')).toBeInTheDocument()
  })

  it('should fallback to git author when frontmatter author is not available', () => {
    const agentWithoutFrontmatterAuthor: Agent = {
      ...mockAgent,
      author: '', // Empty frontmatter author
      git: {
        author: 'Git Author',
        authorEmail: 'git@example.com',
        createdDate: '2024-01-01T00:00:00Z',
        lastModifiedDate: '2024-01-02T00:00:00Z',
        commitHash: 'abc123def456',
        commitMessage: 'Initial commit'
      }
    }

    render(<ContributorInfo content={agentWithoutFrontmatterAuthor} />)
    
    // Git author is displayed when frontmatter author is empty
    expect(screen.getByText('Git Author')).toBeInTheDocument()
    // Updated label is shown for last modified
    expect(screen.getByText('Updated')).toBeInTheDocument()
    // Short hash is displayed
    expect(screen.getByText('abc123d')).toBeInTheDocument()
  })

  it('should fallback to frontmatter data when git info is not available', () => {
    render(<ContributorInfo content={mockAgent} />)
    
    expect(screen.getByText('Test Author')).toBeInTheDocument()
    // No "Updated" text when no lastModifiedDate
    expect(screen.queryByText('Updated')).not.toBeInTheDocument()
  })

  it('should render GitHub link', () => {
    render(<ContributorInfo content={mockAgent} />)
    
    const githubLink = screen.getByTestId('github-link')
    expect(githubLink).toBeInTheDocument()
    expect(githubLink).toHaveAttribute('target', '_blank')
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('should not render last modified date when not available', () => {
    const agentWithPartialGit: Agent = {
      ...mockAgent,
      git: {
        author: 'Git Author',
        authorEmail: 'git@example.com',
        createdDate: '2024-01-01T00:00:00Z',
        lastModifiedDate: '',
        commitHash: 'abc123def456',
        commitMessage: 'Initial commit'
      }
    }

    render(<ContributorInfo content={agentWithPartialGit} />)
    
    // No "Updated" text when lastModifiedDate is empty
    expect(screen.queryByText('Updated')).not.toBeInTheDocument()
  })

  it('should not render commit hash when not available', () => {
    const agentWithoutCommitHash: Agent = {
      ...mockAgent,
      git: {
        author: 'Git Author',
        authorEmail: 'git@example.com',
        createdDate: '2024-01-01T00:00:00Z',
        lastModifiedDate: '2024-01-02T00:00:00Z',
        commitHash: '',
        commitMessage: 'Initial commit'
      }
    }

    render(<ContributorInfo content={agentWithoutCommitHash} />)
    
    // No commit hash code element when commitHash is empty
    const codeElements = screen.queryAllByRole('code')
    expect(codeElements.length).toBe(0)
  })
})