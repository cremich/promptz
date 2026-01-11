import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PageHeader, Emphasis } from '@/components/page-header'
import { Grid, GridSkeleton } from '@/components/grid'
import { Badge } from '@/components/ui/badge'
import { GitHubLink } from '@/components/github-link'
import { getLibraryById, getAllLibraries } from '@/lib/libraries'
import { getAllContent } from '@/lib/library'
import { Package, Users, ArrowLeft } from 'lucide-react'

interface LibraryDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  const libraries = await getAllLibraries()
  return libraries.map((library) => ({
    id: library.id,
  }))
}

export async function generateMetadata({ params }: LibraryDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const library = await getLibraryById(id)
  
  if (!library) {
    return {
      title: 'Library Not Found | Promptz.dev',
    }
  }

  return {
    title: `${library.displayName} Library | Promptz.dev`,
    description: library.description,
    keywords: [
      library.displayName,
      'AI library',
      'Kiro',
      'prompts',
      'agents',
      'powers',
      'steering',
      'hooks',
    ],
    openGraph: {
      title: `${library.displayName} Library | Promptz.dev`,
      description: library.description,
      type: 'website',
    },
  }
}

const categoryConfig = {
  official: {
    label: 'Official',
    className: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:text-indigo-400',
  },
  community: {
    label: 'Community',
    className: 'bg-violet-500/10 text-violet-600 border-violet-500/20 dark:text-violet-400',
  },
  individual: {
    label: 'Individual',
    className: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20 dark:text-cyan-400',
  },
}

function LibraryContentLoading() {
  return <GridSkeleton count={12} />
}

async function LibraryContent({ libraryId }: { libraryId: string }) {
  const allContent = await getAllContent()
  const libraryContent = allContent.filter(item => {
    const pathParts = item.path.split('/')
    const librariesIndex = pathParts.indexOf('libraries')
    if (librariesIndex !== -1 && librariesIndex + 1 < pathParts.length) {
      return pathParts[librariesIndex + 1] === libraryId
    }
    return false
  })

  if (libraryContent.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Content Found</h3>
        <p className="text-muted-foreground">
          This library doesn&apos;t contain any content yet.
        </p>
      </div>
    )
  }

  return <Grid items={libraryContent} />
}

export default async function LibraryDetailPage({ params }: LibraryDetailPageProps) {
  const { id } = await params
  
  return (
    <Suspense fallback={<div>Loading library...</div>}>
      <LibraryDetailContent id={id} />
    </Suspense>
  )
}

async function LibraryDetailContent({ id }: { id: string }) {
  const library = await getLibraryById(id)

  if (!library) {
    notFound()
  }

  const categoryInfo = categoryConfig[library.category]

  return (
    <>
      <PageHeader
        title={
          <>
            <div className="flex items-center gap-3 mb-2">
              <Link
                href="/library"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Libraries
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-muted-foreground" />
              <Emphasis>{library.displayName}</Emphasis>
            </div>
          </>
        }
        description={library.description}
        showLibraryLegend={true}
      >
        <div className="flex flex-wrap items-center gap-4">
          <Badge variant="outline" className={categoryInfo.className}>
            {categoryInfo.label}
          </Badge>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{library.owner}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">{library.contentStats.total}</span>
            <span className="text-muted-foreground">items</span>
          </div>
          
          <GitHubLink 
            url={library.repositoryUrl}
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          />
        </div>
      </PageHeader>

      <section className="container mx-auto max-w-7xl px-6 py-12">
        <Suspense fallback={<LibraryContentLoading />}>
          <LibraryContent libraryId={library.id} />
        </Suspense>
      </section>
    </>
  )
}