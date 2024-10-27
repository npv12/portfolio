import fs from "fs";
import matter from "gray-matter";
import path from "path";

import { BlogPost, FrontMatter } from "../types/blogs";

export const calculateReadingTime = (text: string): string => {
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).length;
  const minutes = words / wordsPerMinute;
  const readTime = Math.ceil(minutes);
  return `${readTime} min read`;
};

export async function getBlogPosts(): Promise<BlogPost[]> {
  const postsDirectory = path.join(process.cwd(), "public/blogs");
  const filenames = fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".md"));

  const posts = filenames.map((filename) => {
    const fullPath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const { data, content } = matter(fileContents);

    const readingTimeText = calculateReadingTime(content);

    return {
      title: data.title || filename.replace(".md", ""),
      date: data.date || new Date().toISOString(),
      slug: filename.replace(".md", ""),
      readingTime: readingTimeText,
    };
  });

  return posts.sort(
    (a: BlogPost, b: BlogPost) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getBlogContent(
  slug: string
): Promise<{ content: string; frontmatter: FrontMatter }> {
  const fullPath = path.join(process.cwd(), "public/blogs", `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const { data, content } = matter(fileContents);

  return {
    content,
    frontmatter: {
      title: data.title || "",
      author: data.author || "",
      tags: data.tags || [],
      date: data.date || new Date().toISOString(),
    },
  };
}
