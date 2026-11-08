import { NAME, SPECIALTY } from "@/data/basic";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/lib/og";

export const alt = `${NAME}, ${SPECIALTY}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgCard({
    kicker: SPECIALTY,
    title: NAME,
    subtitle:
      "Python and Go. APIs, PostgreSQL, cloud infrastructure, and multi-tenant agent systems.",
  });
}
