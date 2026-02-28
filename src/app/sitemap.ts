import { MetadataRoute } from 'next';

const BASE = 'https://framextractor.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: BASE,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: `${BASE}/howto`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${BASE}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
    ];
}
