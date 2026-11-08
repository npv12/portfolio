import { ImageResponse } from "next/og";

import { NAME, SITE_URL } from "@/data/basic";
import { hex } from "@/theme/palette";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

// Social cards always use the dark scheme.
const COLORS = {
  paper: hex("dark", "paper"),
  ink: hex("dark", "ink"),
  muted: hex("dark", "muted"),
  line: hex("dark", "line"),
  signal: hex("dark", "signal"),
};

type CardProps = {
  kicker: string;
  title: string;
  subtitle?: string;
  footer?: string;
};

/** Shared social card used by every opengraph-image route. */
export function renderOgCard({ kicker, title, subtitle, footer }: CardProps) {
  const host = new URL(SITE_URL).host;
  const titleSize = title.length > 70 ? 58 : title.length > 45 ? 66 : 76;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        background: COLORS.paper,
        backgroundImage: `radial-gradient(circle at 85% 15%, ${COLORS.signal}38, transparent 45%)`,
        color: COLORS.ink,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: COLORS.signal,
            color: COLORS.paper,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          PN
        </div>
        <div
          style={{
            fontSize: 24,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: COLORS.muted,
          }}
        >
          {kicker}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            fontSize: titleSize,
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: -1.5,
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.4,
              color: COLORS.muted,
              maxWidth: 1000,
            }}
          >
            {subtitle.length > 150 ? `${subtitle.slice(0, 147)}…` : subtitle}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: `2px solid ${COLORS.line}`,
          paddingTop: 24,
          fontSize: 24,
          color: COLORS.muted,
        }}
      >
        <span style={{ color: COLORS.ink }}>{NAME}</span>
        <span>{footer ?? host}</span>
      </div>
    </div>,
    OG_SIZE
  );
}
