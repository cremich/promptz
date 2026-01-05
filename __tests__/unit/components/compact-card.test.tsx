import { render, screen } from '@testing-library/react'
import { CompactCard } from '@/components/compact-card'
import type { Prompt, Agent, Power, SteeringDocument, Hook } from '@/lib/types/content'

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
})

// Mock child components
jest.mock('@/components/content-type-badge', () => ({
  ContentTypeBadge: ({ contentType }: { contentType: string }) => (
    <span data-testid="content-type-badge">{contentType}</span>
  )
}))

jest.mock('@/components/library-badge', () => ({
  LibraryBadge: ({ content }: { content: { path: string } }) => (
    <span data-testid="library-badge">{content.path.split('/')[1]}</span>
  )
}))

jest.mock('@/components/badge-container', () => ({
  BadgeContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="badge-container">{children}</div>
  )
}))

jest.mock('@/components/git-hash', () => ({
  GitHash: ({ git }: { git?: { commitHash?: string } }) => (
    <span data-testid="git-hash">{git?.commitHash?.substring(0, 7) || ''}</span>
  )
}))

jest.mock('@/components/content-date', () => ({
  ContentDate: ({ content }: { content: { date: string } }) => (
    <span data-testid="content-date">{content.date}</span>
  )
}))

describe('CompactCard', () => {
  const mockPrompt: Prompt = {
    id: 'promptz/prompts/test-prompt',
    type: 'prompt',
    title: 'Test Prompt',
    author: 'Test Author',
    date: '2024-01-01',
    path: 'libraries/promptz/prompts/test-prompt',
    content: 'Test content'
  }

  const mockAgent: Agent = {
    id: 'promptz/agents/test-agent',
    type: 'agent',
    title: 'Test Agent',
    author: 'Test Author',
    date: '2024-01-01',
    path: 'libraries/promptz/agents/test-agent',
    description: 'A test agent description',
    config: { mcpServers: ['test-server'] },
    content: 'Test content'
  }

  const mockPower: Power = {
    id: 'kiro-powers/powers/test-power',
    type: 'power',
    title: 'Test Power',
    displayName: 'Test Power Display',
    author: 'Test Author',
    date: '2024-01-01',
    path: 'libraries/kiro-powers/powers/test-power',
    description: 'A test power description',
    keywords: ['test'],
    content: 'Test content'
  }

  const mockSteering: SteeringDocument = {
    id: 'promptz/steering/test-steering',
    type: 'steering',
    title: 'Test Steering',
    author: 'Test Author',
    date: '2024-01-01',
    path: 'libraries/promptz/steering/test-steering',
    content: 'Test content'
  }

  const mockHook: Hook = {
    id: 'promptz/hooks/test-hook',
    type: 'hook',
    title: 'Test Hook',
    author: 'Test Author',
    date: '2024-01-01',
    path: 'libraries/promptz/hooks/test-hook',
    description: 'A test hook description',
    trigger: 'onSave',
    content: 'Test content'
  }

  it('renders prompt card with correct link', () => {
    render(<CompactCard item={mockPrompt} />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/prompts/promptz-prompt-test-prompt')
    expect(screen.getByText('Test Prompt')).toBeInTheDocument()
  })

  it('renders agent card with correct link', () => {
    render(<CompactCard item={mockAgent} />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/agents/promptz-agent-test-agent')
    expect(screen.getByText('Test Agent')).toBeInTheDocument()
  })

  it('renders power card with displayName when available', () => {
    render(<CompactCard item={mockPower} />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/powers/kiro-powers-power-test-power')
    expect(screen.getByText('Test Power Display')).toBeInTheDocument()
  })

  it('renders steering card with correct link', () => {
    render(<CompactCard item={mockSteering} />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/steering/promptz-steering-test-steering')
    expect(screen.getByText('Test Steering')).toBeInTheDocument()
  })

  it('renders hook card with correct link', () => {
    render(<CompactCard item={mockHook} />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/hooks/promptz-hook-test-hook')
    expect(screen.getByText('Test Hook')).toBeInTheDocument()
  })

  it('displays content ID', () => {
    render(<CompactCard item={mockPrompt} />)
    
    expect(screen.getByText('ID:')).toBeInTheDocument()
    expect(screen.getByText('promptz/prompts/test-prompt')).toBeInTheDocument()
  })

  it('displays author from frontmatter when available', () => {
    const promptWithGit: Prompt = {
      ...mockPrompt,
      git: {
        author: 'Git Author',
        authorEmail: 'git@example.com',
        createdDate: '2024-01-01T00:00:00Z',
        lastModifiedDate: '2024-01-02T00:00:00Z',
        commitHash: 'abc123def456',
        commitMessage: 'Initial commit'
      }
    }
    render(<CompactCard item={promptWithGit} />)
    
    expect(screen.getByText('Test Author')).toBeInTheDocument()
  })

  it('displays author from git when frontmatter is not available', () => {
    const promptWithoutFrontmatterAuthor: Prompt = {
      ...mockPrompt,
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
    render(<CompactCard item={promptWithoutFrontmatterAuthor} />)
    
    expect(screen.getByText('Git Author')).toBeInTheDocument()
  })

  it('renders content type badge', () => {
    render(<CompactCard item={mockPrompt} />)
    
    expect(screen.getByTestId('content-type-badge')).toHaveTextContent('prompt')
  })

  it('renders library badge', () => {
    render(<CompactCard item={mockPrompt} />)
    
    expect(screen.getByTestId('library-badge')).toBeInTheDocument()
  })

  it('renders content date', () => {
    render(<CompactCard item={mockPrompt} />)
    
    expect(screen.getByTestId('content-date')).toBeInTheDocument()
  })

  it('renders git hash', () => {
    render(<CompactCard item={mockPrompt} />)
    
    expect(screen.getByTestId('git-hash')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<CompactCard item={mockPrompt} className="custom-class" />)
    
    const card = container.querySelector('.custom-class')
    expect(card).toBeInTheDocument()
  })
})

