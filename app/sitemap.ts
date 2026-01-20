import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/united-states`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/browse/states`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/browse/practice-areas`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/browse/metros`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Fetch all states
  const states = await prisma.state.findMany({
    select: { slug: true },
  })

  const statePages: MetadataRoute.Sitemap = states.map((state) => ({
    url: `${baseUrl}/united-states/${state.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Fetch all metros
  const metros = await prisma.metro.findMany({
    include: { state: { select: { slug: true } } },
  })

  const metroPages: MetadataRoute.Sitemap = metros.map((metro) => ({
    url: `${baseUrl}/united-states/${metro.state.slug}/${metro.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // Fetch all practice areas
  const practiceAreas = await prisma.practiceArea.findMany({
    select: { slug: true },
  })

  const practiceAreaPages: MetadataRoute.Sitemap = practiceAreas.map((pa) => ({
    url: `${baseUrl}/united-states/practice-areas/${pa.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Fetch all firms
  const firms = await prisma.firm.findMany({
    select: { slug: true },
  })

  const firmPages: MetadataRoute.Sitemap = firms.flatMap((firm) => [
    {
      url: `${baseUrl}/firms/${firm.slug}/overview`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/firms/${firm.slug}/lawyers`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/firms/${firm.slug}/comments`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/firms/${firm.slug}/offices`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ])

  return [
    ...staticPages,
    ...statePages,
    ...metroPages,
    ...practiceAreaPages,
    ...firmPages,
  ]
}
