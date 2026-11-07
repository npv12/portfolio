import type { Metadata } from "next";

import Navbar from "../components/Navbar";
import PostRow from "../components/PostRow";
import GetInTouch from "../parts/getInTouch";
import { BlogPost } from "../types/blogs";
import { getBlogPosts } from "../utils/blogs";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Notes on backend engineering: SQL, distributed systems, cloud infrastructure, and agent runtimes.",
};

const groupByYear = (posts: BlogPost[]) => {
  const groups = new Map<number, BlogPost[]>();
  for (const post of posts) {
    const year = new Date(post.date).getUTCFullYear();
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
    <>
      <Navbar />
      <main id="main" className="shell">
        <header className="page-head">
          <p className="section__index mono">
            <b>Writing</b> {posts.length} posts
          </p>
          <h1 className="page-head__title">Notes from the backend.</h1>
          <p className="page-head__lede">
            Architecture decisions, SQL, cloud infrastructure, and the details
            that make long-running systems work.
          </p>
        </header>
        <div>
          {byYear.map(([year, yearPosts]) => (
            <section
              key={year}
              className="year-group"
              aria-labelledby={`year-${year}`}
            >
              <h2 id={`year-${year}`} className="year-group__label mono">
                {year} · {yearPosts.length}
              </h2>
              <div className="posts">
                {yearPosts.map((post) => (
                  <PostRow key={post.slug} post={post} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
      <GetInTouch />
    </>
  );
}
