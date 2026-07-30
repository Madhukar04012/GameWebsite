"use client";

import { motion } from "framer-motion";
import { Swords, Users, Globe, Code, Heart, Sparkles, Target, Eye } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

const values = [
  { icon: Swords, title: "Bold Design", desc: "We take risks. The safest choice is rarely the best one." },
  { icon: Users, title: "Player First", desc: "Every decision starts with 'does this make the game better for players?'" },
  { icon: Globe, title: "Living World", desc: "The universe breathes. Players shape it, and we react." },
  { icon: Code, title: "Craftsmanship", desc: "We build for the long haul. No shortcuts, no crunch." },
  { icon: Heart, title: "Community", desc: "Our players are our partners. The best ideas come from the guild." },
  { icon: Sparkles, title: "Polish", desc: "Details matter. We ship when it's ready, not when the calendar says." },
];

const timeline = [
  { year: "2019", event: "Studio founded by a team of 4 veteran MMO developers" },
  { year: "2020", event: "Closed alpha launches with 10,000 players" },
  { year: "2021", event: "Series A funding — team grows to 40" },
  { year: "2022", event: "Open beta reaches 500,000 players worldwide" },
  { year: "2023", event: "Official launch — 2 million players in first month" },
  { year: "2024", event: "Celestial Archipelago expansion ships" },
  { year: "2025", event: "Guild Wars system overhaul and mobile app launch" },
  { year: "2026", event: "The Awakening update — biggest expansion yet" },
];

const stats = [
  { label: "Players Worldwide", value: 4500000, suffix: "+" },
  { label: "Regions Explorable", value: 6 },
  { label: "Dungeons", value: 24, suffix: "+" },
  { label: "Team Members", value: 120, suffix: "+" },
];

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Banner */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 30%, rgba(212,175,55,0.3) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 70% 60%, rgba(212,175,55,0.15) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          aria-hidden="true"
        />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <AnimatedSection>
            <h1 className="text-5xl md:text-8xl font-heading text-primary mb-4">
              About Legend
            </h1>
            <p className="text-lg md:text-xl text-text-secondary font-subheading max-w-2xl mx-auto">
              We believe in worlds worth exploring, stories worth telling, and
              games that respect your time.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Statistics Counters */}
      <section className="pb-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((s, i) => (
              <AnimatedSection key={s.label} variant="fade-up" delay={i * 0.1} className="text-center">
                <span className="block text-4xl md:text-5xl font-heading text-primary mb-1 tabular-nums">
                  <AnimatedCounter to={s.value} suffix={s.suffix || ""} delay={i * 0.15} />
                </span>
                <span className="text-xs uppercase tracking-widest text-text-muted font-body">
                  {s.label}
                </span>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24 relative">
        {/* Background artwork glow */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 50% 40% at 20% 50%, rgba(212,175,55,0.4) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 80% 50%, rgba(212,175,55,0.2) 0%, transparent 70%)",
            filter: "blur(120px)",
          }}
          aria-hidden="true"
        />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <AnimatedSection variant="fade-left" className="bg-card border border-border rounded-lg p-8">
              <div className="w-12 h-12 rounded-full bg-primary-muted border border-primary/20 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-heading text-primary mb-4">Our Mission</h2>
              <p className="text-text-secondary font-body leading-relaxed text-sm md:text-base">
                To build a living MMORPG where every player&apos;s choices matter.
                We reject the notion that massive scale requires shallow gameplay.
                Every system, every zone, every quest is designed to be meaningful.
              </p>
            </AnimatedSection>

            <AnimatedSection variant="fade-right" delay={0.1} className="bg-card border border-border rounded-lg p-8">
              <div className="w-12 h-12 rounded-full bg-primary-muted border border-primary/20 flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-heading text-primary mb-4">Our Vision</h2>
              <p className="text-text-secondary font-body leading-relaxed text-sm md:text-base">
                A persistent world that feels truly alive. Where player-driven
                economies, politics, and stories create emergent narratives no
                scriptwriter could author. Where the world remembers everything.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-surface">
        <div className="container mx-auto px-6">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-7xl font-heading text-primary mb-4">
              What We Believe
            </h2>
            <p className="text-lg md:text-xl text-text-secondary font-subheading">
              Six principles that guide every line of code and every design decision.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {values.map((item, i) => (
              <AnimatedSection key={item.title} variant="fade-up" delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-background border border-border rounded-lg p-6 h-full"
                >
                  <div className="w-10 h-10 rounded-full bg-primary-muted border border-primary/20 flex items-center justify-center mb-4">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-heading text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-text-secondary font-body leading-relaxed">{item.desc}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-7xl font-heading text-primary mb-4">
              Our Journey
            </h2>
            <p className="text-lg md:text-xl text-text-secondary font-subheading">
              From a small team with a big dream to a global phenomenon.
            </p>
          </AnimatedSection>

          {/* Timeline line */}
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-[17px] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-border" aria-hidden="true" />

            <div className="space-y-10">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`relative flex items-start gap-6 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-9 h-9 rounded-full bg-primary text-background flex items-center justify-center shrink-0 font-heading text-sm z-10 ring-4 ring-background">
                    {i + 1}
                  </div>

                  <div className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8"}`}>
                    <div className="bg-card border border-border rounded-lg p-5">
                      <span className="text-primary font-heading text-xl mr-3">{item.year}</span>
                      <span className="text-text-secondary font-body text-sm">{item.event}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
