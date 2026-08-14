import { type LucideIcon } from "lucide-react";
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
export declare const WORLD_REGIONS: WorldRegion[];
//# sourceMappingURL=worldRegions.d.ts.map