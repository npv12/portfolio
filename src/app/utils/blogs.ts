import fs from "fs";
import path from "path";

import { BlogPost } from "../types/blogs";

export async function getBlogPosts(): Promise<BlogPost[]> {
  const postsDirectory = path.join(process.cwd(), "content/blogs");
  const filenames = fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".md"));

  const posts = filenames.map((filename) => {
    const fullPath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Extract frontmatter from markdown content
    const frontmatterMatch = fileContents.match(/^---\n([\s\S]*?)\n---/);
    const frontmatter = frontmatterMatch
      ? frontmatterMatch[1].split("\n").reduce((acc: any, line) => {
          const [key, value] = line.split(": ");
          if (key && value) acc[key.trim()] = value.trim();
          return acc;
        }, {})
      : {};

    const wordCount = fileContents.trim().split(/\s+/).length;
    const wordsPerMinute = 200;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    const readingTimeText =
      minutes === 1 ? "1 min read" : `${minutes} min read`;

    return {
      title: frontmatter.title || filename.replace(".md", ""),
      date: frontmatter.date || new Date().toISOString(),
      slug: filename.replace(".md", ""),
      readingTime: readingTimeText,
    };
  });
  return posts.sort(
    (a: BlogPost, b: BlogPost) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
