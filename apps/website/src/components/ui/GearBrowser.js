"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Sword, Sparkles, Star } from "lucide-react";
const GEAR = [
    { name: "Dawnbreaker", slot: "Weapon", tier: 4, icon: Sword, desc: "Legendary blade forged in celestial fire.",
        stats: [{ label: "Damage", value: "85-124" }, { label: "Strength", value: "+24" }, { label: "Crit", value: "+12%" }],
        setBonus: "Eternal Dawn Set: +15% holy damage" },
    { name: "Aegis of Kings", slot: "Shield", tier: 4, icon: Shield, desc: "An unbreakable bulwark said to hold the weight of a kingdom.",
        stats: [{ label: "Armor", value: "320" }, { label: "Stamina", value: "+18" }, { label: "Block", value: "+22%" }],
        setBonus: "Eternal Dawn Set: +15% holy damage" },
    { name: "Shadowstep Greaves", slot: "Legs", tier: 3, icon: Sparkles, desc: "Lightweight boots that seem to glide over any surface.",
        stats: [{ label: "Armor", value: "145" }, { label: "Agility", value: "+14" }, { label: "Speed", value: "+8%" }] },
    { name: "Crown of Whispers", slot: "Head", tier: 4, icon: Star, desc: "A crown that lets the wearer hear the thoughts of the realm.",
        stats: [{ label: "Armor", value: "185" }, { label: "Intellect", value: "+28" }, { label: "Mana Regen", value: "+15%" }],
        setBonus: "Shadow Pact Set: +20% shadow damage" },
    { name: "Molten Core Plate", slot: "Chest", tier: 3, icon: Shield, desc: "Chestplate forged in the heart of a volcano, still warm to the touch.",
        stats: [{ label: "Armor", value: "280" }, { label: "Strength", value: "+12" }, { label: "Fire Res", value: "+25%" }] },
    { name: "Soulreaver", slot: "Weapon", tier: 3, icon: Sword, desc: "A wicked blade that drinks the life of its victims.",
        stats: [{ label: "Damage", value: "72-98" }, { label: "Agility", value: "+16" }, { label: "Lifesteal", value: "+5%" }] },
    { name: "Mantle of the Archmage", slot: "Shoulders", tier: 4, icon: Star, desc: "Enchanted pauldrons that hum with stored arcane energy.",
        stats: [{ label: "Armor", value: "135" }, { label: "Intellect", value: "+22" }, { label: "Haste", value: "+10%" }],
        setBonus: "Arcane Legacy Set: -15% cast time" },
    { name: "Frostbite Ring", slot: "Ring", tier: 3, icon: Sparkles, desc: "A ring carved from glacial ice that never melts.",
        stats: [{ label: "Intellect", value: "+10" }, { label: "Frost Dmg", value: "+18%" }, { label: "Stamina", value: "+8" }] },
];
const SLOT_ICONS = {
    Weapon: Sword, Shield: Shield, Head: Star, Chest: Shield,
    Legs: Sparkles, Shoulders: Star, Ring: Sparkles,
};
function tierColor(tier) {
    switch (tier) {
        case 4: return "text-orange-400 border-orange-500/40 bg-orange-500/10";
        case 3: return "text-purple-400 border-purple-500/40 bg-purple-500/10";
        default: return "text-blue-400 border-blue-500/40 bg-blue-500/10";
    }
}
function tierLabel(tier) {
    switch (tier) {
        case 4: return "Legendary";
        case 3: return "Epic";
        default: return "Rare";
    }
}
export function GearBrowser() {
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selected, setSelected] = useState(null);
    const slots = [...new Set(GEAR.map((g) => g.slot))];
    const filtered = selectedSlot ? GEAR.filter((g) => g.slot === selectedSlot) : GEAR;
    return (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-1", children: _jsxs("div", { className: "bg-card border border-border rounded-lg p-4", children: [_jsx("h3", { className: "text-xs uppercase tracking-widest text-text-muted font-body mb-3", children: "Equipment Slots" }), _jsxs("div", { className: "flex flex-wrap lg:flex-col gap-1", children: [_jsx("button", { onClick: () => setSelectedSlot(null), className: `text-left text-xs py-2 px-3 rounded font-body transition-colors ${!selectedSlot ? "bg-primary-muted text-primary" : "text-text-secondary hover:text-primary hover:bg-surface"}`, children: "All Items" }), slots.map((slot) => {
                                    const Icon = SLOT_ICONS[slot] || Shield;
                                    const isActive = selectedSlot === slot;
                                    return (_jsxs("button", { onClick: () => setSelectedSlot(isActive ? null : slot), className: `flex items-center gap-2 text-xs py-2 px-3 rounded font-body transition-colors ${isActive ? "bg-primary-muted text-primary" : "text-text-secondary hover:text-primary hover:bg-surface"}`, children: [_jsx(Icon, { className: "w-3 h-3" }), slot] }, slot));
                                })] })] }) }), _jsx("div", { className: "lg:col-span-2", children: _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: filtered.map((item, i) => {
                        const colors = tierColor(item.tier);
                        const Icon = item.icon;
                        const isSelected = selected?.name === item.name;
                        return (_jsx(motion.button, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.04 }, onClick: () => setSelected(isSelected ? null : item), className: `text-left rounded-lg border p-3 transition-all ${isSelected
                                ? "border-primary bg-primary-muted"
                                : "border-border bg-card hover:border-primary/30"}`, children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: `w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${colors}`, children: _jsx(Icon, { className: "w-5 h-5" }) }), _jsxs("div", { className: "min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 mb-0.5", children: [_jsx("span", { className: "text-sm font-heading text-white truncate", children: item.name }), _jsx("span", { className: `text-[9px] uppercase font-body px-1.5 py-0.5 rounded border ${colors}`, children: tierLabel(item.tier) })] }), _jsx("span", { className: "text-[10px] text-text-muted font-body", children: item.slot }), _jsx("p", { className: "text-[10px] text-text-secondary font-body mt-1 leading-relaxed", children: item.desc }), item.setBonus && (_jsx("p", { className: "text-[10px] text-primary font-body mt-1 italic", children: item.setBonus }))] })] }) }, item.name));
                    }) }) })] }));
}
//# sourceMappingURL=GearBrowser.js.map