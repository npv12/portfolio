import parse, {
  DOMNode,
  Element,
  HTMLReactParserOptions,
  Text,
  domToReact,
} from "html-react-parser";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PiArrowLeftBold, PiArrowRightBold } from "react-icons/pi";

import JsonLd from "@/components/JsonLd";
import Mermaid from "@/components/Mermaid";
import Navbar from "@/components/Navbar";
import { formatDate } from "@/components/PostRow";
import CopyCode from "@/components/article/CopyCode";
import ReadingProgress from "@/components/article/ReadingProgress";
import Toc from "@/components/article/Toc";
import { NAME, SITE_URL, TWITTER_HANDLE } from "@/data/basic";
import {
  calculateReadingTime,
  getBlogContent,
  getBlogPosts,
} from "@/lib/blogs";
import { renderMarkdown } from "@/lib/markdown";
import Contact from "@/sections/Contact";
import { NextjsParams } from "@/types/blogs";
import { BlogPost } from "@/types/blogs";

const textOf = (node: Element): string =>
  node.children
    .map((child) =>
      child instanceof Text
        ? child.data
        : child instanceof Element
          ? textOf(child)
          : ""
    )
    .join("");

const parseOptions: HTMLReactParserOptions = {
  replace: (domNode: DOMNode) => {
    if (!(domNode instanceof Element)) return;

    if (domNode.tagName === "pre") {
      const code = domNode.children[0];
      if (
        code instanceof Element &&
        code.tagName === "code" &&
        code.attribs.class === "language-mermaid"
      ) {
        return <Mermaid graph={textOf(code)} />;
      }
    }

    if (
      domNode.tagName === "figure" &&
      domNode.attribs.class === "code-block"
    ) {
      return (
        <figure className="code-block not-prose">
          <figcaption className="code-block__bar mono">
            <span>{domNode.attribs["data-lang"]}</span>
            <CopyCode />
          </figcaption>
          {domToReact(domNode.children as DOMNode[], parseOptions)}
        </figure>
      );
    }

    if (domNode.tagName === "table") {
      return (
        <div className="table-scroll" tabIndex={0}>
          <table>
            {domToReact(domNode.children as DOMNode[], parseOptions)}
          </table>
        </div>
      );
    }
  },
};

const initials = NAME.split(" ")
  .map((part) => part[0])
  .join("");

const relatedPosts = (posts: BlogPost[], slug: string, tags: string[]) => {
  const wanted = new Set(tags.map((tag) => tag.toLowerCase()));
  return posts
    .filter((post) => post.slug !== slug)
    .map((post) => ({
      post,
      score: post.tags.filter((tag) => wanted.has(tag.toLowerCase())).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ post }) => post);
};

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: NextjsParams): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { frontmatter, content } = await getBlogContent(slug);
    const description =
      frontmatter.description || content.slice(0, 160).replace(/\s+/g, " ");
    const url = `/blogs/${slug}`;
    const author = frontmatter.author || NAME;
    return {
      title: frontmatter.title,
      description,
      authors: [{ name: author, url: SITE_URL }],
      keywords: frontmatter.tags,
      alternates: {
        canonical: url,
        types: { "application/rss+xml": "/feed.xml" },
      },
      openGraph: {
        title: frontmatter.title,
        description,
        url,
        siteName: NAME,
        locale: "en_US",
        type: "article",
        publishedTime: frontmatter.date,
        authors: [SITE_URL],
        tags: frontmatter.tags,
      },
      twitter: {
        card: "summary_large_image",
        title: frontmatter.title,
        description,
        creator: TWITTER_HANDLE,
      },
    };
  } catch {
    return {};
  }
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

  const [{ html, toc }, posts] = await Promise.all([
    renderMarkdown(content),
    getBlogPosts(),
  ]);
  const index = posts.findIndex((post) => post.slug === slug);
  const newer = index > 0 ? posts[index - 1] : null;
  const older =
    index >= 0 && index < posts.length - 1 ? posts[index + 1] : null;
  const related = relatedPosts(posts, slug, frontmatter.tags).filter(
    (post) => post.slug !== newer?.slug && post.slug !== older?.slug
  );

  const postUrl = `${SITE_URL}/blogs/${slug}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.date,
    dateModified: frontmatter.date,
    url: postUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
    image: `${postUrl}/opengraph-image`,
    keywords: frontmatter.tags.join(", "),
    wordCount: content.split(/\s+/).filter(Boolean).length,
    inLanguage: "en",
    author: {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: frontmatter.author || NAME,
      url: SITE_URL,
    },
    publisher: { "@type": "Person", "@id": `${SITE_URL}/#person`, name: NAME },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Writing",
        item: `${SITE_URL}/blogs`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: frontmatter.title,
        item: postUrl,
      },
    ],
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Navbar />
      <ReadingProgress target="post-body" />
      <main id="main" className="shell">
        <article className="post">
          <header className="post__head">
            <Link href="/blogs" className="back-link">
              <PiArrowLeftBold aria-hidden="true" /> All writing
            </Link>
            {frontmatter.tags.length > 0 && (
              <p className="post__kicker mono">
                {frontmatter.tags.slice(0, 3).join(" / ")}
              </p>
            )}
            <h1 className="post__title">{frontmatter.title}</h1>
            {frontmatter.description && (
              <p className="post__lede">{frontmatter.description}</p>
            )}
            <div className="post__byline">
              <span className="post__avatar mono" aria-hidden="true">
                {initials}
              </span>
              <span>
                <span className="post__author">
                  {frontmatter.author || NAME}
                </span>
                <span className="post__meta mono">
                  <time dateTime={frontmatter.date}>
                    {formatDate(frontmatter.date, "long")}
                  </time>
                  <span aria-hidden="true"> · </span>
                  {calculateReadingTime(content)}
                </span>
              </span>
            </div>
          </header>

          <div className="post__layout">
            <aside className="post__aside">
              <Toc items={toc} />
            </aside>
            <div id="post-body" className="post__body prose">
              {parse(html, parseOptions)}
            </div>
          </div>

          <footer className="post__foot">
            {frontmatter.tags.length > 0 && (
              <ul className="stack" aria-label="Tags">
                {frontmatter.tags.map((tag: string) => (
                  <li key={tag} className="tag">
                    {tag}
                  </li>
                ))}
              </ul>
            )}

            <nav className="post-nav" aria-label="More posts">
              {older ? (
                <Link href={`/blogs/${older.slug}`} className="post-nav__link">
                  <span className="mono">
                    <PiArrowLeftBold aria-hidden="true" /> Previous
                  </span>
                  <span className="post-nav__title">{older.title}</span>
                </Link>
              ) : (
                <span />
              )}
              {newer && (
                <Link
                  href={`/blogs/${newer.slug}`}
                  className="post-nav__link post-nav__link--next"
                >
                  <span className="mono">
                    Next <PiArrowRightBold aria-hidden="true" />
                  </span>
                  <span className="post-nav__title">{newer.title}</span>
                </Link>
              )}
            </nav>

            {related.length > 0 && (
              <section className="related" aria-labelledby="related-heading">
                <h2 id="related-heading" className="section__index mono">
                  <b>Related</b> on similar topics
                </h2>
                <div className="related__grid">
                  {related.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blogs/${post.slug}`}
                      className="related__card"
                    >
                      <span className="mono related__tags">
                        {post.tags.slice(0, 2).join(" / ")}
                      </span>
                      <span className="related__title">{post.title}</span>
                      <span className="mono related__time">
                        {post.readingTime}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </footer>
        </article>
      </main>
      <Contact />
    </>
  );
}
