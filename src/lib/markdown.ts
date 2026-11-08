import { Marked, Tokens } from "marked";
import { BundledLanguage, bundledLanguages, createHighlighter } from "shiki";

export type TocItem = { id: string; text: string; depth: 2 | 3 };

const THEMES = { light: "vitesse-light", dark: "vitesse-dark" } as const;

let highlighterPromise: ReturnType<typeof createHighlighter> | null = null;
const getHighlighter = () => {
  highlighterPromise ??= createHighlighter({
    themes: [THEMES.light, THEMES.dark],
    langs: [],
  });
  return highlighterPromise;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const plainText = (value: string) => {
  let previous: string;
  do {
    previous = value;
    value = value.replace(/<[^>]+>/g, "");
  } while (value !== previous);
  return value
    .replace(/[`*_~]/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .trim();
};

const slugify = (value: string) =>
  plainText(value)
    .toLowerCase()
    .replace(/&[a-z]+;/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-") || "section";

const LANG_LABELS: Record<string, string> = {
  text: "Plain text",
  sql: "SQL",
  python: "Python",
  ruby: "Ruby",
  go: "Go",
  ts: "TypeScript",
  typescript: "TypeScript",
  js: "JavaScript",
  json: "JSON",
  yaml: "YAML",
  bash: "Shell",
  sh: "Shell",
};

type CodeToken = Tokens.Code & { highlighted?: string };
type HeadingToken = Tokens.Heading & { slug?: string };

export async function renderMarkdown(content: string) {
  const highlighter = await getHighlighter();
  const toc: TocItem[] = [];
  const seen = new Map<string, number>();

  const marked = new Marked({
    async: true,
    gfm: true,
    walkTokens: async (token) => {
      if (token.type === "heading") {
        const heading = token as HeadingToken;
        const base = slugify(heading.text);
        const count = seen.get(base) ?? 0;
        seen.set(base, count + 1);
        heading.slug = count ? `${base}-${count}` : base;
        if (heading.depth === 2 || heading.depth === 3) {
          toc.push({
            id: heading.slug,
            text: plainText(heading.text),
            depth: heading.depth,
          });
        }
      }
      if (token.type === "code") {
        const code = token as CodeToken;
        const lang = (code.lang || "text").split(/\s/)[0].toLowerCase();
        if (lang === "mermaid") return;
        const known = lang in bundledLanguages;
        if (known && !highlighter.getLoadedLanguages().includes(lang)) {
          await highlighter.loadLanguage(lang as BundledLanguage);
        }
        code.highlighted = highlighter.codeToHtml(code.text, {
          lang: known ? lang : "text",
          themes: THEMES,
          defaultColor: false,
        });
      }
    },
    renderer: {
      heading(token) {
        const { slug, depth } = token as HeadingToken;
        const inner = this.parser.parseInline(token.tokens);
        if (depth === 1) return `<h1>${inner}</h1>`;
        return `<h${depth} id="${slug}"><a class="heading-anchor" href="#${slug}" aria-hidden="true" tabindex="-1">#</a>${inner}</h${depth}>`;
      },
      code(token) {
        const code = token as CodeToken;
        const lang = (code.lang || "text").split(/\s/)[0].toLowerCase();
        if (lang === "mermaid") {
          return `<pre><code class="language-mermaid">${escapeHtml(code.text)}</code></pre>`;
        }
        const label = LANG_LABELS[lang] ?? lang;
        return `<figure class="code-block" data-lang="${escapeHtml(label)}">${code.highlighted ?? `<pre><code>${escapeHtml(code.text)}</code></pre>`}</figure>`;
      },
    },
  });

  const html = await marked.parse(content);
  return { html, toc };
}
