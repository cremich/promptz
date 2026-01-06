import { Suspense } from 'react'
import { Hero } from '@/components/hero'
import { CompactCard, CompactCardSkeleton } from '@/components/compact-card'
import { getLatestContent } from '@/lib/library'

// Loading skeleton for the content grid
function ContentGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <CompactCardSkeleton key={i} />
      ))}
    </div>
  )
}

// Server component to fetch and display latest content
async function LatestContentGrid() {
  const content = await getLatestContent(6)

  if (content.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">No content available yet.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {content.map((item) => (
        <CompactCard key={item.id} item={item} />
      ))}
    </div>
  )
}

export default function Home() {
  return (
    <>
      <Hero />

      {/* Latest Content Section */}
      <section className="container mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Latest Contributions
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Recently added resources from the community
            </p>
          </div>
        </div>

        <Suspense fallback={<ContentGridSkeleton />}>
          <LatestContentGrid />
        </Suspense>
      </section>
    </>
  )
}
