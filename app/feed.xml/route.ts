import { NAME, SITE_URL } from "../data/basic";
import { getBlogPosts } from "../utils/blogs";

export const dynamic = "force-static";

const escape = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export async function GET() {
  const posts = await getBlogPosts();
  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blogs/${post.slug}`;
      return `    <item>
      <title>${escape(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escape(post.description)}</description>
${post.tags.map((tag) => `      <category>${escape(tag)}</category>`).join("\n")}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(NAME)}: Writing</title>
    <link>${SITE_URL}/blogs</link>
    <description>Notes on backend engineering: SQL, distributed systems, cloud infrastructure, and agent runtimes.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${posts[0] ? `    <lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>\n` : ""}${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
