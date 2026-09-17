import { MetadataRoute } from 'next';
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://devroad-wheat.vercel.app';

  // Static routes
  const staticRoutes = [
    '',
    '/about',
    '/pricing',
    '/features',
    '/discover',
    '/blog',
    '/community',
    '/login',
    '/signup'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Fetch dynamic products
  const products = await prisma.product.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true, updatedAt: true },
  });

  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  // Fetch dynamic creators
  const creators = await prisma.user.findMany({
    where: { products: { some: { status: 'PUBLISHED' } } },
    select: { username: true, updatedAt: true },
  });

  const creatorRoutes = creators
    .filter(creator => creator.username)
    .map((creator) => ({
      url: `${baseUrl}/creator/${creator.username}`,
      lastModified: creator.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

  return [...staticRoutes, ...productRoutes, ...creatorRoutes];
}
