import { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PixelParticles } from '@/components/animations/pixel-particles'

interface DetailLayoutProps {
  backHref: string
  backLabel: string
  children: ReactNode
}

export function DetailLayout({
  backHref,
  backLabel,
  children,
}: DetailLayoutProps) {
  return (
    <section className="relative flex-1 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5]/5 via-transparent to-[#7C3AED]/5" />

      {/* Pixel particles effect */}
      <PixelParticles />

      {/* Content */}
      <div className="container relative mx-auto max-w-7xl px-6 py-8 md:py-12">
        {/* Back navigation */}
        <Button variant="ghost" size="sm" asChild className="mb-8 gap-2">
          <Link href={backHref}>
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
        </Button>

        {/* Main content */}
        <div>{children}</div>
      </div>
    </section>
  )
}

export function DetailSkeleton() {
  return (
    <section className="relative flex-1 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5]/5 via-transparent to-[#7C3AED]/5" />
      <PixelParticles />
      <div className="container relative mx-auto max-w-7xl px-6 py-8 md:py-12">
        <div className="mb-8 h-9 w-32 animate-pulse rounded bg-muted" />
        <div className="mx-auto max-w-4xl">
          <div className="animate-pulse space-y-8">
            <div className="flex gap-2">
              <div className="h-5 w-16 rounded-full bg-muted" />
              <div className="h-5 w-20 rounded-full bg-muted" />
            </div>
            <div className="h-10 w-3/4 rounded bg-muted" />
            <div className="h-6 w-full rounded bg-muted" />
            <div className="h-24 rounded bg-muted" />
            <div className="h-64 rounded bg-muted" />
          </div>
        </div>
      </div>
    </section>
  )
}
