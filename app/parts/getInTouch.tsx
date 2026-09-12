import Link from "next/link";
import {
  PiEnvelopeDuotone,
  PiLinkedinLogoDuotone,
  PiTwitterLogoDuotone,
} from "react-icons/pi";

import Title from "../components/Title";
import { EMAIL, LINKEDIN, TWITTER } from "../data/basic";
import { getBlogPosts } from "../utils/blogs";

const GetInTouch = async () => {
  const posts = (await getBlogPosts()).slice(0, 3);

  return (
    <div className="gap-8 py-16" id="contact">
      <Title title="Writing and contact" />
      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <div className="w-full md:w-1/2">
          <div className="bg-base-200 rounded-lg p-6 h-full">
            <h2 className="text-2xl font-bold mb-4">Recent posts</h2>
            <ul className="space-y-4">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blogs/${post.slug}`}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {post.title}
                  </Link>
                  <p className="text-sm text-base-content/60">{post.readingTime}</p>
                </li>
              ))}
            </ul>
            <Link href="/blogs" className="btn btn-primary mt-6">
              All posts
            </Link>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <div className="bg-base-200 rounded-lg p-6 h-full">
            <h2 className="text-2xl font-bold mb-4">Get in touch</h2>
            <p className="text-base-content/80 mb-8">
              Reach out for work, collaborations, or questions.
            </p>
            <div className="flex flex-row items-center gap-6">
              <a
                href={`mailto:${EMAIL}`}
                className="p-3 bg-base-300 rounded-full hover:bg-primary/20 transition-colors"
                aria-label={EMAIL}
              >
                <PiEnvelopeDuotone className="text-2xl" />
              </a>
              <a
                href={LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-base-300 rounded-full hover:bg-primary/20 transition-colors"
                aria-label="LinkedIn"
              >
                <PiLinkedinLogoDuotone className="text-2xl" />
              </a>
              <a
                href={TWITTER}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-base-300 rounded-full hover:bg-primary/20 transition-colors"
                aria-label="Twitter"
              >
                <PiTwitterLogoDuotone className="text-2xl" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetInTouch;
