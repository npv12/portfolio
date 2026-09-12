import Link from "next/link";

import Navbar from "../components/Navbar";
import Title from "../components/Title";
import { BlogPost } from "../types/blogs";
import { getBlogPosts } from "../utils/blogs";

const groupByYear = (posts: BlogPost[]) => {
  const groups = new Map<number, BlogPost[]>();
  for (const post of posts) {
    const year = new Date(post.date).getFullYear();
    const list = groups.get(year) ?? [];
    list.push(post);
    groups.set(year, list);
  }
  return [...groups.entries()].sort((a, b) => b[0] - a[0]);
};

export default async function BlogsPage() {
  const posts = await getBlogPosts();
  const byYear = groupByYear(posts);

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Title title="Blogs" />
        <div className="mt-12 space-y-12">
          {byYear.map(([year, yearPosts]) => (
            <section key={year}>
              <h2 className="text-sm font-semibold tracking-wide text-base-content/50 mb-4">
                {year}
              </h2>
              <div className="space-y-4">
                {yearPosts.map((post) => (
                  <article
                    key={post.slug}
                    className="bg-base-200 rounded-lg p-6 hover:bg-base-300 transition-colors"
                  >
                    <Link href={`/blogs/${post.slug}`} className="group block">
                      <h3 className="text-2xl font-semibold group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      {post.description && (
                        <p className="mt-2 text-base-content/80">
                          {post.description}
                        </p>
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
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
