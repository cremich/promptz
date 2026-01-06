import { render, screen } from '@testing-library/react'
import { Footer } from '@/components/footer'

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
})

// Mock next/image
jest.mock('next/image', () => {
  return function MockImage({ alt, ...props }: { alt: string; [key: string]: unknown }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} {...props} />
  }
})

describe('Footer', () => {
  it('renders brand section with logo and description', () => {
    render(<Footer />)
    
    expect(screen.getByText('promptz')).toBeInTheDocument()
    expect(screen.getByAltText('Promptz')).toBeInTheDocument()
    expect(screen.getByText(/The community library for Kiro developers/i)).toBeInTheDocument()
  })

  it('renders GitHub link', () => {
    render(<Footer />)
    
    const githubLink = screen.getByLabelText('View on GitHub')
    expect(githubLink).toHaveAttribute('href', 'https://github.com/cremich/promptz')
    expect(githubLink).toHaveAttribute('target', '_blank')
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders Resources section with all links', () => {
    render(<Footer />)
    
    expect(screen.getByText('Resources')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Browse Library' })).toHaveAttribute('href', '/library')
    expect(screen.getByRole('link', { name: 'Prompts' })).toHaveAttribute('href', '/prompts')
    expect(screen.getByRole('link', { name: 'Agents' })).toHaveAttribute('href', '/agents')
    expect(screen.getByRole('link', { name: 'Powers' })).toHaveAttribute('href', '/powers')
    expect(screen.getByRole('link', { name: 'Steering' })).toHaveAttribute('href', '/steering')
    expect(screen.getByRole('link', { name: 'Hooks' })).toHaveAttribute('href', '/hooks')
  })

  it('renders Community section with external links', () => {
    render(<Footer />)
    
    expect(screen.getByText('Community')).toBeInTheDocument()
    
    const githubRepoLink = screen.getByRole('link', { name: 'GitHub' })
    expect(githubRepoLink).toHaveAttribute('href', 'https://github.com/cremich/promptz')
    expect(githubRepoLink).toHaveAttribute('target', '_blank')
    
    const issuesLink = screen.getByRole('link', { name: 'Issues' })
    expect(issuesLink).toHaveAttribute('href', 'https://github.com/cremich/promptz/issues')
    
    const discussionsLink = screen.getByRole('link', { name: 'Discussions' })
    expect(discussionsLink).toHaveAttribute('href', 'https://github.com/cremich/promptz/discussions')
  })

  it('renders Tools section with external links', () => {
    render(<Footer />)
    
    expect(screen.getByText('Tools')).toBeInTheDocument()
    
    // Get all Kiro links and check the one in Tools section
    const kiroLinks = screen.getAllByRole('link', { name: 'Kiro' })
    expect(kiroLinks[0]).toHaveAttribute('href', 'https://kiro.dev')
    expect(kiroLinks[0]).toHaveAttribute('target', '_blank')
    
    const amazonQLink = screen.getByRole('link', { name: 'Amazon Q Developer' })
    expect(amazonQLink).toHaveAttribute('href', 'https://aws.amazon.com/q/developer/')
  })

  it('renders copyright with current year', () => {
    render(<Footer />)
    
    const currentYear = new Date().getFullYear()
    expect(screen.getByText(new RegExp(`© ${currentYear} Promptz`))).toBeInTheDocument()
  })

  it('renders "Made with love" message with Kiro link', () => {
    render(<Footer />)
    
    expect(screen.getByText(/Made with/)).toBeInTheDocument()
    const kiroFooterLink = screen.getAllByRole('link', { name: 'Kiro' })[1]
    expect(kiroFooterLink).toHaveAttribute('href', 'https://kiro.dev')
  })

  it('applies custom className', () => {
    const { container } = render(<Footer className="custom-footer" />)
    
    const footer = container.querySelector('footer')
    expect(footer).toHaveClass('custom-footer')
  })
})
