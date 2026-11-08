import Link from "next/link";
import { PiArrowRightBold } from "react-icons/pi";

import PostRow from "@/components/PostRow";
import SectionHead from "@/components/SectionHead";
import { getBlogPosts } from "@/lib/blogs";

export default async function Writing() {
  const all = await getBlogPosts();
  const posts = all.slice(0, 5);

  return (
    <section id="writing" className="section" aria-labelledby="writing-heading">
      <div className="shell">
        <SectionHead
          index="03"
          label="Writing"
          id="writing-heading"
          title="Notes from building things."
        >
          Architecture decisions, SQL, cloud infrastructure, and the details
          that keep long-running systems honest.
        </SectionHead>
        <div className="posts">
          {posts.map((post) => (
            <PostRow key={post.slug} post={post} />
          ))}
        </div>
        <div className="links">
          <Link href="/blogs" className="text-link">
            All {all.length} posts <PiArrowRightBold aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
