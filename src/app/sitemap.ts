import { createClient } from '@/utils/connect'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient()
  const baseUrl  = 'https://rika-negari.com'

  const { data: tipes } = await supabase
    .from('tipe_rumah')
    .select('slug, updated_at, perumahan(slug)')

  const tipeUrls = (tipes ?? []).map((t: any) => ({
    url         : `${baseUrl}/properti/${t.perumahan.slug}/${t.slug}`,
    lastModified: new Date(t.updated_at),
    changeFrequency: 'weekly' as const,
    priority    : 0.8,
  }))

  return [
    {
      url             : baseUrl,
      lastModified    : new Date(),
      changeFrequency : 'daily',
      priority        : 1,
    },
    {
      url             : `${baseUrl}/properti`,
      lastModified    : new Date(),
      changeFrequency : 'daily',
      priority        : 0.9,
    },
    ...tipeUrls,
  ]
}