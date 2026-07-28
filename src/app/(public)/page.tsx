"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, ChevronRight, Play, ArrowDown, Compass, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { useMousePosition } from "@/hooks/useMousePosition";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ── Hero parallax layer ── */

function HeroSection() {
  const { scrollY } = useScroll();
  const reduced = useReducedMotion();
  const mouse = useMousePosition();

  const bgY = useTransform(scrollY, [0, 800], [0, 200]);
  const fogY = useTransform(scrollY, [0, 800], [0, -80]);
  const titleY = useTransform(scrollY, [0, 500], [0, 100]);
  const titleOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const parallaxX = reduced ? 0 : mouse.normX * 12;
  const parallaxY = reduced ? 0 : mouse.normY * 8;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Ken Burns background image */}
      <motion.div
        className="absolute inset-0"
        style={{ y: bgY }}
      >
        <motion.div
          className="absolute inset-0"
          animate={reduced ? {} : { scale: [1, 1.08, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/images/hero_world_keyart.svg"
            alt=""
            fill
            priority
            className="object-cover opacity-40"
            sizes="100vw"
          />
        </motion.div>
        {/* Vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 to-transparent" />
      </motion.div>

      {/* Fog layer */}
      {!reduced && (
        <motion.div
          className="absolute inset-0 opacity-[0.12] pointer-events-none"
          style={{ y: fogY }}
          aria-hidden="true"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 50% at 30% 70%, rgba(212,175,55,0.3) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 70% 60%, rgba(212,175,55,0.15) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
        </motion.div>
      )}

      {/* Hero content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        style={{ y: titleY, opacity: titleOpacity }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 bg-primary-muted border border-primary/20 rounded-full px-4 py-1.5 mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-primary text-xs uppercase tracking-widest font-body">
            Open Beta — Play Now
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-8xl md:text-[10rem] lg:text-[12rem] font-heading text-primary leading-[0.85] tracking-tight mb-6"
          style={{ transform: `translate(${parallaxX * -0.02}px, ${parallaxY * -0.02}px)` }}
        >
          LEGEND
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-2xl text-text-secondary font-subheading max-w-2xl mx-auto mb-10"
          style={{ transform: `translate(${parallaxX * -0.01}px, ${parallaxY * -0.01}px)` }}
        >
          A living world shaped by every player.
          <br />
          <span className="text-primary">Forge your legend.</span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button variant="primary" size="lg">
            <Play className="w-5 h-5" />
            Play Free Now
          </Button>
          <Link
            href="/world"
            className="inline-flex items-center gap-2 font-heading uppercase tracking-wider rounded-sm px-8 py-4 text-2xl transition-all duration-300 ease-out bg-transparent text-primary border border-primary hover:bg-primary hover:text-background"
          >
            <Compass className="w-5 h-5" />
            Explore the World
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      {!reduced && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-widest text-text-muted font-body">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="w-4 h-4 text-text-muted" />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}

/* ── World Regions Section ── */

const worldRegions = [
  {
    name: "Kingdom of Aether",
    biome: "Civilization",
    lore: "The heart of human ambition. White marble spires pierce the skies while grand cathedrals overlook prosperous markets.",
    image: "/images/world_aether.svg",
  },
  {
    name: "The Shattered Ruins",
    biome: "Desolation",
    lore: "A graveyard of ancient stone and floating crimson crystals where dark magic still echoes through forgotten temples.",
    image: "/images/world_shattered_ruins.svg",
  },
  {
    name: "Frostveil Tundra",
    biome: "Arctic",
    lore: "Endless white plains under aurora-lit skies. Ancient ice entombs civilizations lost to time.",
    image: "/images/world_frostveil.svg",
  },
  {
    name: "Verdant Wastes",
    biome: "Forest",
    lore: "Ancient groves where trees blot out the sun and druidic wardens guard secrets older than mankind.",
    image: "/images/world_verdant.svg",
  },
  {
    name: "The Endless Deep",
    biome: "Ocean",
    lore: "Bioluminescent abyss hiding sunken kingdoms. Strange life drifts through liquid night.",
    image: "/images/world_deep.svg",
  },
  {
    name: "Celestial Archipelago",
    biome: "Sky Islands",
    lore: "Islands suspended by primordial magic. Each holds a fragment of ancient power.",
    image: "/images/world_archipelago.svg",
  },
];

function WorldRegionsSection() {
  const reduced = useReducedMotion();

  return (
    <section className="py-24 md:py-32 bg-background relative">
      {/* Section glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(212,175,55,0.15) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-heading text-primary mb-4">
            Explore the Realm
          </h2>
          <p className="text-lg md:text-xl text-text-secondary font-subheading">
            Six distinct regions await. Each holds its own history, dangers, and untold treasures.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {worldRegions.map((region, i) => (
            <AnimatedSection
              key={region.name}
              variant={reduced ? "fade-up" : "fade-up"}
              delay={i * 0.08}
              className="group relative h-72 md:h-80 rounded-lg overflow-hidden border border-border bg-card cursor-pointer"
              as="article"
            >
              <Image
                src={region.image}
                alt={region.name}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(212,175,55,0.12) 0%, transparent 70%)",
                }}
                aria-hidden="true"
              />

              <div className="absolute bottom-0 inset-x-0 p-6">
                <span className="text-xs uppercase tracking-widest text-primary font-body bg-background/70 px-2 py-0.5 rounded border border-primary/20 mb-2 inline-block">
                  {region.biome}
                </span>
                <h3 className="text-2xl font-heading text-white group-hover:text-primary transition-colors mb-2">
                  {region.name}
                </h3>
                <p className="text-xs text-text-secondary font-body opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 line-clamp-2">
                  {region.lore}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.3} className="text-center mt-12">
          <Link
            href="/world"
            className="inline-flex items-center gap-2 font-heading uppercase tracking-wider rounded-sm px-6 py-3 text-lg transition-all duration-300 ease-out bg-transparent text-primary border border-primary hover:bg-primary hover:text-background"
          >
            <Compass className="w-4 h-4" />
            Discover All Regions
            <ChevronRight className="w-4 h-4" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ── CTA Section ── */

function CTASection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,175,55,0.4) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <AnimatedSection variant="scale">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-heading text-primary mb-6">
            Your Story Starts Today
          </h2>
          <p className="text-lg md:text-xl text-text-secondary font-subheading max-w-2xl mx-auto mb-10">
            Join millions of players in a world that evolves with every decision.
            No two journeys are the same.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" size="lg">
              <Play className="w-5 h-5" />
              Play Free Now
            </Button>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 font-heading uppercase tracking-wider rounded-sm px-6 py-3 text-lg transition-all duration-300 ease-out bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface"
            >
              <ScrollText className="w-5 h-5" />
              Latest News
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ── Page Export ── */

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WorldRegionsSection />
      <CTASection />
    </>
  );
}
