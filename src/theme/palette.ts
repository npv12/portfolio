/**
 * Build-time mirror of the palette in src/styles/tokens.css, for places
 * that cannot read CSS: social cards, the app icon, and browser chrome.
 * The stylesheet is the source of truth; keep these values in sync with it.
 *
 * src/app/icon.svg is static and hardcodes light signal (#2c5dbd) and light
 * paper (#e5ece4); update it by hand if those change.
 */
import type { Scheme } from "./config";

type Oklch = readonly [lightness: number, chroma: number, hue: number];

const palette = {
  light: {
    paper: [0.935, 0.013, 140],
    ink: [0.22, 0.02, 165],
    muted: [0.47, 0.018, 155],
    line: [0.82, 0.016, 140],
    signal: [0.5, 0.16, 262],
  },
  dark: {
    paper: [0.17, 0.012, 165],
    ink: [0.93, 0.012, 130],
    muted: [0.67, 0.014, 150],
    line: [0.3, 0.014, 165],
    signal: [0.72, 0.12, 258],
  },
} as const satisfies Record<Scheme, Record<string, Oklch>>;

export type PaletteRole = keyof (typeof palette)["light"];

/** OKLCH to an sRGB hex string, clamping out-of-gamut channels. */
export function oklchToHex([l, c, h]: Oklch): string {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);

  // OKLab to linear sRGB (Björn Ottosson's reference matrices).
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const linear = [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ];

  const toByte = (x: number) => {
    const v = Math.min(1, Math.max(0, x));
    const gamma = v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
    return Math.round(gamma * 255)
      .toString(16)
      .padStart(2, "0");
  };

  return `#${linear.map(toByte).join("")}`;
}

/** A palette colour as hex, e.g. `hex("dark", "paper")`. */
export const hex = (scheme: Scheme, role: PaletteRole) =>
  oklchToHex(palette[scheme][role]);
