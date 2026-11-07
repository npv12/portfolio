import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "../../utils/og";
import { getBlogContent, getBlogPosts } from "../../utils/blogs";

export const alt = "Blog post";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { frontmatter } = await getBlogContent(slug);
  return renderOgCard({
    kicker: frontmatter.tags.slice(0, 3).join(" / ") || "Writing",
    title: frontmatter.title,
    subtitle: frontmatter.description,
  });
}
