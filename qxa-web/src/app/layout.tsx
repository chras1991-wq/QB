import type { Metadata } from "next";
import { Caveat, IBM_Plex_Mono, Patrick_Hand } from "next/font/google";
import { SketchSvgDefs } from "@/components/sketch-svg-defs";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const patrickHand = Patrick_Hand({
  variable: "--font-patrick-hand",
  subsets: ["latin"],
  weight: ["400"],
});

const ibmMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "QXA",
  description: "Cryptographically serialized assets on Bitcoin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${caveat.variable} ${patrickHand.variable} ${ibmMono.variable} min-h-screen antialiased`}
      >
        <SketchSvgDefs />
        <div className="paper-noise pointer-events-none fixed inset-0 z-50 opacity-[0.07]" aria-hidden />
        <SiteHeader />
        <main className="relative z-[1]">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
