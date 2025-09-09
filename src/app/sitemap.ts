import { MetadataRoute } from 'next';
// Pas deze helpers aan naar jouw datastructuur:
import { projects } from '@/data/projects';
import { newsPosts } from '@/data/news';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.postavermaas.nl';

  const staticRoutes = [
    '', '/projects', '/people', '/services', '/facilities', '/news', '/about-us',
    '/contact', '/dutch-cash-rebate', '/source-connect'
  ].map((p) => ({
    url: `${base}${p}`,
    changeFrequency: 'weekly' as const,
    priority: 0.7 as const
  }));

  const projectPages = projects.map((p) => ({
    url: `${base}/projects/${p.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.6 as const
  }));

  const newsPages = newsPosts.map((n) => ({
    url: `${base}/news/${n.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.5 as const
  }));

  return [...staticRoutes, ...projectPages, ...newsPages];
}
