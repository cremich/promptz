import { render, screen } from '@testing-library/react'
import { ContentDate } from '@/components/content-date'
import type { ContentItem, GitInfo } from '@/lib/types/content'

describe('ContentDate', () => {
  const mockGitInfo: GitInfo = {
    author: 'Test Author',
    authorEmail: 'test@example.com',
    createdDate: '2024-01-15T10:30:00Z',
    lastModifiedDate: '2024-01-20T15:45:00Z',
    commitHash: 'abc123def456',
    commitMessage: 'Test commit'
  }

  const mockContent: ContentItem = {
    id: 'test-content',
    title: 'Test Content',
    author: 'Test Author',
    date: '2024-01-10T08:00:00Z',
    path: '/test/path',
    type: 'prompt',
    content: 'Test content',
    git: mockGitInfo
  }

  it('renders git creation date when available', () => {
    render(<ContentDate content={mockContent} />)
    
    // Should prioritize git date over frontmatter date
    expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument()
  })

  it('falls back to frontmatter date when git info is not available', () => {
    const contentWithoutGit: ContentItem = {
      ...mockContent,
      git: undefined
    }
    
    render(<ContentDate content={contentWithoutGit} />)
    
    expect(screen.getByText('Jan 10, 2024')).toBeInTheDocument()
  })

  it('shows "Unknown Date" when no dates are available', () => {
    const contentWithoutDates: ContentItem = {
      ...mockContent,
      date: '',
      git: undefined
    }
    
    render(<ContentDate content={contentWithoutDates} />)
    
    expect(screen.getByText('Unknown Date')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(
      <ContentDate 
        content={mockContent} 
        className="custom-class"
        data-testid="content-date"
      />
    )
    
    const element = screen.getByTestId('content-date')
    expect(element).toHaveClass('custom-class')
  })

  it('handles git info without creation date', () => {
    const contentWithoutCreatedDate: ContentItem = {
      ...mockContent,
      git: {
        ...mockGitInfo,
        createdDate: ''
      }
    }
    
    render(<ContentDate content={contentWithoutCreatedDate} />)
    
    expect(screen.getByText('Jan 10, 2024')).toBeInTheDocument()
  })

  it('handles invalid frontmatter date gracefully', () => {
    const contentWithInvalidDate: ContentItem = {
      ...mockContent,
      date: 'invalid-date',
      git: undefined
    }
    
    render(<ContentDate content={contentWithInvalidDate} />)
    
    // Should return the original string when date parsing fails
    expect(screen.getByText('invalid-date')).toBeInTheDocument()
  })
})