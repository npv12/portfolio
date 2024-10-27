import { NextjsParams } from "@/app/types/blogs";
import { marked } from "marked";

import Navbar from "../../components/Navbar";
import { calculateReadingTime, getBlogContent } from "../../utils/blogs";

const BlogContent = ({ content }: { content: string }) => {
  return (
    <div
      className="prose mx-auto lg:prose-lg"
      dangerouslySetInnerHTML={{ __html: marked.parse(content) }}
    />
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
    <div className="card bg-base-200 shadow-xl p-8 mb-6 sticky top-24 z-[-1] h-fit">
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
        <div className="flex items-center gap-3">
          <span className="font-medium">Tags:</span>
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
        <BlogCard
          title={frontmatter.title}
          date={frontmatter.date}
          readingTime={calculateReadingTime(content)}
          tags={frontmatter.tags}
          author={frontmatter.author}
        />
      </div>
    );
  } catch (error) {
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
