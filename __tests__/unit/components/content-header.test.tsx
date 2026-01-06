import { render, screen } from '@testing-library/react'
import { ContentHeader } from '@/components/content-header'
import type { Agent, Prompt } from '@/lib/types/content'

// Mock the badge components
jest.mock('@/components/content-type-badge', () => ({
  ContentTypeBadge: ({ contentType }: { contentType: string }) => (
    <span data-testid="content-type-badge">{contentType}</span>
  )
}))

jest.mock('@/components/library-badge', () => ({
  LibraryBadge: ({ content }: { content: { path: string } }) => (
    <span data-testid="library-badge">{content.path.includes('test-lib') ? 'test-lib' : 'unknown'}</span>
  )
}))

describe('ContentHeader', () => {
  const mockAgent: Agent = {
    id: 'test-agent',
    type: 'agent',
    title: 'Test Agent',
    author: 'Test Author',
    date: '2024-01-01',
    path: 'libraries/test-lib/agents/test-agent',
    description: 'A test agent for testing purposes',
    config: { mcpServers: ['test-server'] },
    content: 'Test agent content'
  }

  const mockPrompt: Prompt = {
    id: 'test-prompt',
    type: 'prompt',
    title: 'Test Prompt',
    author: 'Test Author',
    date: '2024-01-01',
    path: 'libraries/test-lib/prompts/test-prompt',
    content: 'Test prompt content'
  }

  it('should render content title and badges', () => {
    render(<ContentHeader content={mockAgent} />)
    
    expect(screen.getByText('Test Agent')).toBeInTheDocument()
    expect(screen.getByTestId('content-type-badge')).toHaveTextContent('agent')
    expect(screen.getByTestId('library-badge')).toHaveTextContent('test-lib')
  })

  it('should render description when available', () => {
    render(<ContentHeader content={mockAgent} />)
    
    expect(screen.getByText('A test agent for testing purposes')).toBeInTheDocument()
  })

  it('should not render description when not available', () => {
    render(<ContentHeader content={mockPrompt} />)
    
    expect(screen.queryByText('A test agent for testing purposes')).not.toBeInTheDocument()
  })

  it('should render power displayName when available', () => {
    const mockPower = {
      id: 'test-power',
      type: 'power' as const,
      title: 'Test Power',
      displayName: 'Test Power Display Name',
      author: 'Test Author',
      date: '2024-01-01',
      path: 'libraries/test-lib/powers/test-power',
      description: 'A test power',
      keywords: ['test'],
      content: 'Test content'
    }
    render(<ContentHeader content={mockPower} />)
    
    expect(screen.getByText('Test Power Display Name')).toBeInTheDocument()
  })

  it('should render power title when displayName is not available', () => {
    const mockPower = {
      id: 'test-power',
      type: 'power' as const,
      title: 'Test Power Title',
      author: 'Test Author',
      date: '2024-01-01',
      path: 'libraries/test-lib/powers/test-power',
      description: 'A test power',
      keywords: ['test'],
      content: 'Test content'
    }
    //@ts-expect-error: explicit for test
    render(<ContentHeader content={mockPower} />) 
    
    expect(screen.getByText('Test Power Title')).toBeInTheDocument()
  })
})