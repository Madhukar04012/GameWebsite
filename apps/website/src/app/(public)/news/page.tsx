"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, User, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";

interface Article {
  tag: string;
  date: string;
  title: string;
  excerpt: string;
  author: string;
  readTime: string;
  featured?: boolean;
}

const articles: Article[] = [
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

const tagColors: Record<string, string> = {
  Update: "bg-primary text-background",
  Event: "bg-accent-purple text-white",
  "Dev Blog": "bg-accent-blue text-white",
  Announcement: "bg-accent-green text-white",
  Community: "bg-accent-red text-white",
};

function TagBadge({ tag }: { tag: string }) {
  const colorClass = tagColors[tag] || "bg-surface text-text-secondary";
  return (
    <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded-sm ${colorClass}`}>
      {tag}
    </span>
  );
}

function ArticleCard({ article, index }: { article: Article; index: number }) {
  if (article.featured) {
    return (
      <AnimatedSection key={article.title} variant="fade-up" className="md:col-span-2 lg:col-span-3">
        <motion.article
          whileHover={{ y: -4 }}
          className="relative h-[24rem] md:h-[28rem] rounded-lg overflow-hidden group cursor-pointer border border-border bg-card"
        >
          {/* Banner background */}
          <div className="absolute inset-0 bg-surface">
            <div className="absolute inset-0 opacity-[0.05]"
              style={{
                background:
                  "radial-gradient(ellipse at 30% 30%, rgba(212,175,55,0.3) 0%, transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(212,175,55,0.15) 0%, transparent 60%)",
              }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

          {/* Featured badge */}
          <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
            <TagBadge tag={article.tag} />
            <span className="text-xs uppercase tracking-widest text-primary font-body flex items-center gap-1 bg-background/50 px-2 py-1 rounded-sm border border-primary/20">
              <Sparkles className="w-3 h-3" />
              Featured
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
            <span className="text-xs text-text-muted font-body mb-2 block">{article.date}</span>
            <h2 className="text-3xl md:text-4xl font-heading text-white group-hover:text-primary transition-colors mb-3">
              {article.title}
            </h2>
            <p className="text-sm text-text-secondary font-body max-w-2xl mb-4">
              {article.excerpt}
            </p>
            <div className="flex items-center gap-4 text-xs text-text-muted font-body mb-4">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {article.author}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {article.readTime}
              </span>
            </div>
            <Link
              href="#"
              className="text-primary font-body text-xs uppercase tracking-wider hover:text-white transition-colors inline-flex items-center gap-1 group/link"
            >
              Read Full Article
              <ArrowRight className="w-3 h-3 transition-transform group-hover/link:translate-x-1" />
            </Link>
          </div>
        </motion.article>
      </AnimatedSection>
    );
  }

  return (
    <AnimatedSection key={article.title} variant="fade-up" delay={index * 0.05}>
      <motion.article
        whileHover={{ y: -4 }}
        className="bg-card border border-border rounded-lg overflow-hidden cursor-pointer group h-full flex flex-col"
      >
        {/* Banner placeholder */}
        <div className="h-44 bg-surface relative flex items-center justify-center overflow-hidden">
          <div className="absolute top-4 left-4 z-10">
            <TagBadge tag={article.tag} />
          </div>
          <motion.span
            className="text-text-muted font-heading text-5xl opacity-10 select-none group-hover:scale-110 transition-transform duration-500"
            aria-hidden="true"
          >
            {article.tag}
          </motion.span>
          {/* Hover overlay */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background:
                "radial-gradient(circle at center, rgba(212,175,55,0.08) 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <span className="text-text-muted text-xs font-body mb-2">{article.date}</span>
          <h3 className="text-xl font-heading text-white mb-2 group-hover:text-primary transition-colors leading-tight">
            {article.title}
          </h3>
          <p className="text-text-secondary font-body text-sm leading-relaxed mb-4 flex-1">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-3 text-xs text-text-muted font-body mb-3">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {article.author}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTime}
            </span>
          </div>
          <Link
            href="#"
            className="text-primary font-body text-xs uppercase tracking-wider hover:text-white transition-colors inline-flex items-center gap-1 group/link"
          >
            Read More
            <ChevronRight className="w-3 h-3 transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
      </motion.article>
    </AnimatedSection>
  );
}

export default function NewsPage() {
  const [filter, setFilter] = useState<string>("All");

  const tags = ["All", ...Array.from(new Set(articles.map((a) => a.tag)))];
  const filtered = filter === "All" ? articles : articles.filter((a) => a.tag === filter);

  return (
    <div className="pt-24 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-6">
        {/* Header + Filters */}
        <AnimatedSection className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl md:text-8xl font-heading text-primary mb-4">
              Latest News
            </h1>
            <p className="text-lg md:text-xl text-text-secondary font-subheading">
              Updates from the realm — patch notes, events, and developer insights.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            {tags.map((tag) => (
              <Button
                key={tag}
                variant={filter === tag ? "primary" : "outline"}
                size="sm"
                onClick={() => setFilter(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </AnimatedSection>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((article, index) => (
            <ArticleCard key={article.title} article={article} index={index} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 text-text-muted font-body">
              No posts in this category yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
