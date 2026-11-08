"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { PiArrowsOutBold, PiXBold } from "react-icons/pi";

import { resolveTokens } from "@/theme/resolve";
import { useScheme } from "@/theme/scheme";

type MermaidProps = { graph: string };

const readTokens = () => ({
  ...resolveTokens({
    paper: "--paper",
    paper2: "--paper-2",
    paper3: "--paper-3",
    ink: "--ink",
    ink2: "--ink-2",
    muted: "--muted",
    line: "--line",
    lineStrong: "--line-strong",
    signal: "--signal",
  }),
  font: getComputedStyle(document.body).fontFamily,
});

let renderCount = 0;
const MIN_SCALE = 0.62;
const HORIZONTAL = /^(\s*(?:flowchart|graph)\s+)(LR|RL)\b/;

const sizeOf = (svg: string) => {
  const viewBox = svg.match(/viewBox="([\d.\s-]+)"/);
  if (!viewBox) return null;
  const [, , w, h] = viewBox[1].split(/\s+/).map(Number);
  return { w, h };
};

const widthBucket = (width: number) =>
  width < 520 ? "s" : width < 900 ? "m" : "l";

const Mermaid = ({ graph }: MermaidProps) => {
  const baseId = `mermaid-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const scheme = useScheme();
  const [svg, setSvg] = useState<string | null>(null);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [failed, setFailed] = useState(false);
  const [enlarged, setEnlarged] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const [bucket, setBucket] = useState<string | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!scheme || !bucket) return;
    let cancelled = false;
    (async () => {
      try {
        await document.fonts?.ready;
        const mermaid = (await import("mermaid")).default;
        const t = readTokens();
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          darkMode: scheme === "dark",
          fontFamily: t.font,
          themeVariables: {
            darkMode: scheme === "dark",
            fontFamily: t.font,
            fontSize: "14px",
            background: t.paper2,
            primaryColor: t.paper,
            primaryTextColor: t.ink,
            primaryBorderColor: t.lineStrong,
            secondaryColor: t.paper3,
            secondaryTextColor: t.ink,
            secondaryBorderColor: t.lineStrong,
            tertiaryColor: t.paper2,
            tertiaryTextColor: t.ink,
            tertiaryBorderColor: t.line,
            mainBkg: t.paper,
            nodeBorder: t.lineStrong,
            nodeTextColor: t.ink,
            textColor: t.ink,
            lineColor: t.muted,
            clusterBkg: t.paper3,
            clusterBorder: t.line,
            titleColor: t.ink2,
            edgeLabelBackground: t.paper2,
            // sequence diagrams
            actorBkg: t.paper,
            actorBorder: t.lineStrong,
            actorTextColor: t.ink,
            actorLineColor: t.line,
            signalColor: t.ink2,
            signalTextColor: t.ink,
            labelBoxBkgColor: t.paper3,
            labelBoxBorderColor: t.lineStrong,
            labelTextColor: t.ink,
            loopTextColor: t.ink2,
            noteBkgColor: t.paper3,
            noteBorderColor: t.signal,
            noteTextColor: t.ink,
            activationBkgColor: t.paper3,
            activationBorderColor: t.signal,
            sequenceNumberColor: t.paper,
            // class diagrams
            classText: t.ink,
          },
          flowchart: {
            useMaxWidth: false,
            htmlLabels: true,
            padding: 10,
            nodeSpacing: 34,
            rankSpacing: 42,
            diagramPadding: 8,
          },
          sequence: { useMaxWidth: false },
          class: { useMaxWidth: false },
        });
        const render = async (source: string) => {
          const { svg: out } = await mermaid.render(
            `${baseId}-${++renderCount}`,
            source.trim()
          );
          return { svg: out, size: sizeOf(out) };
        };
        let result = await render(graph);
        // A long left-to-right chain that cannot fit at a readable size reads
        // better stacked top-to-bottom.
        const available = (viewportRef.current?.clientWidth ?? 700) - 32;
        if (
          result.size &&
          result.size.w * MIN_SCALE > available &&
          HORIZONTAL.test(graph)
        ) {
          const stacked = await render(graph.replace(HORIZONTAL, "$1TD"));
          const wideScale = Math.max(MIN_SCALE, available / result.size.w);
          const tallScale = stacked.size
            ? Math.min(1, available / stacked.size.w)
            : 0;
          if (
            stacked.size &&
            tallScale > wideScale + 0.1 &&
            stacked.size.h * tallScale < 1600
          ) {
            result = stacked;
          }
        }
        if (cancelled) return;
        const rendered = result.svg;
        if (result.size) setNatural(result.size);
        setSvg(rendered);
        setFailed(false);
      } catch (error) {
        console.error("Mermaid failed to render", error);
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [graph, baseId, scheme, bucket]);

  // Fit to the column, but never shrink labels below MIN_SCALE; past that the
  // diagram scrolls horizontally instead.
  const fit = useCallback(() => {
    const viewport = viewportRef.current;
    const el = viewport?.querySelector("svg");
    if (!viewport || !el || !natural) return;
    const available = viewport.clientWidth - 32;
    const scale = Math.min(1, Math.max(MIN_SCALE, available / natural.w));
    el.setAttribute("width", String(Math.round(natural.w * scale)));
    el.setAttribute("height", String(Math.round(natural.h * scale)));
    el.style.maxWidth = "none";
    setOverflowing(natural.w * scale > available + 1);
  }, [natural]);

  useEffect(() => {
    fit();
    const viewport = viewportRef.current;
    if (!viewport) return;
    const observer = new ResizeObserver(() => {
      setBucket(widthBucket(viewport.clientWidth));
      fit();
    });
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [fit, svg]);

  useEffect(() => {
    if (!enlarged) return;
    const trigger = triggerRef.current;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setEnlarged(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
      trigger?.focus();
    };
  }, [enlarged]);

  if (failed) {
    return (
      <figure className="diagram diagram--failed not-prose">
        <figcaption className="diagram__bar mono">
          <span>Diagram source</span>
        </figcaption>
        <pre>
          <code>{graph}</code>
        </pre>
      </figure>
    );
  }

  return (
    <figure className="diagram not-prose">
      <figcaption className="diagram__bar mono">
        <span>Diagram{overflowing ? " · scroll sideways" : ""}</span>
        <button
          ref={triggerRef}
          type="button"
          className="diagram__expand"
          onClick={() => setEnlarged(true)}
          disabled={!svg}
        >
          <PiArrowsOutBold aria-hidden="true" /> Expand
        </button>
      </figcaption>
      <div
        ref={viewportRef}
        className="diagram__viewport"
        data-overflowing={overflowing}
        tabIndex={overflowing ? 0 : undefined}
        role="img"
        aria-label="Architecture diagram"
      >
        {svg ? (
          <div
            className="diagram__svg"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : (
          <div className="diagram__loading" aria-hidden="true" />
        )}
      </div>
      {enlarged && svg && (
        <div
          className="diagram-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged diagram"
          onClick={(event) => {
            if (event.target === event.currentTarget) setEnlarged(false);
          }}
        >
          <div className="diagram-overlay__panel">
            <div className="diagram__bar mono">
              <span>Diagram</span>
              <button
                ref={closeRef}
                type="button"
                className="diagram__expand"
                onClick={() => setEnlarged(false)}
              >
                <PiXBold aria-hidden="true" /> Close
              </button>
            </div>
            <div
              className="diagram-overlay__canvas"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </div>
        </div>
      )}
    </figure>
  );
};

export default Mermaid;
