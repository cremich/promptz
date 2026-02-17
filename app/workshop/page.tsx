import { Metadata } from 'next'
import { WorkshopPage } from '@/components/workshop-page'

export const metadata: Metadata = {
  title: 'Prompt Engineering Workshop | Promptz.dev',
  description:
    'Interactive workshop to learn and practice 15 prompt engineering techniques. Browse the taxonomy reference, identify techniques in realistic scenarios, and improve your prompting skills.',
  keywords: [
    'prompt engineering',
    'workshop',
    'AI prompts',
    'hallucination mitigation',
    'prompt techniques',
    'Kiro',
  ],
  openGraph: {
    title: 'Prompt Engineering Workshop | Promptz.dev',
    description:
      'Interactive workshop to learn and practice 15 prompt engineering techniques with hands-on exercises.',
    type: 'website',
  },
}

export default function Workshop() {
  return <WorkshopPage />
}
