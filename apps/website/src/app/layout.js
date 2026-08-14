import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
export const metadata = {
    title: {
        default: "Legend — Your Story Starts Today",
        template: "%s — Legend",
    },
    description: "Every decision shapes the world. Every player writes history. Enter a massive multiplayer universe where your choices have lasting consequences.",
    openGraph: {
        title: "Legend — Your Story Starts Today",
        description: "A living world shaped by every player. Forge your legend.",
        siteName: "Legend",
        locale: "en_US",
        type: "website",
    },
};
/* ── Root Layout ── */
export default function RootLayout({ children, }) {
    return (_jsx("html", { lang: "en", className: `${bebasNeue.variable} ${cinzel.variable} ${inter.variable} antialiased`, children: _jsxs("body", { className: "flex flex-col min-h-screen bg-background text-text-primary font-body", children: [_jsx("a", { href: "#main-content", className: "sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-background focus:rounded-sm focus:outline-none", children: "Skip to main content" }), _jsx(Particles, { count: 25 }), _jsx(CursorGlow, {}), _jsx(ScrollIndicator, {}), _jsx(AppWrapper, { children: _jsxs(SmoothScroll, { children: [_jsx(Navbar, {}), _jsx("main", { id: "main-content", className: "flex-1", children: children }), _jsx(Footer, {})] }) })] }) }));
}
//# sourceMappingURL=layout.js.map