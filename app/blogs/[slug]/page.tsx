import { NextjsParams } from "@/app/types/blogs";
import parse, { DOMNode, Element, Text, domToReact } from "html-react-parser";
import { marked } from "marked";
import { useMemo } from "react";

import Mermaid from "../../components/Mermaid";
import Navbar from "../../components/Navbar";
import { calculateReadingTime, getBlogContent } from "../../utils/blogs";

const BlogContent = ({ content }: { content: string }) => {
  const options = {
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

  const renderedHTML = useMemo(async () => {
    const parsedContent = await marked.parse(content);
    return parse(parsedContent, options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  return <div className="prose mx-auto lg:prose-lg">{renderedHTML}</div>;
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
    <div className="card bg-base-200 shadow-xl p-8 mb-6 sticky top-24 h-fit w-[500px]">
      <h2 className="card-title text-2xl mb-4">{title}</h2>
      <div className="text-base-content/70 text-sm mb-4">
        <span className="font-medium">Published:</span>
        {new Date(date).toLocaleDateString()}
      </div>
      <div className="text-base-content/70 text-sm mb-4">
        <span className="font-medium">Reading Time:</span> {readingTime}
      </div>
      <div className="text-base-content/70 text-sm mb-4">
        <span className="font-medium">Author:</span> {author}
      </div>
      <div className="mb-4">
        <div>
          <span className="font-medium block mb-2">Tags:</span>
          <div className="flex flex-wrap gap-3">
            {tags.map((tag: string) => (
              <span key={tag} className="badge badge-ghost px-4 py-3">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const BlogParts = async (props: { slug: string }) => {
  const { slug } = props;
  try {
    const { frontmatter, content } = await getBlogContent(slug);

    return (
      <div className="mt-2 p-4 flex gap-8">
        <div className="flex-grow">
          <BlogContent content={content} />
        </div>
        <div className="hidden md:block">
          <BlogCard
            title={frontmatter.title}
            date={frontmatter.date}
            readingTime={calculateReadingTime(content)}
            tags={frontmatter.tags}
            author={frontmatter.author}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Blog generation failed due to", error);
    return <div>No blog found</div>;
  }
};

export default async function Page({ params }: NextjsParams) {
  const { slug } = await params;
  return (
    <div>
      <Navbar />
      <BlogParts slug={slug} />
    </div>
  );
}
