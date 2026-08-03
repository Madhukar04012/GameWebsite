import {
  Mountain,
  Trees,
  Droplets,
  Wind,
  CloudMoon,
  Castle,
  type LucideIcon,
} from "lucide-react";

export interface WorldRegion {
  name: string;
  biome: string;
  difficulty: string;
  population: string;
  worldBoss: string;
  guild: string;
  /** Full lore copy used on /world */
  lore: string;
  /** Shorter teaser used on the home page */
  teaser: string;
  /** Compact lore used in the interactive map panel */
  mapLore: string;
  image: string;
  locations: string[];
  /** Card hover glow (world page) */
  color: string;
  /** Map marker glow */
  mapColor: string;
  icon: LucideIcon;
  /** Interactive map marker position (%) */
  x: number;
  y: number;
}

export const WORLD_REGIONS: WorldRegion[] = [
  {
    name: "Kingdom of Aether",
    biome: "Civilization",
    difficulty: "Medium",
    population: "Dense",
    worldBoss: "The Iron Sentinel",
    guild: "Eternal Dawn",
    lore: "The heart of human ambition. Marble spires pierce the clouds while merchants hawk wares from every corner of the known world. The Crown maintains order, but shadows gather in the alleys below.",
    teaser:
      "The heart of human ambition. White marble spires pierce the skies while grand cathedrals overlook prosperous markets.",
    mapLore: "The heart of human ambition. Marble spires pierce the clouds.",
    image: "/images/world_aether.svg",
    locations: ["Crown's Keep", "The Grand Bazaar", "Spire of Laws", "Undercroft Markets"],
    color: "rgba(212,175,55,0.15)",
    mapColor: "rgba(212,175,55,0.25)",
    icon: Castle,
    x: 75,
    y: 40,
  },
  {
    name: "The Shattered Ruins",
    biome: "Desolation",
    difficulty: "Hard",
    population: "Sparse",
    worldBoss: "The Lich King",
    guild: "Shadow Pact",
    lore: "Once a gleaming civilization, now a graveyard of stone and bone. The ruins pulse with trapped magic — ancient wards still hum beneath the rubble. Treasure hunters enter; few return.",
    teaser:
      "A graveyard of ancient stone and floating crimson crystals where dark magic still echoes through forgotten temples.",
    mapLore: "A graveyard of stone and bone pulsing with trapped magic.",
    image: "/images/world_shattered_ruins.svg",
    locations: ["Obsidian Gate", "Fallen Spire", "The Echoing Vaults", "Bone Market"],
    color: "rgba(239,68,68,0.12)",
    mapColor: "rgba(239,68,68,0.2)",
    icon: Mountain,
    x: 25,
    y: 55,
  },
  {
    name: "Frostveil Tundra",
    biome: "Arctic",
    difficulty: "Medium",
    population: "Nomadic",
    worldBoss: "The Frost Wyrm",
    guild: "Iron Legion",
    lore: "Endless white stretches under skies that burn green with celestial fire. The frozen sea hides cities entombed in ice, and the howling wind carries whispers of slumbering giants.",
    teaser:
      "Endless white plains under aurora-lit skies. Ancient ice entombs civilizations lost to time.",
    mapLore: "Endless white under skies lit by celestial fire.",
    image: "/images/world_frostveil.svg",
    locations: ["Icewall City", "Frozen Sea", "Aurora Peaks", "Wyrm's Rest"],
    color: "rgba(93,174,255,0.12)",
    mapColor: "rgba(93,174,255,0.2)",
    icon: CloudMoon,
    x: 50,
    y: 15,
  },
  {
    name: "Verdant Wastes",
    biome: "Forest",
    difficulty: "Easy",
    population: "Scattered",
    worldBoss: "The Ancient Treant",
    guild: "Freeblades",
    lore: "The ancient woods remember what men forgot. Trees tower so tall their crowns blot out the sun, and the deep groves are patrolled by druidic wardens who suffer no trespass.",
    teaser:
      "Ancient groves where trees blot out the sun and druidic wardens guard secrets older than mankind.",
    mapLore: "Ancient woods where trees blot out the sun.",
    image: "/images/world_verdant.svg",
    locations: ["The Deepwood", "Sunken Cathedral", "Druid's Circle", "Canopy Bridge"],
    color: "rgba(34,197,94,0.12)",
    mapColor: "rgba(34,197,94,0.2)",
    icon: Trees,
    x: 80,
    y: 70,
  },
  {
    name: "The Endless Deep",
    biome: "Ocean",
    difficulty: "Hard",
    population: "Unknown",
    worldBoss: "Leviathan",
    guild: "Shadow Pact",
    lore: "An ocean of liquid night where strange bioluminescent life drifts through the abyss. Sunken kingdoms lie beneath, their domes still lit by crystals that never dim.",
    teaser:
      "Bioluminescent abyss hiding sunken kingdoms. Strange life drifts through liquid night.",
    mapLore: "An ocean of liquid night with sunken kingdoms below.",
    image: "/images/world_deep.svg",
    locations: ["Abyssal Trench", "Coral Palace", "The Drowned Armada", "Leviathan's Path"],
    color: "rgba(56,189,248,0.12)",
    mapColor: "rgba(56,189,248,0.2)",
    icon: Droplets,
    x: 15,
    y: 80,
  },
  {
    name: "Celestial Archipelago",
    biome: "Sky Islands",
    difficulty: "Expert",
    population: "Sacred",
    worldBoss: "The Storm Titan",
    guild: "Eternal Dawn",
    lore: "Islands torn from the earth and suspended by primordial magic. Each island holds a fragment of an ancient power. The winds here speak — and they remember everything.",
    teaser:
      "Islands suspended by primordial magic. Each holds a fragment of ancient power.",
    mapLore: "Islands suspended by primordial magic in the heavens.",
    image: "/images/world_archipelago.svg",
    locations: ["Skyhaven City", "The Aetherial Bridge", "Storm Forge", "Cloud Garden"],
    color: "rgba(168,85,247,0.12)",
    mapColor: "rgba(168,85,247,0.2)",
    icon: Wind,
    x: 55,
    y: 60,
  },
];
