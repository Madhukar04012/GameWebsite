"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
const columns = [
    {
        title: "Game",
        links: [
            { label: "Download", href: "#" },
            { label: "Patch Notes", href: "#" },
            { label: "System Req.", href: "#" },
        ],
    },
    {
        title: "Community",
        links: [
            { label: "Forums", href: "#" },
            { label: "Discord", href: "#" },
            { label: "Leaderboards", href: "#" },
        ],
    },
    {
        title: "Support",
        links: [
            { label: "Help Center", href: "#" },
            { label: "Account Security", href: "#" },
            { label: "Contact Us", href: "#" },
        ],
    },
    {
        title: "Legal",
        links: [
            { label: "Privacy Policy", href: "#" },
            { label: "Terms of Service", href: "#" },
            { label: "EULA", href: "#" },
        ],
    },
];
function Twitter(props) {
    return (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: _jsx("path", { d: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" }) }));
}
function Youtube(props) {
    return (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: [_jsx("path", { d: "M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" }), _jsx("path", { d: "m10 15 5-3-5-3z" })] }));
}
function Twitch(props) {
    return (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: _jsx("path", { d: "M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7" }) }));
}
function Github(props) {
    return (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: [_jsx("path", { d: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" }), _jsx("path", { d: "M9 18c-4.51 2-5-2-7-2" })] }));
}
const socials = [
    { label: "Twitter / X", icon: Twitter, href: "#" },
    { label: "YouTube", icon: Youtube, href: "#" },
    { label: "Twitch", icon: Twitch, href: "#" },
    { label: "GitHub", icon: Github, href: "#" },
];
export function Footer() {
    const year = new Date().getFullYear();
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    function handleSubscribe(e) {
        e.preventDefault();
        if (!email)
            return;
        setSubscribed(true);
        setEmail("");
    }
    return (_jsxs("footer", { className: "bg-background border-t border-border relative overflow-hidden", children: [_jsx("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent", "aria-hidden": "true" }), _jsxs("div", { className: "container mx-auto px-6 pt-16 pb-8 relative z-10", children: [_jsx("div", { className: "mb-12 pb-12 border-b border-border/50", children: _jsxs("div", { className: "max-w-lg mx-auto text-center", children: [_jsx("h3", { className: "text-2xl md:text-3xl font-heading text-primary mb-2", children: "Stay in the Realm" }), _jsx("p", { className: "text-sm text-text-secondary font-body mb-6", children: "Get patch notes, event announcements, and exclusive lore delivered to your inbox." }), subscribed ? (_jsx(motion.p, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, className: "text-accent-green font-body text-sm", children: "You're subscribed! Watch your inbox for the next dispatch." })) : (_jsxs("form", { onSubmit: handleSubscribe, className: "flex gap-2 max-w-sm mx-auto", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx(Mail, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "Enter your email", required: true, "aria-label": "Email for newsletter", className: "w-full bg-surface border border-border rounded-sm pl-10 pr-3 py-2.5 text-sm text-text-primary font-body placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors" })] }), _jsx("button", { type: "submit", className: "bg-primary text-background px-4 rounded-sm hover:bg-primary-hover transition-colors", "aria-label": "Subscribe to newsletter", children: _jsx(ArrowRight, { className: "w-4 h-4" }) })] }))] }) }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-8 mb-10", children: columns.map((col) => (_jsxs("div", { children: [_jsx("h4", { className: "text-text-primary font-heading text-xl mb-4", children: col.title }), _jsx("ul", { className: "space-y-2", children: col.links.map((link) => (_jsx("li", { children: _jsxs(Link, { href: link.href, className: "text-sm text-text-secondary hover:text-primary transition-colors font-body relative inline-block group", children: [link.label, _jsx("span", { className: "absolute -bottom-0.5 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" })] }) }, link.label))) })] }, col.title))) }), _jsxs("div", { className: "border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-text-muted font-body", children: [_jsxs("p", { children: ["\u00A9 ", year, " LEGEND STUDIO. All rights reserved."] }), _jsx("div", { className: "flex items-center gap-4", children: socials.map((s) => (_jsx(Link, { href: s.href, "aria-label": s.label, className: "text-text-muted hover:text-primary transition-colors", children: _jsx(s.icon, { className: "w-4 h-4" }) }, s.label))) })] })] })] }));
}
//# sourceMappingURL=Footer.js.map