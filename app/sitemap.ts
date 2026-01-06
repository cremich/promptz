import type { MetadataRoute } from 'next'
import { getAllContent } from '@/lib/library'
import { idToSlug } from '@/lib/formatter/slug'
import type { ContentItem } from '@/lib/types/content'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://promptz.dev'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Get all content items
    const allContent = await getAllContent()

    // Static routes
    const staticRoutes: MetadataRoute.Sitemap = [
      {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${BASE_URL}/library`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${BASE_URL}/prompts`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: `${BASE_URL}/agents`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: `${BASE_URL}/powers`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: `${BASE_URL}/steering`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: `${BASE_URL}/hooks`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
    ]

    // Dynamic content routes
    const contentRoutes: MetadataRoute.Sitemap = allContent.map((item: ContentItem) => {
      // Safely parse the date with fallback to current date
      let lastModified: Date
      
      try {
        const dateString = item.git?.lastModifiedDate || item.date
        const parsedDate = new Date(dateString)
        
        // Check if the date is valid
        if (isNaN(parsedDate.getTime())) {
          lastModified = new Date() // Fallback to current date
        } else {
          lastModified = parsedDate
        }
      } catch {
        lastModified = new Date() // Fallback to current date
      }

      return {
        url: `${BASE_URL}/${item.type}s/${idToSlug(item.id)}`,
        lastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }
    })

    return [...staticRoutes, ...contentRoutes]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    
    // Return static routes only if content fetching fails
    return [
      {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${BASE_URL}/library`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${BASE_URL}/prompts`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: `${BASE_URL}/agents`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: `${BASE_URL}/powers`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: `${BASE_URL}/steering`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: `${BASE_URL}/hooks`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
    ]
  }
}