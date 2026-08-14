"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mountain, Trees, Droplets, Wind, CloudMoon, Castle, X, MapPin, Swords, Users, Skull } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
const regions = [
    {
        name: "Kingdom of Aether",
        biome: "Civilization",
        image: "/images/world_aether.svg",
        difficulty: "Medium",
        population: "Dense",
        worldBoss: "The Iron Sentinel",
        guild: "Eternal Dawn",
        lore: "The heart of human ambition. Marble spires pierce the clouds.",
        color: "rgba(212,175,55,0.25)",
        icon: Castle,
        x: 75,
        y: 40,
    },
    {
        name: "The Shattered Ruins",
        biome: "Desolation",
        image: "/images/world_shattered_ruins.svg",
        difficulty: "Hard",
        population: "Sparse",
        worldBoss: "The Lich King",
        guild: "Shadow Pact",
        lore: "A graveyard of stone and bone pulsing with trapped magic.",
        color: "rgba(239,68,68,0.2)",
        icon: Mountain,
        x: 25,
        y: 55,
    },
    {
        name: "Frostveil Tundra",
        biome: "Arctic",
        image: "/images/world_frostveil.svg",
        difficulty: "Medium",
        population: "Nomadic",
        worldBoss: "The Frost Wyrm",
        guild: "Iron Legion",
        lore: "Endless white under skies lit by celestial fire.",
        color: "rgba(93,174,255,0.2)",
        icon: CloudMoon,
        x: 50,
        y: 15,
    },
    {
        name: "Verdant Wastes",
        biome: "Forest",
        image: "/images/world_verdant.svg",
        difficulty: "Easy",
        population: "Scattered",
        worldBoss: "The Ancient Treant",
        guild: "Freeblades",
        lore: "Ancient woods where trees blot out the sun.",
        color: "rgba(34,197,94,0.2)",
        icon: Trees,
        x: 80,
        y: 70,
    },
    {
        name: "The Endless Deep",
        biome: "Ocean",
        image: "/images/world_deep.svg",
        difficulty: "Hard",
        population: "Unknown",
        worldBoss: "Leviathan",
        guild: "Shadow Pact",
        lore: "An ocean of liquid night with sunken kingdoms below.",
        color: "rgba(56,189,248,0.2)",
        icon: Droplets,
        x: 15,
        y: 80,
    },
    {
        name: "Celestial Archipelago",
        biome: "Sky Islands",
        image: "/images/world_archipelago.svg",
        difficulty: "Expert",
        population: "Sacred",
        worldBoss: "The Storm Titan",
        guild: "Eternal Dawn",
        lore: "Islands suspended by primordial magic in the heavens.",
        color: "rgba(168,85,247,0.2)",
        icon: Wind,
        x: 55,
        y: 60,
    },
];
export function InteractiveMap({ className = "" }) {
    const [selected, setSelected] = useState(null);
    const [hovered, setHovered] = useState(null);
    const reduced = useReducedMotion();
    return (_jsxs("div", { className: `relative w-full aspect-[2/1] bg-card border border-border rounded-lg overflow-hidden ${className}`, children: [_jsx("div", { className: "absolute inset-0 opacity-[0.03]", style: {
                    backgroundImage: "radial-gradient(circle, rgba(212,175,55,0.3) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                }, "aria-hidden": "true" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-background via-surface to-background" }), _jsx("svg", { className: "absolute inset-0 w-full h-full", "aria-hidden": "true", children: regions.map((r) => (regions.filter(o => o.name !== r.name).slice(0, 2).map((o) => (_jsx("line", { x1: `${r.x}%`, y1: `${r.y}%`, x2: `${o.x}%`, y2: `${o.y}%`, stroke: hovered === r.name ? r.color : "rgba(255,255,255,0.03)", strokeWidth: "1", className: "transition-colors duration-500" }, `${r.name}-${o.name}`))))) }), regions.map((region) => {
                const Icon = region.icon;
                const isActive = selected?.name === region.name;
                const isHovered = hovered === region.name;
                return (_jsxs(motion.button, { onMouseEnter: () => setHovered(region.name), onMouseLeave: () => setHovered(null), onClick: () => setSelected(isActive ? null : region), className: "absolute z-10", style: { left: `${region.x}%`, top: `${region.y}%`, transform: "translate(-50%, -50%)" }, whileHover: reduced ? {} : { scale: 1.15 }, whileTap: { scale: 0.95 }, "aria-label": `Explore ${region.name}`, children: [_jsx("div", { className: `w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 ${isActive
                                ? "bg-primary text-background shadow-gold-lg scale-110"
                                : isHovered
                                    ? "bg-primary/20 text-primary border-primary/50 scale-110"
                                    : "bg-background/80 text-text-secondary border-border hover:border-primary/50 hover:text-primary"} border backdrop-blur-sm`, children: _jsx(Icon, { className: "w-5 h-5 md:w-6 h-6" }) }), _jsx(AnimatePresence, { children: (isHovered || isActive) && (_jsx(motion.span, { initial: { opacity: 0, y: 4 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 4 }, className: "absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap text-xs font-body text-white bg-background/90 backdrop-blur-sm px-2 py-1 rounded border border-border pointer-events-none", children: region.name })) }), isActive && (_jsx(motion.div, { className: "absolute inset-0 rounded-full border-2 border-primary", animate: { scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }, transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }, "aria-hidden": "true" }))] }, region.name));
            }), _jsx(AnimatePresence, { children: selected && (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 20 }, className: "absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:bottom-4 md:w-80 bg-background/90 backdrop-blur-xl border border-border rounded-lg p-5 z-20", children: [_jsx("button", { onClick: () => setSelected(null), className: "absolute top-3 right-3 text-text-muted hover:text-white transition-colors", "aria-label": "Close region info", children: _jsx(X, { className: "w-4 h-4" }) }), _jsxs("div", { className: "flex items-center gap-3 mb-3", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-primary-muted border border-primary/20 flex items-center justify-center", children: _jsx(selected.icon, { className: "w-5 h-5 text-primary" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-heading text-white", children: selected.name }), _jsx("span", { className: "text-xs text-text-muted font-body uppercase tracking-wider", children: selected.biome })] })] }), _jsx("p", { className: "text-xs text-text-secondary font-body mb-4 leading-relaxed", children: selected.lore }), _jsxs("div", { className: "grid grid-cols-2 gap-2 text-xs", children: [_jsxs("div", { className: "flex items-center gap-1.5 text-text-muted", children: [_jsx(Swords, { className: "w-3 h-3 text-primary" }), _jsxs("span", { children: ["Difficulty: ", _jsx("span", { className: "text-text-secondary", children: selected.difficulty })] })] }), _jsxs("div", { className: "flex items-center gap-1.5 text-text-muted", children: [_jsx(Users, { className: "w-3 h-3 text-primary" }), _jsxs("span", { children: ["Pop: ", _jsx("span", { className: "text-text-secondary", children: selected.population })] })] }), _jsxs("div", { className: "flex items-center gap-1.5 text-text-muted", children: [_jsx(Skull, { className: "w-3 h-3 text-accent-red" }), _jsxs("span", { children: ["Boss: ", _jsx("span", { className: "text-text-secondary", children: selected.worldBoss })] })] }), _jsxs("div", { className: "flex items-center gap-1.5 text-text-muted", children: [_jsx(MapPin, { className: "w-3 h-3 text-primary" }), _jsxs("span", { children: ["Guild: ", _jsx("span", { className: "text-text-secondary", children: selected.guild })] })] })] })] })) }), _jsx("div", { className: "absolute top-4 left-4 flex flex-wrap gap-2 z-10", children: _jsx("span", { className: "text-[10px] uppercase tracking-widest text-text-muted font-body bg-background/70 px-2 py-1 rounded border border-border", children: "Click markers to explore" }) })] }));
}
//# sourceMappingURL=InteractiveMap.js.map