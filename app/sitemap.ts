import type { MetadataRoute } from "next";

import { SITE_URL } from "./data/basic";
import { getBlogPosts } from "./utils/blogs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getBlogPosts();
  const latest = posts[0] ? new Date(posts[0].date) : undefined;
  return [
    { url: SITE_URL, lastModified: latest, changeFrequency: "monthly", priority: 1 },
    {
      url: `${SITE_URL}/blogs`,
      lastModified: latest,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blogs/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
