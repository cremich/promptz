import { render, screen } from '@testing-library/react'
import { GitHash } from '@/components/git-hash'
import type { GitInfo } from '@/lib/types/content'

// Mock the git utility functions
jest.mock('@/lib/formatter/git', () => ({
  getShortHash: jest.fn((hash: string) => hash.substring(0, 7))
}))

describe('GitHash', () => {
  const mockGitInfo: GitInfo = {
    author: 'Test Author',
    authorEmail: 'test@example.com',
    createdDate: '2024-01-01T10:00:00Z',
    lastModifiedDate: '2024-01-01T10:00:00Z',
    commitHash: 'abc123def456',
    commitMessage: 'Test commit'
  }

  it('should render git hash when git info is provided', () => {
    render(<GitHash git={mockGitInfo} />)

    expect(screen.getByText('abc123d')).toBeInTheDocument()
  })

  it('should apply custom className when provided', () => {
    render(<GitHash git={mockGitInfo} className="custom-class" />)

    const hashElement = screen.getByText('abc123d')
    expect(hashElement).toHaveClass('custom-class')
  })

  it('should return null when git info is not provided', () => {
    const { container } = render(<GitHash />)

    expect(container.firstChild).toBeNull()
  })

  it('should return null when git info has no commit hash', () => {
    const gitInfoWithoutHash = {
      ...mockGitInfo,
      commitHash: undefined
    }

    //@ts-expect-error: explicit for test
    const { container } = render(<GitHash git={gitInfoWithoutHash} />)

    expect(container.firstChild).toBeNull()
  })

  it('should return null when commit hash is empty string', () => {
    const gitInfoWithEmptyHash = {
      ...mockGitInfo,
      commitHash: ''
    }

    const { container } = render(<GitHash git={gitInfoWithEmptyHash} />)

    expect(container.firstChild).toBeNull()
  })
})