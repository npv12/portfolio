import type { Metadata } from "next";
import { Space_Grotesk as Jost } from "next/font/google";
import Script from "next/script";

import { SITE_URL } from "./data/basic";
import "./globals.css";

const inter = Jost({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Pranav Nedungadi",
    template: "%s | Pranav Nedungadi",
  },
  description:
    "Software developer at Simbian. Backend, SOC automation, and agentic systems.",
  openGraph: {
    title: "Pranav Nedungadi",
    description:
      "Software developer at Simbian. Backend, SOC automation, and agentic systems.",
    url: SITE_URL,
    siteName: "Pranav Nedungadi",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Pranav Nedungadi",
    description:
      "Software developer at Simbian. Backend, SOC automation, and agentic systems.",
  },
};

const themeScript = `document.documentElement.setAttribute("data-theme",(document.cookie.match(/(?:^|; )theme=([^;]*)/)||[])[1]||"light");`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Script
          id="theme"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        {children}
      </body>
    </html>
  );
}
