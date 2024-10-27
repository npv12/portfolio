import fs from "fs";
import path from "path";
import matter from 'gray-matter';

import { BlogPost } from "../types/blogs";

export const calculateReadingTime = (text: string): string => {
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).length;
  const minutes = words / wordsPerMinute;
  const readTime = Math.ceil(minutes);
  return `${readTime} min read`;
};

export async function getBlogPosts(): Promise<BlogPost[]> {
  const postsDirectory = path.join(process.cwd(), "content/blogs");
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