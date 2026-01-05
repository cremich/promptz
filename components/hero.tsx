import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PixelParticles } from '@/components/animations/pixel-particles'

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/40">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5]/5 via-transparent to-[#7C3AED]/5" />
      
      {/* Pixel particles effect */}
      <PixelParticles />

      {/* Content */}
      <div className="container relative mx-auto max-w-7xl px-6 py-24 md:py-32 lg:py-40">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-3 py-1 text-sm backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-[#4F46E5] animate-pulse" />
            <span className="text-muted-foreground">
              The community library for Kiro
            </span>
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-gradient">Unlock</span> the full
            <br />
            power of Kiro
          </h1>

          {/* Description */}
          <p className="mb-8 max-w-xl text-lg text-muted-foreground">
            Discover and share prompts, powers, agents, and steering documents
            to get the most out of your Kiro development experience.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <Button
              asChild
              size="lg"
              className="h-11 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] px-6 text-white hover:opacity-90"
            >
              <a
                href="https://github.com/cremich/promptz.lib/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contribute
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-11 px-6">
              <Link href="/library">Browse Library</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
