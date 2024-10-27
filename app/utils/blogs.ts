import fs from "fs";
import MarkdownIt from "markdown-it";
import path from "path";

import { BlogPost } from "../types/blogs";

export const calculateReadingTime = (text: string): string => {
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).length;
  const minutes = words / wordsPerMinute;
  const readTime = Math.ceil(minutes);
  return `${readTime} min read`;
};

export async function getBlogPosts(): Promise<BlogPost[]> {
  const md = new MarkdownIt();
  const postsDirectory = path.join(process.cwd(), "content/blogs");
  const filenames = fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".md"));

  const posts = filenames.map((filename) => {
    const fullPath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const tokens = md.parse(fileContents, {});
    let frontmatter: { title?: string; date?: string } = {};
    if (tokens[1]?.type === "heading_open") {
      try {
        frontmatter = JSON.parse(`{${tokens[2].content}}`);
      } catch (e) {
        // If JSON parsing fails, try YAML-style parsing
        frontmatter = tokens[2].content
          .split("\n")
          .reduce((acc: Record<string, string>, line: string) => {
            const [key, ...valueArr] = line.split(":");
            if (key && valueArr.length) {
              const value = valueArr
                .join(":")
                .trim()
                .replace(/^"(.*)"$/, "$1");
              acc[key.trim()] = value;
            }
            return acc;
          }, {});
      }
    }

    // Calculate reading time
    const readingTimeText = calculateReadingTime(fileContents);

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
