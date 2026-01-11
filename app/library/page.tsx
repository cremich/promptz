import { Suspense } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader, Emphasis } from '@/components/page-header'
import { LibraryCard } from '@/components/library-card'
import { getAllLibraries } from '@/lib/libraries'
import { Package, Users, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Libraries | Promptz.dev',
  description:
    'Discover AI development libraries with prompts, powers, agents, steering documents, and hooks for Kiro and Amazon Q Developer.',
  keywords: [
    'AI libraries',
    'Kiro powers',
    'prompt libraries',
    'AI development resources',
    'community libraries',
    'git submodules',
  ],
  openGraph: {
    title: 'Libraries | Promptz.dev',
    description:
      'Discover AI development libraries for Kiro and Amazon Q Developer.',
    type: 'website',
  },
}

interface LibraryStats {
  totalLibraries: number
  totalContent: number
  categories: {
    official: number
    community: number
    individual: number
  }
}

async function getLibraryStats(): Promise<LibraryStats> {
  const libraries = await getAllLibraries()
  
  const stats: LibraryStats = {
    totalLibraries: libraries.length,
    totalContent: 0,
    categories: {
      official: 0,
      community: 0,
      individual: 0
    }
  }
  
  for (const library of libraries) {
    stats.totalContent += library.contentStats.total
    stats.categories[library.category]++
  }
  
  return stats
}

const quickLinks = [
  { href: '/prompts', label: 'Browse Prompts', icon: FileText },
  { href: '/agents', label: 'Browse Agents', icon: Users },
  { href: '/powers', label: 'Browse Powers', icon: Package },
]

function LibrariesLoading() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-64 animate-pulse rounded-lg bg-muted" />
      ))}
    </div>
  )
}

async function LibrariesGrid() {
  const libraries = await getAllLibraries()
  
  if (libraries.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Libraries Found</h3>
        <p className="text-muted-foreground">
          No libraries are currently available. Check back later.
        </p>
      </div>
    )
  }
  
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {libraries.map((library) => (
        <LibraryCard key={library.id} library={library} />
      ))}
    </div>
  )
}

async function LibraryStatsBar() {
  const stats = await getLibraryStats()
  
  return (
    <div className="flex flex-wrap gap-4 items-center justify-between">
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2 text-sm">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{stats.totalLibraries}</span>
          <span className="text-muted-foreground">Libraries</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{stats.totalContent}</span>
          <span className="text-muted-foreground">Total Items</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {quickLinks.map((link) => {
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Icon className="h-3.5 w-3.5" />
              {link.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function LibraryStatsBarSkeleton() {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-between">
      <div className="flex flex-wrap gap-4">
        <div className="h-5 w-24 animate-pulse rounded bg-muted" />
        <div className="h-5 w-28 animate-pulse rounded bg-muted" />
      </div>
      <div className="flex flex-wrap gap-2">
        {quickLinks.map((link) => (
          <div key={link.href} className="h-8 w-32 animate-pulse rounded-full bg-muted" />
        ))}
      </div>
    </div>
  )
}

export default function LibraryPage() {
  return (
    <>
      <PageHeader
        title={<>Discover AI Development <Emphasis>Libraries</Emphasis></>}
        description="Explore curated libraries of prompts, powers, agents, and steering documents from the Kiro community. Each library is maintained as an independent repository with its own focus and expertise."
        showLibraryLegend={false}
      >
        <Suspense fallback={<LibraryStatsBarSkeleton />}>
          <LibraryStatsBar />
        </Suspense>
      </PageHeader>

      <section className="container mx-auto max-w-7xl px-6 py-12">
        <Suspense fallback={<LibrariesLoading />}>
          <LibrariesGrid />
        </Suspense>
      </section>
    </>
  )
}
