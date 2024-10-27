import Navbar from "../components/Navbar";
import Title from "../components/Title";
import { getBlogPosts } from "../utils/blogs";

export default async function BlogsPage() {
  const posts = await getBlogPosts();

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Title title="Blogs" />
        <div className="space-y-6 mt-12">
          {posts.map((post) => (
            <article key={post.slug} className="border-b pb-6">
              <a href={`/blogs/${post.slug}`} className="group">
                <h2 className="text-2xl font-semibold group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <div className="mt-2 text-base-content/60 flex items-center space-x-4">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <span>•</span>
                  <span>{post.readingTime}</span>
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
