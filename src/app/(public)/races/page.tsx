"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Swords, Heart, Eye, Zap, Shield, Ghost, Star } from "lucide-react";
import { TiltCard } from "@/components/ui/TiltCard";
import { AnimatedStatBar } from "@/components/ui/AnimatedStatBar";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const races = [
  {
    name: "Humans",
    desc: "Adaptable and ambitious. Humans excel at diplomacy and warfare alike, their white marble cities acting as melting pots for all cultures.",
    icon: Swords,
    image: "/images/race_human.svg",
    abilities: ["Inspired Leadership", "Adaptive Learning", "Iron Will"],
    stats: { str: 8, dex: 8, int: 8, cha: 10, con: 8 },
    passive: "+10% XP gain in all skills",
  },
  {
    name: "Elves",
    desc: "Ancient beings of grace and magic. Elves move like wind through ancient groves and command powers that predate human civilization.",
    icon: Eye,
    image: "/images/race_elf.svg",
    abilities: ["Arcane Sight", "Forest Walk", "Eternal Focus"],
    stats: { str: 6, dex: 10, int: 10, cha: 8, con: 6 },
    passive: "+15% mana regeneration",
  },
  {
    name: "Dwarves",
    desc: "Masters of earth and metal. Dwarven craftsmanship is legendary, and their subterranean fortresses have never fallen to siege.",
    icon: Shield,
    image: "/images/race_dwarf.svg",
    abilities: ["Stone Sense", "Hammer Mastery", "Unyielding"],
    stats: { str: 10, dex: 6, int: 7, cha: 6, con: 12 },
    passive: "+20% armor effectiveness",
  },
  {
    name: "Orcs",
    desc: "Born for battle. Orc warriors are feared across the continent for their raw strength, heavy war paint, and unbreakable resolve.",
    icon: Zap,
    image: "/images/race_orc.svg",
    abilities: ["Berserker Rage", "War Cry", "Thick Hide"],
    stats: { str: 12, dex: 7, int: 5, cha: 6, con: 10 },
    passive: "+25% melee damage at low health",
  },
  {
    name: "Riftborn",
    desc: "Touched by the chaos between worlds. Riftborn wield unstable void magic that can reshape reality — or unravel it.",
    icon: Ghost,
    image: "/images/race_riftborn.svg",
    abilities: ["Void Step", "Reality Flux", "Chaos Bolt"],
    stats: { str: 5, dex: 8, int: 12, cha: 9, con: 5 },
    passive: "Abilities have 10% chance to double-cast",
  },
  {
    name: "Beastkin",
    desc: "Descended from primal spirits. Beastkin combine human cunning with animal instincts — unmatched hunters under moonlight.",
    icon: Heart,
    image: "/images/race_beastkin.svg",
    abilities: ["Primal Senses", "Pack Hunter", "Regeneration"],
    stats: { str: 9, dex: 10, int: 6, cha: 7, con: 9 },
    passive: "+15% movement speed out of combat",
  },
];

const maxStat = 12;

export default function RacesPage() {
  return (
    <div className="pt-24 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-6">
        {/* Header */}
        <AnimatedSection className="mb-16 text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-8xl font-heading text-primary mb-4">
            Legendary Races
          </h1>
          <p className="text-lg md:text-xl text-text-secondary font-subheading">
            Choose your bloodline. Each race brings unique abilities, stat affinities,
            and a distinct place in the world&apos;s history.
          </p>
        </AnimatedSection>

        {/* Race Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {races.map((race, index) => (
            <AnimatedSection
              key={race.name}
              variant="fade-up"
              delay={index * 0.08}
            >
              <TiltCard
                maxTilt={6}
                className="bg-card border border-border rounded-lg overflow-hidden group flex flex-col justify-between h-full"
              >
                {/* Header Portrait Art */}
                <div className="h-64 relative overflow-hidden">
                  <Image
                    src={race.image}
                    alt={race.name}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                  <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-background/60 backdrop-blur-md flex items-center justify-center border border-border/50">
                    <race.icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  </div>

                  {/* Hover border glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-lg ring-1 ring-primary/0 group-hover:ring-primary/30"
                    aria-hidden="true"
                  />
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-3xl font-heading text-white mb-2 group-hover:text-primary transition-colors">
                      {race.name}
                    </h3>
                    <p className="text-text-secondary font-body text-sm mb-6 leading-relaxed">
                      {race.desc}
                    </p>

                    {/* Stats */}
                    <div className="mb-6 space-y-2">
                      {Object.entries(race.stats).map(([stat, val]) => (
                        <AnimatedStatBar
                          key={stat}
                          label={stat}
                          value={val}
                          max={maxStat}
                        />
                      ))}
                    </div>

                    {/* Abilities */}
                    <div className="mb-4">
                      <span className="text-xs uppercase tracking-widest text-text-muted font-body mb-2 block flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Abilities
                      </span>
                      <ul className="flex flex-wrap gap-2">
                        {race.abilities.map((a) => (
                          <li
                            key={a}
                            className="text-xs font-body text-white bg-surface px-2 py-1 rounded-sm border border-border"
                          >
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Passive */}
                  <div className="text-xs font-body text-primary italic border-t border-border pt-4 mt-4 flex items-center gap-1.5">
                    <Star className="w-3 h-3" />
                    Passive: {race.passive}
                  </div>
                </div>
              </TiltCard>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
}
