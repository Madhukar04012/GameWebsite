"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mountain, Trees, Droplets, Wind, CloudMoon, Castle, MapPin, Compass, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { InteractiveMap } from "@/components/ui/InteractiveMap";

const regions = [
  {
    name: "Kingdom of Aether",
    biome: "Civilization",
    difficulty: "Medium",
    population: "Dense",
    worldBoss: "The Iron Sentinel",
    guild: "Eternal Dawn",
    lore: "The heart of human ambition. Marble spires pierce the clouds while merchants hawk wares from every corner of the known world. The Crown maintains order, but shadows gather in the alleys below.",
    icon: Castle,
    image: "/images/world_aether.svg",
    locations: ["Crown's Keep", "The Grand Bazaar", "Spire of Laws", "Undercroft Markets"],
    color: "rgba(212,175,55,0.15)",
  },
  {
    name: "The Shattered Ruins",
    biome: "Desolation",
    difficulty: "Hard",
    population: "Sparse",
    worldBoss: "The Lich King",
    guild: "Shadow Pact",
    lore: "Once a gleaming civilization, now a graveyard of stone and bone. The ruins pulse with trapped magic — ancient wards still hum beneath the rubble. Treasure hunters enter; few return.",
    icon: Mountain,
    image: "/images/world_shattered_ruins.svg",
    locations: ["Obsidian Gate", "Fallen Spire", "The Echoing Vaults", "Bone Market"],
    color: "rgba(239,68,68,0.12)",
  },
  {
    name: "Frostveil Tundra",
    biome: "Arctic",
    difficulty: "Medium",
    population: "Nomadic",
    worldBoss: "The Frost Wyrm",
    guild: "Iron Legion",
    lore: "Endless white stretches under skies that burn green with celestial fire. The frozen sea hides cities entombed in ice, and the howling wind carries whispers of slumbering giants.",
    icon: CloudMoon,
    image: "/images/world_frostveil.svg",
    locations: ["Icewall City", "Frozen Sea", "Aurora Peaks", "Wyrm's Rest"],
    color: "rgba(93,174,255,0.12)",
  },
  {
    name: "Verdant Wastes",
    biome: "Forest",
    difficulty: "Easy",
    population: "Scattered",
    worldBoss: "The Ancient Treant",
    guild: "Freeblades",
    lore: "The ancient woods remember what men forgot. Trees tower so tall their crowns blot out the sun, and the deep groves are patrolled by druidic wardens who suffer no trespass.",
    icon: Trees,
    image: "/images/world_verdant.svg",
    locations: ["The Deepwood", "Sunken Cathedral", "Druid's Circle", "Canopy Bridge"],
    color: "rgba(34,197,94,0.12)",
  },
  {
    name: "The Endless Deep",
    biome: "Ocean",
    difficulty: "Hard",
    population: "Unknown",
    worldBoss: "Leviathan",
    guild: "Shadow Pact",
    lore: "An ocean of liquid night where strange bioluminescent life drifts through the abyss. Sunken kingdoms lie beneath, their domes still lit by crystals that never dim.",
    icon: Droplets,
    image: "/images/world_deep.svg",
    locations: ["Abyssal Trench", "Coral Palace", "The Drowned Armada", "Leviathan's Path"],
    color: "rgba(56,189,248,0.12)",
  },
  {
    name: "Celestial Archipelago",
    biome: "Sky Islands",
    difficulty: "Expert",
    population: "Sacred",
    worldBoss: "The Storm Titan",
    guild: "Eternal Dawn",
    lore: "Islands torn from the earth and suspended by primordial magic. Each island holds a fragment of an ancient power. The winds here speak — and they remember everything.",
    icon: Wind,
    image: "/images/world_archipelago.svg",
    locations: ["Skyhaven City", "The Aetherial Bridge", "Storm Forge", "Cloud Garden"],
    color: "rgba(168,85,247,0.12)",
  },
];

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <span className="text-[10px] uppercase tracking-wider text-text-muted font-body">
      {label}: <span className="text-text-secondary">{value}</span>
    </span>
  );
}

export default function WorldPage() {
  return (
    <div className="pt-24 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-6">
        {/* Header */}
        <AnimatedSection className="mb-16 text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-8xl font-heading text-primary mb-4">
            The World
          </h1>
          <p className="text-lg md:text-xl text-text-secondary font-subheading">
            Six unique biomes, each with its own history, dangers, and secrets.
            Choose your starting region wisely — it shapes your journey.
          </p>
        </AnimatedSection>

        {/* Stats bar */}
        <AnimatedSection variant="fade-up" delay={0.2} className="mb-12">
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-center bg-card border border-border rounded-lg px-8 py-4">
            {[
              { label: "Regions", value: "6" },
              { label: "World Bosses", value: "6" },
              { label: "Dungeons", value: "24+" },
              { label: "Explorable Area", value: "400 km²" },
            ].map((s) => (
              <div key={s.label}>
                <span className="block text-2xl font-heading text-primary">{s.value}</span>
                <span className="text-xs uppercase tracking-widest text-text-muted font-body">{s.label}</span>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Region Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {regions.map((region, index) => (
            <AnimatedSection
              key={region.name}
              variant="fade-up"
              delay={index * 0.08}
            >
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="relative h-[30rem] rounded-lg overflow-hidden group cursor-pointer border border-border bg-card"
              >
                {/* Image Background */}
                <Image
                  src={region.image}
                  alt={region.name}
                  fill
                  priority={index < 2}
                  className="object-cover transition-all duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-85"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />

                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/20 to-transparent" />

                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${region.color} 0%, transparent 70%)`,
                  }}
                  aria-hidden="true"
                />

                {/* Icon */}
                <div className="absolute top-6 left-6 w-12 h-12 rounded-full bg-background/60 backdrop-blur-md flex items-center justify-center border border-border/50 z-10">
                  <region.icon className="w-6 h-6 text-primary" />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-4xl font-heading text-white group-hover:text-primary transition-colors">
                      {region.name}
                    </h2>
                    <span className="text-xs uppercase tracking-widest text-text-muted font-body bg-background/50 px-2 py-1 rounded-sm border border-border">
                      {region.biome}
                    </span>
                  </div>

                  {/* Stat pills */}
                  <div className="flex flex-wrap gap-3 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <StatPill label="Difficulty" value={region.difficulty} />
                    <StatPill label="Population" value={region.population} />
                    <StatPill label="World Boss" value={region.worldBoss} />
                    <StatPill label="Guild" value={region.guild} />
                  </div>

                  <p className="text-text-secondary font-body text-sm mb-4 max-w-xl opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    {region.lore}
                  </p>

                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                    <div className="flex flex-wrap gap-2">
                      {region.locations.map((loc) => (
                        <span
                          key={loc}
                          className="text-xs font-body text-primary bg-primary/10 px-2 py-1 rounded-sm border border-primary/20 flex items-center gap-1"
                        >
                          <MapPin className="w-3 h-3" />
                          {loc}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Explore button */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <Button variant="outline" size="sm">
                      <Compass className="w-3.5 h-3.5" />
                      Explore {region.name}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        {/* Interactive Map */}
        <AnimatedSection variant="fade-up" className="mt-20">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-6xl font-heading text-primary mb-4">
              World Map
            </h2>
            <p className="text-text-secondary font-subheading text-base md:text-lg">
              Click the markers to explore each region&apos;s details.
            </p>
          </div>
          <InteractiveMap />
        </AnimatedSection>
      </div>
    </div>
  );
}
