import { Suspense } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader, Emphasis } from '@/components/page-header'
import { Grid, GridSkeleton } from '@/components/grid'
import { getAllContent } from '@/lib/library'
import { getAllPrompts } from '@/lib/prompts'
import { getAllAgents } from '@/lib/agents'
import { getAllPowers } from '@/lib/powers'
import { getAllSteering } from '@/lib/steering'
import { getAllHooks } from '@/lib/hooks'

export const metadata: Metadata = {
  title: 'Browse Library | Promptz.dev',
  description:
    'Explore the complete collection of prompts, powers, agents, steering documents, and hooks for Kiro and Amazon Q Developer.',
  keywords: [
    'AI prompts',
    'Kiro powers',
    'custom agents',
    'steering documents',
    'agent hooks',
    'AI-assisted development',
  ],
  openGraph: {
    title: 'Browse Library | Promptz.dev',
    description:
      'Explore the complete collection of AI development resources for Kiro.',
    type: 'website',
  },
}

interface ContentStats {
  prompts: number
  agents: number
  powers: number
  steering: number
  hooks: number
  total: number
}

async function getContentStats(): Promise<ContentStats> {
  const [prompts, agents, powers, steering, hooks] = await Promise.all([
    getAllPrompts(),
    getAllAgents(),
    getAllPowers(),
    getAllSteering(),
    getAllHooks(),
  ])

  return {
    prompts: prompts.length,
    agents: agents.length,
    powers: powers.length,
    steering: steering.length,
    hooks: hooks.length,
    total:
      prompts.length +
      agents.length +
      powers.length +
      steering.length +
      hooks.length,
  }
}

const contentTypes = [
  { href: '/prompts', label: 'Prompts', key: 'prompts' as const },
  { href: '/agents', label: 'Agents', key: 'agents' as const },
  { href: '/powers', label: 'Powers', key: 'powers' as const },
  { href: '/steering', label: 'Steering', key: 'steering' as const },
  { href: '/hooks', label: 'Hooks', key: 'hooks' as const },
]

function LibraryLoading() {
  return <GridSkeleton count={12} />
}

async function LibraryContent() {
  const content = await getAllContent()
  return <Grid items={content} />
}

async function ContentTypeNav() {
  const stats = await getContentStats()

  return (
    <div className="flex flex-wrap gap-2">
      {contentTypes.map((type) => (
        <Link
          key={type.href}
          href={type.href}
          className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {type.label}
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
            {stats[type.key]}
          </span>
        </Link>
      ))}
    </div>
  )
}

function ContentTypeNavSkeleton() {
  return (
    <div className="flex flex-wrap gap-2">
      {contentTypes.map((type) => (
        <div
          key={type.href}
          className="inline-flex h-10 w-28 animate-pulse rounded-full bg-muted"
        />
      ))}
    </div>
  )
}

export default function LibraryPage() {
  return (
    <>
      <PageHeader
        title={<>Browse the <Emphasis>Community Library</Emphasis></>}
        description="Find battle-tested prompts, powers, agents, and steering documents shared by the Kiro community. Copy, customize, and ship faster."
        showLibraryLegend={true}
      >
        <Suspense fallback={<ContentTypeNavSkeleton />}>
          <ContentTypeNav />
        </Suspense>
      </PageHeader>

      <section className="container mx-auto max-w-7xl px-6 py-12">
        <Suspense fallback={<LibraryLoading />}>
          <LibraryContent />
        </Suspense>
      </section>
    </>
  )
}
