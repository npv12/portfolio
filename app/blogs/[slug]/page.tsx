import { NextjsParams } from "@/app/types/blogs";
import parse, { DOMNode, Element, Text, domToReact } from "html-react-parser";
import { marked } from "marked";
import { notFound } from "next/navigation";

import Mermaid from "../../components/Mermaid";
import Navbar from "../../components/Navbar";
import { calculateReadingTime, getBlogContent, getBlogPosts } from "../../utils/blogs";

const parseOptions = {
  replace: (domNode: DOMNode) => {
    if (domNode instanceof Element && domNode.tagName === "pre") {
      const codeElement = domNode.children[0] as Element;
      if (
        codeElement &&
        codeElement.tagName === "code" &&
        codeElement.attribs.class === "language-mermaid"
      ) {
        const code = codeElement.children[0];
        if (code instanceof Text && code.data)
          return <Mermaid graph={code.data} />;
      }
    }
    if (domNode instanceof Element) return domToReact([domNode]);
    return null;
  },
};

const BlogContent = async ({ content }: { content: string }) => {
  const parsedContent = await marked.parse(content);
  return (
    <div className="prose mx-auto lg:prose-lg max-w-none">
      {parse(parsedContent, parseOptions)}
    </div>
  );
};

const BlogCard = ({
  title,
  date,
  readingTime,
  tags,
  author,
}: {
  title: string;
  date: string;
  readingTime: string;
  tags: string[];
  author: string;
}) => {
  return (
    <aside className="card bg-base-200 shadow-xl p-6 sticky top-24 h-fit w-72">
      <h2 className="card-title text-lg mb-4">{title}</h2>
      <div className="text-base-content/70 text-sm space-y-2">
        <p>
          <span className="font-medium">Published </span>
          {new Date(date).toLocaleDateString()}
        </p>
        <p>
          <span className="font-medium">Reading time </span>
          {readingTime}
        </p>
        <p>
          <span className="font-medium">Author </span>
          {author}
        </p>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {tags.map((tag: string) => (
            <span key={tag} className="badge badge-ghost">
              {tag}
            </span>
          ))}
        </div>
      )}
    </aside>
  );
};

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function Page({ params }: NextjsParams) {
  const { slug } = await params;
  let frontmatter;
  let content;
  try {
    ({ frontmatter, content } = await getBlogContent(slug));
  } catch {
    notFound();
  }

  return (
    <div>
      <Navbar />
      <div className="mt-2 p-4 md:p-8 flex gap-8 max-w-6xl mx-auto">
        <div className="grow min-w-0">
          <BlogContent content={content} />
        </div>
        <div className="hidden lg:block shrink-0">
          <BlogCard
            title={frontmatter.title}
            date={frontmatter.date}
            readingTime={calculateReadingTime(content)}
            tags={frontmatter.tags}
            author={frontmatter.author}
          />
        </div>
      </div>
    </div>
  );
}
