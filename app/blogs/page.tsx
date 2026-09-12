import Link from "next/link";

import Navbar from "../components/Navbar";
import Title from "../components/Title";
import { getBlogPosts } from "../utils/blogs";

export default async function BlogsPage() {
  const posts = await getBlogPosts();

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Title title="Blogs" />
        <div className="space-y-4 mt-12">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="bg-base-200 rounded-lg p-6 hover:bg-base-300 transition-colors"
            >
              <Link href={`/blogs/${post.slug}`} className="group block">
                <h2 className="text-2xl font-semibold group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                {post.description && (
                  <p className="mt-2 text-base-content/80">{post.description}</p>
                )}
                <div className="mt-3 text-base-content/60 flex items-center gap-3 text-sm">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <span aria-hidden="true">·</span>
                  <span>{post.readingTime}</span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
