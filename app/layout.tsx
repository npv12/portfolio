import type { Metadata } from "next";
import { Space_Grotesk as Jost } from "next/font/google";
import Script from "next/script";

import "./globals.css";

const inter = Jost({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pranav Nedungadi",
  description:
    "Software developer at Simbian. Backend, SOC automation, and agentic systems.",
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
