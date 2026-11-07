"use client";

import { useEffect, useRef } from "react";

export default function ReadingProgress({ target }: { target: string }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const article = document.getElementById(target);
    const bar = barRef.current;
    if (!article || !bar) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = article.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.6;
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(total, 1)));
      bar.style.transform = `scaleX(${progress.toFixed(4)})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [target]);

  return (
    <div className="reading-progress" aria-hidden="true">
      <div ref={barRef} />
    </div>
  );
}
