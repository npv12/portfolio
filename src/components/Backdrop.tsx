"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * A fixed, decorative layer behind the page: a soft glow that trails the
 * pointer and lights up a faint dot grid. Elements marked [data-glow] receive
 * local --gx/--gy coordinates so opaque surfaces can echo the same light.
 * Touch devices get a slow autonomous drift; reduced motion keeps it still.
 */
export default function Backdrop() {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");

    let glowTargets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-glow]")
    );
    let width = window.innerWidth;
    let height = window.innerHeight;
    const pos = { x: width * 0.7, y: height * 0.3 };
    const target = { ...pos };
    let pointerActive = false;
    let frame = 0;
    let start = performance.now();

    const write = () => {
      root.style.setProperty("--mx", `${pos.x.toFixed(1)}px`);
      root.style.setProperty("--my", `${pos.y.toFixed(1)}px`);
      for (const el of glowTargets) {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > height) continue;
        el.style.setProperty("--gx", `${(pos.x - rect.left).toFixed(1)}px`);
        el.style.setProperty("--gy", `${(pos.y - rect.top).toFixed(1)}px`);
      }
    };

    const drifting = () => !pointerActive && !reduce.matches;

    const tick = (now: number) => {
      frame = 0;
      if (drifting()) {
        // Slow Lissajous wander when there is no pointer to follow.
        const t = (now - start) / 1000;
        target.x = width * (0.5 + 0.32 * Math.sin(t * 0.21));
        target.y = height * (0.45 + 0.28 * Math.sin(t * 0.17 + 1.3));
      }
      const ease = pointerActive ? 0.12 : 0.03;
      pos.x += (target.x - pos.x) * ease;
      pos.y += (target.y - pos.y) * ease;
      write();
      const settled =
        Math.abs(target.x - pos.x) < 0.3 && Math.abs(target.y - pos.y) < 0.3;
      if (!settled || drifting()) schedule();
    };

    const schedule = () => {
      if (!frame && !document.hidden) frame = requestAnimationFrame(tick);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || reduce.matches) return;
      pointerActive = true;
      root.dataset.active = "true";
      target.x = event.clientX;
      target.y = event.clientY;
      schedule();
    };
    const onPointerLeave = () => {
      pointerActive = false;
      delete root.dataset.active;
      start = performance.now() - 4000;
      schedule();
    };
    const onScroll = () => schedule();
    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      schedule();
    };
    const onVisibility = () => schedule();
    const onMotion = () => {
      if (reduce.matches) {
        pointerActive = false;
        pos.x = target.x = width * 0.72;
        pos.y = target.y = height * 0.28;
        write();
      } else schedule();
    };

    // New page: re-collect glow surfaces.
    glowTargets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-glow]")
    );
    onMotion();
    write();
    schedule();

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    reduce.addEventListener("change", onMotion);
    fine.addEventListener("change", onPointerLeave);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener(
        "pointerleave",
        onPointerLeave
      );
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      reduce.removeEventListener("change", onMotion);
      fine.removeEventListener("change", onPointerLeave);
    };
  }, [pathname]);

  return (
    <div ref={ref} className="backdrop" aria-hidden="true">
      <div className="backdrop__ambient" />
      <div className="backdrop__grid" />
      <div className="backdrop__grid backdrop__grid--lit" />
      <div className="backdrop__glow" />
    </div>
  );
}
