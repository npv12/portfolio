"use client";

import { useEffect, useState } from "react";

import type { TocItem } from "@/lib/markdown";

function useActiveHeading(ids: string[]) {
  const [active, setActive] = useState<string | null>(ids[0] ?? null);

  useEffect(() => {
    const headings = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!headings.length) return;

    const update = () => {
      const offset = window.innerHeight * 0.3;
      let current = headings[0].id;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top - offset <= 0)
          current = heading.id;
        else break;
      }
      setActive(current);
    };
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ids]);

  return active;
}

function TocList({
  items,
  active,
  onNavigate,
}: {
  items: TocItem[];
  active: string | null;
  onNavigate?: () => void;
}) {
  return (
    <ol className="toc__list">
      {items.map((item) => (
        <li key={item.id} data-depth={item.depth}>
          <a
            href={`#${item.id}`}
            aria-current={active === item.id ? "location" : undefined}
            onClick={onNavigate}
          >
            {item.text}
          </a>
        </li>
      ))}
    </ol>
  );
}

export default function Toc({ items }: { items: TocItem[] }) {
  const [ids] = useState(() => items.map((item) => item.id));
  const active = useActiveHeading(ids);
  const [open, setOpen] = useState(false);
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.id === active)
  );
  const activeText = items[activeIndex]?.text;

  if (items.length < 2) return null;

  return (
    <>
      <nav className="toc toc--rail" aria-label="On this page">
        <p className="toc__label mono">On this page</p>
        <TocList items={items} active={active} />
      </nav>
      <details
        className="toc toc--inline"
        open={open}
        onToggle={(event) => setOpen((event.target as HTMLDetailsElement).open)}
      >
        <summary>
          <span className="mono toc__label">
            On this page · {activeIndex + 1}/{items.length}
          </span>
          <span className="toc__current">{activeText}</span>
        </summary>
        <TocList
          items={items}
          active={active}
          onNavigate={() => setOpen(false)}
        />
      </details>
    </>
  );
}
