import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";

import Backdrop from "./components/Backdrop";
import { NAME, SITE_URL, TWITTER_HANDLE } from "./data/basic";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const sans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const description =
  "Backend engineer working in Python and Go. APIs, PostgreSQL, cloud infrastructure, and multi-tenant agent systems at Simbian.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Pranav Nedungadi",
    template: "%s | Pranav Nedungadi",
  },
  description,
  applicationName: NAME,
  authors: [{ name: NAME, url: SITE_URL }],
  creator: NAME,
  keywords: [
    NAME,
    "backend engineer",
    "Python",
    "Go",
    "PostgreSQL",
    "Kubernetes",
    "distributed systems",
    "agent systems",
  ],
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": [{ url: "/feed.xml", title: `${NAME}: Writing` }] },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    title: NAME,
    description,
    url: "/",
    siteName: NAME,
    locale: "en_US",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: NAME,
    description,
    creator: TWITTER_HANDLE,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f4ee" },
    { media: "(prefers-color-scheme: dark)", color: "#16130f" },
  ],
};

// Only an explicit light/dark choice is applied; anything else (including
// legacy daisyUI theme names) falls back to the system preference.
const themeScript = `(function(){var m=document.cookie.match(/(?:^|; )theme=([^;]*)/);var t=m&&m[1];if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t);})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Backdrop />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
