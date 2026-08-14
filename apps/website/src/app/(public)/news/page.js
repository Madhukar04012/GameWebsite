"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, User, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";
const articles = [
    {
        tag: "Update",
        date: "Oct 12, 2026",
        title: "Patch 1.1: The Awakening",
        excerpt: "Massive update bringing the new Frostveil Tundra zone, guild hall upgrades, and a reworked crafting system. Read the full patch notes.",
        author: "Dev Team",
        readTime: "6 min read",
        featured: true,
    },
    {
        tag: "Event",
        date: "Oct 10, 2026",
        title: "Guild Tournament Registration Open",
        excerpt: "The annual Guild Tournament begins next month. Register your guild for a chance at the Grand Warden title and exclusive rewards.",
        author: "Community Team",
        readTime: "3 min read",
    },
    {
        tag: "Dev Blog",
        date: "Oct 5, 2026",
        title: "Balancing the Economy",
        excerpt: "Lead systems designer breaks down the upcoming economic changes — inflation fixes, new trade routes, and player-driven pricing.",
        author: "Lead Designer",
        readTime: "8 min read",
    },
    {
        tag: "Announcement",
        date: "Sep 28, 2026",
        title: "New Player Guide: Getting Started",
        excerpt: "Everything you need to know before stepping into the world. Our comprehensive beginner's guide covers classes, questing, and survival.",
        author: "Player Experience",
        readTime: "5 min read",
    },
    {
        tag: "Community",
        date: "Sep 20, 2026",
        title: "Fan Art Contest Winners",
        excerpt: "Over 500 entries made this our biggest contest yet. See the winning artwork that will be featured in the game's loading screens.",
        author: "Community Team",
        readTime: "2 min read",
    },
    {
        tag: "Update",
        date: "Sep 15, 2026",
        title: "Performance Optimization Patch",
        excerpt: "Major engine improvements delivering up to 40% higher frame rates in crowded areas. Full technical breakdown inside.",
        author: "Engineering",
        readTime: "4 min read",
    },
    {
        tag: "Dev Blog",
        date: "Sep 8, 2026",
        title: "Designing the Shattered Ruins",
        excerpt: "Art director walks through the creative process behind our most atmospheric zone — from concept art to final render.",
        author: "Art Director",
        readTime: "7 min read",
    },
];
const tagColors = {
    Update: "bg-primary text-background",
    Event: "bg-accent-purple text-white",
    "Dev Blog": "bg-accent-blue text-white",
    Announcement: "bg-accent-green text-white",
    Community: "bg-accent-red text-white",
};
function TagBadge({ tag }) {
    const colorClass = tagColors[tag] || "bg-surface text-text-secondary";
    return (_jsx("span", { className: `text-xs font-bold uppercase px-2.5 py-1 rounded-sm ${colorClass}`, children: tag }));
}
function ArticleCard({ article, index }) {
    if (article.featured) {
        return (_jsx(AnimatedSection, { variant: "fade-up", className: "md:col-span-2 lg:col-span-3", children: _jsxs(motion.article, { whileHover: { y: -4 }, className: "relative h-[24rem] md:h-[28rem] rounded-lg overflow-hidden group cursor-pointer border border-border bg-card", children: [_jsx("div", { className: "absolute inset-0 bg-surface", children: _jsx("div", { className: "absolute inset-0 opacity-[0.05]", style: {
                                background: "radial-gradient(ellipse at 30% 30%, rgba(212,175,55,0.3) 0%, transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(212,175,55,0.15) 0%, transparent 60%)",
                            } }) }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" }), _jsxs("div", { className: "absolute top-6 left-6 z-10 flex items-center gap-2", children: [_jsx(TagBadge, { tag: article.tag }), _jsxs("span", { className: "text-xs uppercase tracking-widest text-primary font-body flex items-center gap-1 bg-background/50 px-2 py-1 rounded-sm border border-primary/20", children: [_jsx(Sparkles, { className: "w-3 h-3" }), "Featured"] })] }), _jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-8 z-10", children: [_jsx("span", { className: "text-xs text-text-muted font-body mb-2 block", children: article.date }), _jsx("h2", { className: "text-3xl md:text-4xl font-heading text-white group-hover:text-primary transition-colors mb-3", children: article.title }), _jsx("p", { className: "text-sm text-text-secondary font-body max-w-2xl mb-4", children: article.excerpt }), _jsxs("div", { className: "flex items-center gap-4 text-xs text-text-muted font-body mb-4", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(User, { className: "w-3 h-3" }), article.author] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Clock, { className: "w-3 h-3" }), article.readTime] })] }), _jsxs(Link, { href: "#", className: "text-primary font-body text-xs uppercase tracking-wider hover:text-white transition-colors inline-flex items-center gap-1 group/link", children: ["Read Full Article", _jsx(ArrowRight, { className: "w-3 h-3 transition-transform group-hover/link:translate-x-1" })] })] })] }) }, article.title));
    }
    return (_jsx(AnimatedSection, { variant: "fade-up", delay: index * 0.05, children: _jsxs(motion.article, { whileHover: { y: -4 }, className: "bg-card border border-border rounded-lg overflow-hidden cursor-pointer group h-full flex flex-col", children: [_jsxs("div", { className: "h-44 bg-surface relative flex items-center justify-center overflow-hidden", children: [_jsx("div", { className: "absolute top-4 left-4 z-10", children: _jsx(TagBadge, { tag: article.tag }) }), _jsx(motion.span, { className: "text-text-muted font-heading text-5xl opacity-10 select-none group-hover:scale-110 transition-transform duration-500", "aria-hidden": "true", children: article.tag }), _jsx("div", { className: "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500", style: {
                                background: "radial-gradient(circle at center, rgba(212,175,55,0.08) 0%, transparent 70%)",
                            }, "aria-hidden": "true" })] }), _jsxs("div", { className: "p-6 flex-1 flex flex-col", children: [_jsx("span", { className: "text-text-muted text-xs font-body mb-2", children: article.date }), _jsx("h3", { className: "text-xl font-heading text-white mb-2 group-hover:text-primary transition-colors leading-tight", children: article.title }), _jsx("p", { className: "text-text-secondary font-body text-sm leading-relaxed mb-4 flex-1", children: article.excerpt }), _jsxs("div", { className: "flex items-center gap-3 text-xs text-text-muted font-body mb-3", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(User, { className: "w-3 h-3" }), article.author] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Clock, { className: "w-3 h-3" }), article.readTime] })] }), _jsxs(Link, { href: "#", className: "text-primary font-body text-xs uppercase tracking-wider hover:text-white transition-colors inline-flex items-center gap-1 group/link", children: ["Read More", _jsx(ChevronRight, { className: "w-3 h-3 transition-transform group-hover/link:translate-x-1" })] })] })] }) }, article.title));
}
export default function NewsPage() {
    const [filter, setFilter] = useState("All");
    const tags = ["All", ...Array.from(new Set(articles.map((a) => a.tag)))];
    const filtered = filter === "All" ? articles : articles.filter((a) => a.tag === filter);
    return (_jsx("div", { className: "pt-24 pb-24 bg-background min-h-screen", children: _jsxs("div", { className: "container mx-auto px-6", children: [_jsxs(AnimatedSection, { className: "mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-5xl md:text-8xl font-heading text-primary mb-4", children: "Latest News" }), _jsx("p", { className: "text-lg md:text-xl text-text-secondary font-subheading", children: "Updates from the realm \u2014 patch notes, events, and developer insights." })] }), _jsx("div", { className: "mt-4 md:mt-0 flex flex-wrap gap-3", children: tags.map((tag) => (_jsx(Button, { variant: filter === tag ? "primary" : "outline", size: "sm", onClick: () => setFilter(tag), children: tag }, tag))) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: [filtered.map((article, index) => (_jsx(ArticleCard, { article: article, index: index }, article.title))), filtered.length === 0 && (_jsx("div", { className: "col-span-full text-center py-16 text-text-muted font-body", children: "No posts in this category yet." }))] })] }) }));
}
//# sourceMappingURL=page.js.map