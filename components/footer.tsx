'use client'

import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const footerLinks = {
  resources: [
    { href: '/library', label: 'Browse Library' },
    { href: '/prompts', label: 'Prompts' },
    { href: '/agents', label: 'Agents' },
    { href: '/powers', label: 'Powers' },
    { href: '/steering', label: 'Steering' },
    { href: '/hooks', label: 'Hooks' },
  ],
  community: [
    { href: '/contribute', label: 'Contribute' },
    { href: '/faq', label: 'FAQ' },
    { href: 'https://github.com/cremich/promptz', label: 'GitHub', external: true },
    { href: 'https://github.com/cremich/promptz/issues', label: 'Issues', external: true },
    { href: 'https://github.com/cremich/promptz/discussions', label: 'Discussions', external: true },
  ],
  tools: [
    { href: 'https://kiro.dev', label: 'Kiro', external: true },
    { href: 'https://aws.amazon.com/q/developer/', label: 'Amazon Q Developer', external: true },
  ],
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

/**
 * Render the site footer containing brand, link sections, and a bottom bar with copyright and credits.
 *
 * @param className - Optional additional CSS classes to apply to the footer root element
 * @returns The footer React element with brand, Resources, Community, Tools sections, and the bottom copyright/credits bar
 */
export function Footer({ className }: { className?: string }) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={cn('border-t border-border/40 bg-card/30', className)}>
      <div className="container mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <Image
                src="/promptz_logo.png"
                alt="Promptz"
                width={24}
                height={24}
                className="rounded"
              />
              <span className="text-lg font-semibold">promptz</span>
            </Link>
            <p className="mb-4 text-sm text-muted-foreground">
              The community library for Kiro developers. Discover and share
              prompts, powers, agents, and more.
            </p>
            <a
              href="https://github.com/cremich/promptz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              aria-label="View on GitHub"
            >
              <GitHubIcon className="h-4 w-4" />
              <span>Star on GitHub</span>
            </a>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Community</h3>
            <ul className="space-y-2">
              {footerLinks.community.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Tools</h3>
            <ul className="space-y-2">
              {footerLinks.tools.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:flex-row md:gap-4">
            <p className="text-xs text-muted-foreground">
              © {currentYear} Promptz. Open source under MIT License.
            </p>
            <Link 
              href="/privacy" 
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy Policy
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            Made with Kiro for{' '}
            <a
              href="https://kiro.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gradient font-medium hover:underline"
            >
              Kiro
            </a>{' '}
            developers
          </p>
        </div>
      </div>
    </footer>
  )
}