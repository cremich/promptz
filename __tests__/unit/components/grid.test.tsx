import { render, screen } from '@testing-library/react'
import { Grid } from '@/components/grid'
import type { ContentItem } from '@/lib/types/content'

// Mock the CompactCard component
jest.mock('@/components/compact-card', () => ({
  CompactCard: ({ item, className }: { item: { id: string; title: string }; className?: string }) => (
    <div data-testid="compact-card" data-item-id={item.id} className={className}>
      {item.title}
    </div>
  ),
  CompactCardSkeleton: ({ className }: { className?: string }) => (
    <div data-testid="compact-card-skeleton" className={className}>
      Loading...
    </div>
  )
}))

const mockContentItems: ContentItem[] = [
  {
    type: 'prompt',
    id: 'promptz/prompts/prompt-1',
    title: 'Test Prompt 1',
    author: 'Author 1',
    date: '2024-01-15',
    path: '/libraries/promptz/prompts/prompt-1.md',
    content: 'Prompt 1 content'
  },
  {
    type: 'agent',
    id: 'promptz/agents/agent-1',
    title: 'Test Agent 1',
    author: 'Author 2',
    date: '2024-01-14',
    path: '/libraries/promptz/agents/agent-1',
    description: 'Test agent 1 description',
    config: { mcpServers: ['test-server'] },
    content: 'Agent 1 content'
  },
  {
    type: 'power',
    id: 'kiro-powers/power-1',
    title: 'Test Power 1',
    displayName: 'Test Power 1',
    author: 'Author 3',
    date: '2024-01-13',
    path: '/libraries/kiro-powers/power-1',
    description: 'Test power 1 description',
    keywords: ['test', 'power'],
    content: 'Power 1 content'
  },
  {
    type: 'hook',
    id: 'promptz/hooks/hook-1',
    title: 'Test Hook 1',
    author: 'Author 4',
    date: '2024-01-12',
    path: '/libraries/promptz/hooks/hook-1.kiro.hook',
    description: 'Test hook 1 description',
    content: 'Hook 1 content',
    trigger: 'userTriggered'
  },
  {
    type: 'steering',
    id: 'promptz/steering/steering-1',
    title: 'Test Steering 1',
    author: 'Author 5',
    date: '2024-01-11',
    path: '/libraries/promptz/steering/steering-1.md',
    content: 'Steering 1 content'
  }
]

describe('Grid', () => {
  it('should render all content items when no maxItems specified', () => {
    render(<Grid items={mockContentItems} />)
    
    expect(screen.getByText('Test Prompt 1')).toBeInTheDocument()
    expect(screen.getByText('Test Agent 1')).toBeInTheDocument()
    expect(screen.getByText('Test Power 1')).toBeInTheDocument()
    expect(screen.getByText('Test Hook 1')).toBeInTheDocument()
    expect(screen.getByText('Test Steering 1')).toBeInTheDocument()
    
    const allCards = screen.getAllByTestId('compact-card')
    expect(allCards).toHaveLength(5)
  })

  it('should limit items when maxItems is specified', () => {
    render(<Grid items={mockContentItems} maxItems={3} />)
    
    expect(screen.getByText('Test Prompt 1')).toBeInTheDocument()
    expect(screen.getByText('Test Agent 1')).toBeInTheDocument()
    expect(screen.getByText('Test Power 1')).toBeInTheDocument()
    expect(screen.queryByText('Test Hook 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Test Steering 1')).not.toBeInTheDocument()
    
    const allCards = screen.getAllByTestId('compact-card')
    expect(allCards).toHaveLength(3)
  })

  it('should render empty state when no items provided', () => {
    render(<Grid items={[]} />)
    
    expect(screen.getByText('No content available')).toBeInTheDocument()
    expect(screen.getByText('Check back later for new content')).toBeInTheDocument()
    expect(screen.queryByTestId('compact-card')).not.toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(<Grid items={mockContentItems} className="custom-grid-class" />)
    
    expect(container.firstChild).toHaveClass('custom-grid-class')
  })

  it('should apply h-full class to all cards', () => {
    render(<Grid items={mockContentItems} />)
    
    const allCards = screen.getAllByTestId('compact-card')
    allCards.forEach(card => {
      expect(card).toHaveClass('h-full')
    })
  })

  it('should handle maxItems of 0', () => {
    render(<Grid items={mockContentItems} maxItems={0} />)
    
    expect(screen.getByText('No content available')).toBeInTheDocument()
    expect(screen.queryByTestId('compact-card')).not.toBeInTheDocument()
  })

  it('should handle maxItems larger than items array', () => {
    render(<Grid items={mockContentItems} maxItems={10} />)
    
    const allCards = screen.getAllByTestId('compact-card')
    expect(allCards).toHaveLength(5)
  })

  it('should render single item correctly', () => {
    const singleItem = [mockContentItems[0]]
    render(<Grid items={singleItem} />)
    
    const allCards = screen.getAllByTestId('compact-card')
    expect(allCards).toHaveLength(1)
    expect(screen.getByText('Test Prompt 1')).toBeInTheDocument()
  })

  it('should pass correct item id to each card', () => {
    render(<Grid items={mockContentItems} />)
    
    const allCards = screen.getAllByTestId('compact-card')
    expect(allCards[0]).toHaveAttribute('data-item-id', 'promptz/prompts/prompt-1')
    expect(allCards[1]).toHaveAttribute('data-item-id', 'promptz/agents/agent-1')
    expect(allCards[2]).toHaveAttribute('data-item-id', 'kiro-powers/power-1')
    expect(allCards[3]).toHaveAttribute('data-item-id', 'promptz/hooks/hook-1')
    expect(allCards[4]).toHaveAttribute('data-item-id', 'promptz/steering/steering-1')
  })
})
