import type { MetadataRoute } from "next";

import { SITE_URL } from "./data/basic";
import { getBlogPosts } from "./utils/blogs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getBlogPosts();
  return [
    { url: SITE_URL, lastModified: new Date() },
    { url: `${SITE_URL}/blogs`, lastModified: new Date() },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blogs/${post.slug}`,
      lastModified: new Date(post.date),
    })),
  ];
}
