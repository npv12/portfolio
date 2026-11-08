/**
 * Reads design tokens as plain hex colours, for libraries that cannot
 * consume CSS custom properties (Mermaid's colour maths, for one).
 *
 * The raw value of a token is an unresolved expression such as
 * `light-dark(…)` or `color-mix(…)`, so each token is applied to a hidden
 * probe element and its computed colour is read instead. A 1x1 canvas then
 * normalises whatever colour syntax the browser reports (oklch, color())
 * to sRGB hex.
 */

let canvas: CanvasRenderingContext2D | null = null;

function toHex(color: string): string {
  canvas ??= document
    .createElement("canvas")
    .getContext("2d", { willReadFrequently: true });
  if (!canvas) return color;
  canvas.clearRect(0, 0, 1, 1);
  canvas.fillStyle = "#000";
  canvas.fillStyle = color;
  canvas.fillRect(0, 0, 1, 1);
  const [r, g, b] = canvas.getImageData(0, 0, 1, 1).data;
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

/** Resolves each `--token` name to hex in the page's current scheme. */
export function resolveTokens<K extends string>(
  tokens: Record<K, `--${string}`>
): Record<K, string> {
  const probe = document.createElement("span");
  probe.hidden = true;
  document.body.append(probe);
  try {
    const entries = Object.entries(tokens) as [K, string][];
    return Object.fromEntries(
      entries.map(([key, name]) => {
        probe.style.color = `var(${name})`;
        return [key, toHex(getComputedStyle(probe).color)];
      })
    ) as Record<K, string>;
  } finally {
    probe.remove();
  }
}
