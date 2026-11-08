"use client";

import { ReactNode, useEffect, useRef } from "react";

export type SphereSkill = { name: string; icon: ReactNode };

type Vec = { x: number; y: number; z: number };

// Evenly distributed points on a unit sphere (Fibonacci lattice).
const lattice = (count: number): Vec[] => {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: count }, (_, i) => {
    const y = 1 - (2 * (i + 0.5)) / count;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    return { x: Math.cos(theta) * r, y, z: Math.sin(theta) * r };
  });
};

const IDLE = { x: 0.0018, y: 0.0042 };

export default function SkillSphere({ skills }: { skills: SphereSkill[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const readoutRef = useRef<HTMLOutputElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const points = lattice(skills.length);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let radius = 0;
    let velocity = { ...IDLE };
    let target = { ...IDLE };
    let frontIndex = -1;
    let frame = 0;
    let visible = true;
    let dragging = false;
    let last = { x: 0, y: 0 };
    let dragStart = { x: 0, y: 0 };
    let decided: "rotate" | "scroll" | null = null;

    const measure = () => {
      const size = stage.clientWidth;
      const box = Math.max(32, Math.min(48, size * 0.11));
      stage.style.setProperty("--icon-box", `${box}px`);
      radius = size / 2 - box * 0.6;
    };

    const rotate = (ax: number, ay: number) => {
      const cx = Math.cos(ax);
      const sx = Math.sin(ax);
      const cy = Math.cos(ay);
      const sy = Math.sin(ay);
      for (const p of points) {
        // Rotate around X, then around Y.
        const y1 = p.y * cx - p.z * sx;
        const z1 = p.y * sx + p.z * cx;
        const x2 = p.x * cy + z1 * sy;
        const z2 = -p.x * sy + z1 * cy;
        p.x = x2;
        p.y = y1;
        p.z = z2;
      }
    };

    const paint = () => {
      let maxZ = -Infinity;
      let front = 0;
      points.forEach((p, i) => {
        const el = itemRefs.current[i];
        if (!el) return;
        const depth = (p.z + 1) / 2; // 0 back .. 1 front
        const scale = 0.55 + depth * 0.6;
        el.style.transform = `translate3d(${(p.x * radius).toFixed(1)}px, ${(
          p.y * radius
        ).toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
        el.style.opacity = (0.18 + depth * 0.82).toFixed(3);
        el.style.zIndex = String(Math.round(depth * 100));
        if (p.z > maxZ) {
          maxZ = p.z;
          front = i;
        }
      });
      if (front !== frontIndex) {
        itemRefs.current[frontIndex]?.removeAttribute("data-front");
        itemRefs.current[front]?.setAttribute("data-front", "true");
        frontIndex = front;
        if (readoutRef.current)
          readoutRef.current.textContent = skills[front].name;
      }
    };

    const tick = () => {
      frame = 0;
      if (!dragging) {
        velocity.x += (target.x - velocity.x) * 0.04;
        velocity.y += (target.y - velocity.y) * 0.04;
      }
      rotate(velocity.x, velocity.y);
      paint();
      schedule();
    };

    const schedule = () => {
      const idle =
        reduceMotion.matches &&
        !dragging &&
        Math.abs(velocity.x) + Math.abs(velocity.y) < 0.0005;
      if (!frame && visible && !document.hidden && !idle) {
        frame = requestAnimationFrame(tick);
      }
    };

    const restTarget = () =>
      reduceMotion.matches ? { x: 0, y: 0 } : { ...IDLE };

    const capture = (pointerId: number) => {
      try {
        stage.setPointerCapture(pointerId);
      } catch {
        // Capture is a nicety; dragging still works without it.
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      dragging = true;
      decided = event.pointerType === "mouse" ? "rotate" : null;
      last = { x: event.clientX, y: event.clientY };
      dragStart = { ...last };
      stage.dataset.dragging = "true";
      if (decided === "rotate") capture(event.pointerId);
      schedule();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) {
        // Mouse hover gently steers the spin towards the cursor.
        if (event.pointerType === "mouse" && !reduceMotion.matches) {
          const rect = stage.getBoundingClientRect();
          const dx = (event.clientX - rect.left) / rect.width - 0.5;
          const dy = (event.clientY - rect.top) / rect.height - 0.5;
          target = { x: dy * 0.02, y: -dx * 0.02 };
          schedule();
        }
        return;
      }
      if (decided === null) {
        const dx = Math.abs(event.clientX - dragStart.x);
        const dy = Math.abs(event.clientY - dragStart.y);
        if (dx < 6 && dy < 6) return;
        decided = dx > dy ? "rotate" : "scroll";
        if (decided === "rotate") capture(event.pointerId);
      }
      if (decided !== "rotate") return;
      const size = stage.clientWidth || 1;
      const mx = event.clientX - last.x;
      const my = event.clientY - last.y;
      last = { x: event.clientX, y: event.clientY };
      velocity = { x: (my / size) * 3, y: (-mx / size) * 3 };
      rotate(velocity.x, velocity.y);
      paint();
    };

    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      decided = null;
      delete stage.dataset.dragging;
      target = restTarget();
      schedule();
    };

    const onPointerLeave = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && !dragging) {
        target = restTarget();
        schedule();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const step = 0.25;
      const map: Record<string, [number, number]> = {
        ArrowLeft: [0, step],
        ArrowRight: [0, -step],
        ArrowUp: [-step, 0],
        ArrowDown: [step, 0],
      };
      const delta = map[event.key];
      if (!delta) return;
      event.preventDefault();
      rotate(delta[0], delta[1]);
      paint();
    };

    const resizeObserver = new ResizeObserver(() => {
      measure();
      paint();
    });
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
      else if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    const onVisibility = () => schedule();
    const onMotionChange = () => {
      target = restTarget();
      velocity = { ...target };
      schedule();
    };

    measure();
    target = restTarget();
    velocity = { ...target };
    rotate(-0.35, 0.6);
    paint();
    schedule();

    resizeObserver.observe(stage);
    intersectionObserver.observe(stage);
    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerup", endDrag);
    stage.addEventListener("pointercancel", endDrag);
    stage.addEventListener("pointerleave", onPointerLeave);
    stage.addEventListener("keydown", onKeyDown);
    document.addEventListener("visibilitychange", onVisibility);
    reduceMotion.addEventListener("change", onMotionChange);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      stage.removeEventListener("pointerdown", onPointerDown);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerup", endDrag);
      stage.removeEventListener("pointercancel", endDrag);
      stage.removeEventListener("pointerleave", onPointerLeave);
      stage.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMotion.removeEventListener("change", onMotionChange);
    };
  }, [skills]);

  return (
    <figure className="sphere">
      <div
        ref={stageRef}
        className="sphere__stage"
        role="group"
        aria-label="Tools I work with. Drag or use arrow keys to rotate."
        tabIndex={0}
      >
        <svg className="sphere__frame" viewBox="0 0 100 100" aria-hidden="true">
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.25"
            vectorEffect="non-scaling-stroke"
          />
          <ellipse
            cx="50"
            cy="50"
            rx="44"
            ry="13"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.25"
            strokeDasharray="1 1.5"
            vectorEffect="non-scaling-stroke"
            opacity="0.7"
          />
          <ellipse
            cx="50"
            cy="50"
            rx="13"
            ry="44"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.25"
            strokeDasharray="1 1.5"
            vectorEffect="non-scaling-stroke"
            opacity="0.7"
          />
          {[
            [50, 2, 50, 4.5],
            [50, 95.5, 50, 98],
            [2, 50, 4.5, 50],
            [95.5, 50, 98, 50],
          ].map(([x1, y1, x2, y2]) => (
            <line
              key={`${x1}-${y1}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
        {skills.map(({ name, icon }, index) => (
          <span
            key={name}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            className="sphere__item"
            title={name}
          >
            {icon}
            <span className="sr-only">{name}</span>
          </span>
        ))}
      </div>
      <figcaption className="sphere__readout mono">
        <span>
          <output ref={readoutRef} aria-hidden="true">
            {skills[0]?.name}
          </output>
        </span>
        <span>Drag to spin</span>
      </figcaption>
    </figure>
  );
}
