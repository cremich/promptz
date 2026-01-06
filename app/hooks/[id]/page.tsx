import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ContentHeader } from '@/components/content-header'
import { ContributorInfo } from '@/components/contributor-info'
import { HookTriggerBadge } from '@/components/hook-trigger-badge'
import { DetailLayout, DetailSkeleton } from '@/components/detail-layout'
import { getHookById, getAllHooks } from '@/lib/hooks'
import { getLibraryName } from '@/lib/library'
import { idToSlug, slugToId, isValidSlug } from '@/lib/formatter/slug'
import { getDisplayAuthor } from '@/lib/formatter/content'
import type { Hook } from '@/lib/types/content'

interface HookDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  try {
    const hooks = await getAllHooks()
    return hooks.map((hook) => ({
      id: idToSlug(hook.id),
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export async function generateMetadata({
  params,
}: HookDetailPageProps): Promise<Metadata> {
  const { id: slug } = await params

  if (!isValidSlug(slug)) {
    return {
      title: 'Invalid Agent Hook URL | Promptz.dev',
      description: 'The requested agent hook URL is not valid.',
    }
  }

  const id = slugToId(slug)
  const hook = await getHookById(id)

  if (!hook) {
    return {
      title: 'Agent Hook Not Found | Promptz.dev',
      description: 'The requested agent hook could not be found.',
    }
  }

  return generateHookMetadata(hook)
}

function generateHookMetadata(hook: Hook): Metadata {
  const libraryName = getLibraryName(hook.path)
  const author = getDisplayAuthor(hook)

  return {
    title: `${hook.title} | Promptz.dev`,
    description: `Agent hook by ${author} from ${libraryName} library. ${hook.description || hook.content.slice(0, 150)}...`,
    keywords: [
      'agent hook',
      'IDE automation',
      'Kiro hook',
      'development automation',
      hook.trigger || 'automation',
      libraryName,
      author,
      'Kiro',
      'Amazon Q Developer',
    ],
    authors: [{ name: author }],
    openGraph: {
      title: `${hook.title} | Promptz.dev`,
      description: `Agent hook by ${author} from ${libraryName} library. ${hook.description || 'IDE automation tool for enhanced development workflow.'}`,
      type: 'article',
      authors: [author],
      publishedTime: hook.git?.createdDate || hook.date,
      modifiedTime: hook.git?.lastModifiedDate,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${hook.title} | Promptz.dev`,
      description: `Agent hook by ${author} from ${libraryName} library.`,
    },
  }
}

async function HookDetail({ slug }: { slug: string }) {
  if (!isValidSlug(slug)) {
    notFound()
  }

  const id = slugToId(slug)
  const hook = await getHookById(id)

  if (!hook) {
    notFound()
  }

  return (
    <DetailLayout backHref="/hooks" backLabel="Back to Hooks">
      {/* Header */}
      <ContentHeader content={hook} />

      {/* Trigger Badge */}
      <div className="mb-6">
        <HookTriggerBadge trigger={hook.trigger} />
      </div>

      {/* Contributor Information */}
      <ContributorInfo content={hook} />

      {/* Hook Content */}
      <Card className="border-border/40 bg-card/50">
        <CardHeader>
          <CardTitle className="text-xl">Hook Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap overflow-x-auto rounded-lg border border-border/40 bg-muted/50 p-4 text-sm font-mono">
            {hook.content}
          </pre>
        </CardContent>
      </Card>
    </DetailLayout>
  )
}

export default async function HookDetailPage({ params }: HookDetailPageProps) {
  const { id: slug } = await params

  return (
    <Suspense fallback={<DetailSkeleton />}>
      <HookDetail slug={slug} />
    </Suspense>
  )
}
