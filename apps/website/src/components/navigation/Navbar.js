"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Menu, X, Gamepad2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/Button";
const links = [
    { name: "Home", href: "/" },
    { name: "World", href: "/world" },
    { name: "Systems", href: "/systems" },
    { name: "Rankings", href: "/rankings" },
    { name: "News", href: "/news" },
    { name: "Races", href: "/races" },
    { name: "About", href: "/about" },
];
export function Navbar() {
    const pathname = usePathname();
    const { scrollY } = useScroll();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 50);
    });
    return (_jsxs(motion.nav, { initial: { y: -100 }, animate: { y: 0 }, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }, className: `fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-lg shadow-black/10"
            : "bg-background/0"}`, children: [_jsxs("div", { className: "container mx-auto px-6 h-16 md:h-20 flex items-center justify-between", children: [_jsxs(Link, { href: "/", className: "text-2xl md:text-3xl font-heading text-primary tracking-widest hover:text-primary-hover transition-colors relative", children: ["LEGEND", _jsx(motion.span, { className: "absolute -bottom-1 left-0 h-[2px] bg-primary", initial: { width: 0 }, whileHover: { width: "100%" }, transition: { duration: 0.3 } })] }), _jsx("div", { className: "hidden lg:flex items-center gap-1", children: links.map((link) => {
                            const isActive = pathname === link.href;
                            return (_jsxs(Link, { href: link.href, className: `relative px-4 py-2 text-sm uppercase tracking-wider font-body transition-colors rounded-sm ${isActive
                                    ? "text-primary"
                                    : "text-text-secondary hover:text-primary"}`, children: [link.name, isActive && (_jsx(motion.div, { layoutId: "nav-active", className: "absolute inset-0 bg-primary-muted rounded-sm border border-primary/20", transition: { type: "spring", stiffness: 380, damping: 30 } }))] }, link.name));
                        }) }), _jsxs("div", { className: "hidden lg:flex items-center gap-4", children: [_jsxs(Link, { href: "/login", className: "text-sm text-text-secondary hover:text-primary uppercase tracking-wider font-body transition-colors flex items-center gap-1.5", children: [_jsx(LogIn, { className: "w-3.5 h-3.5" }), "Login"] }), _jsx(Link, { href: "/play", children: _jsxs(Button, { variant: "primary", size: "sm", children: [_jsx(Gamepad2, { className: "w-4 h-4" }), "Play Now"] }) })] }), _jsx("button", { onClick: () => setMobileOpen(!mobileOpen), className: "lg:hidden text-text-primary hover:text-primary transition-colors", "aria-label": mobileOpen ? "Close menu" : "Open menu", "aria-expanded": mobileOpen, children: mobileOpen ? _jsx(X, { className: "w-6 h-6" }) : _jsx(Menu, { className: "w-6 h-6" }) })] }), _jsx(AnimatePresence, { children: mobileOpen && (_jsx(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: "auto" }, exit: { opacity: 0, height: 0 }, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }, className: "lg:hidden bg-background/95 backdrop-blur-lg border-b border-border overflow-hidden", children: _jsxs("div", { className: "container mx-auto px-6 py-6 flex flex-col gap-4", children: [links.map((link) => {
                                const isActive = pathname === link.href;
                                return (_jsx(Link, { href: link.href, onClick: () => setMobileOpen(false), className: `text-lg uppercase tracking-wider font-body transition-colors ${isActive ? "text-primary" : "text-text-secondary hover:text-primary"}`, children: link.name }, link.name));
                            }), _jsx("hr", { className: "border-border my-2" }), _jsxs(Link, { href: "/login", onClick: () => setMobileOpen(false), className: "text-lg text-text-secondary hover:text-primary uppercase tracking-wider font-body transition-colors flex items-center gap-2", children: [_jsx(LogIn, { className: "w-4 h-4" }), "Login"] }), _jsx(Link, { href: "/play", onClick: () => setMobileOpen(false), children: _jsxs(Button, { variant: "primary", size: "md", className: "w-full mt-2", children: [_jsx(Gamepad2, { className: "w-4 h-4" }), "Play Now"] }) })] }) })) })] }));
}
//# sourceMappingURL=Navbar.js.map