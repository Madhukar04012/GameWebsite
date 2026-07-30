import type { Metadata } from "next";
import { Bebas_Neue, Cinzel, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Particles } from "@/components/ui/Particles";
import { ScrollIndicator } from "@/components/ui/ScrollIndicator";
import { CursorGlow } from "@/components/ui/CursorGlow";
import { AppWrapper } from "@/components/layout/AppWrapper";

/* ── Font Configuration ── */

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/* ── Metadata ── */

export const metadata: Metadata = {
  title: {
    default: "Legend — Your Story Starts Today",
    template: "%s — Legend",
  },
  description:
    "Every decision shapes the world. Every player writes history. Enter a massive multiplayer universe where your choices have lasting consequences.",
  openGraph: {
    title: "Legend — Your Story Starts Today",
    description: "A living world shaped by every player. Forge your legend.",
    siteName: "Legend",
    locale: "en_US",
    type: "website",
  },
};

/* ── Root Layout ── */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${cinzel.variable} ${inter.variable} antialiased`}
    >
      <body className="flex flex-col min-h-screen bg-background text-text-primary font-body">
        {/* Skip link for keyboard users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-background focus:rounded-sm focus:outline-none"
        >
          Skip to main content
        </a>

        <Particles count={25} />
        <CursorGlow />
        <ScrollIndicator />

        <AppWrapper>
          <SmoothScroll>
            <Navbar />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </SmoothScroll>
        </AppWrapper>
      </body>
    </html>
  );
}
