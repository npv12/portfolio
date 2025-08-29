"use client";

import mermaid from "mermaid";
import { useEffect, useRef, useState } from "react";

import { MermaidProps } from "./types";

const Mermaid = (props: MermaidProps) => {
  const { graph } = props;
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [enlarged, setEnlarged] = useState(false);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "forest",
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
      },
    });
    mermaid.run();
  }, []);

  useEffect(() => {
    if (mermaidRef.current) {
      try {
        mermaidRef.current.innerHTML = graph;
        mermaid.run({
          nodes: [mermaidRef.current],
        });
      } catch (error) {
        console.error("Mermaid failed to render", error);
      }
    }
  }, [graph]);

  return (
    <>
      <div
        ref={mermaidRef}
        className="bg-base-100 p-4 rounded-lg shadow-lg overflow-auto max-w-full cursor-zoom-in"
        style={{ minHeight: 120, minWidth: 200 }}
        onClick={() => setEnlarged(true)}
        tabIndex={0}
        aria-label="Enlarge Mermaid Diagram"
        data-theme="light"
      />
      {enlarged && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setEnlarged(false)}
        >
          <div
            className="bg-base-100 p-8 rounded-xl shadow-2xl max-w-8xl w-full max-h-[100vh] overflow-auto cursor-zoom-out"
            data-theme="light"
            style={{ minHeight: 300 }}
            onClick={(e) => {
              setEnlarged(false);
              e.stopPropagation();
            }}
          >
            <div
              ref={(el) => {
                if (el && mermaidRef.current) {
                  el.innerHTML = mermaidRef.current.innerHTML;
                }
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Mermaid;
