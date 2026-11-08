import Link from "next/link";

import { BlogPost } from "@/types/blogs";

export const formatDate = (date: string, month: "short" | "long" = "short") =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month,
    day: "numeric",
    timeZone: "UTC",
  });

export default function PostRow({
  post,
  showDate = true,
}: {
  post: BlogPost;
  showDate?: boolean;
}) {
  return (
    <Link href={`/blogs/${post.slug}`} className="post-row">
      {showDate && (
        <time className="post-row__date mono" dateTime={post.date}>
          {formatDate(post.date)}
        </time>
      )}
      <span>
        <span className="post-row__title">{post.title}</span>
        {post.description && (
          <span className="post-row__desc">{post.description}</span>
        )}
      </span>
      <span className="post-row__time mono">{post.readingTime}</span>
    </Link>
  );
}
