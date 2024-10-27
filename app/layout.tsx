import type { Metadata } from "next";
import { Space_Grotesk as Jost } from "next/font/google";

import "./globals.css";

const inter = Jost({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pranav Portfolio",
  description: "A Developer Portfolio by Pranav.",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
