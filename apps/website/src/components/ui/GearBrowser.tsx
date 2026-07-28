"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Sword, Sparkles, Star, ChevronRight } from "lucide-react";

interface GearItem {
  name: string;
  slot: string;
  tier: number;
  stats: { label: string; value: string }[];
  setBonus?: string;
  desc: string;
  icon: typeof Shield;
}

const GEAR: GearItem[] = [
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

const SLOT_ICONS: Record<string, typeof Shield> = {
  Weapon: Sword, Shield: Shield, Head: Star, Chest: Shield,
  Legs: Sparkles, Shoulders: Star, Ring: Sparkles,
};

function tierColor(tier: number): string {
  switch (tier) {
    case 4: return "text-orange-400 border-orange-500/40 bg-orange-500/10";
    case 3: return "text-purple-400 border-purple-500/40 bg-purple-500/10";
    default: return "text-blue-400 border-blue-500/40 bg-blue-500/10";
  }
}

function tierLabel(tier: number): string {
  switch (tier) {
    case 4: return "Legendary";
    case 3: return "Epic";
    default: return "Rare";
  }
}

export function GearBrowser() {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selected, setSelected] = useState<GearItem | null>(null);

  const slots = [...new Set(GEAR.map((g) => g.slot))];
  const filtered = selectedSlot ? GEAR.filter((g) => g.slot === selectedSlot) : GEAR;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Slot filter */}
      <div className="lg:col-span-1">
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-xs uppercase tracking-widest text-text-muted font-body mb-3">Equipment Slots</h3>
          <div className="flex flex-wrap lg:flex-col gap-1">
            <button
              onClick={() => setSelectedSlot(null)}
              className={`text-left text-xs py-2 px-3 rounded font-body transition-colors ${
                !selectedSlot ? "bg-primary-muted text-primary" : "text-text-secondary hover:text-primary hover:bg-surface"
              }`}
            >
              All Items
            </button>
            {slots.map((slot) => {
              const Icon = SLOT_ICONS[slot] || Shield;
              const isActive = selectedSlot === slot;
              return (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(isActive ? null : slot)}
                  className={`flex items-center gap-2 text-xs py-2 px-3 rounded font-body transition-colors ${
                    isActive ? "bg-primary-muted text-primary" : "text-text-secondary hover:text-primary hover:bg-surface"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {slot}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Gear grid */}
      <div className="lg:col-span-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((item, i) => {
            const colors = tierColor(item.tier);
            const Icon = item.icon;
            const isSelected = selected?.name === item.name;

            return (
              <motion.button
                key={item.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setSelected(isSelected ? null : item)}
                className={`text-left rounded-lg border p-3 transition-all ${
                  isSelected
                    ? "border-primary bg-primary-muted"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${colors}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-heading text-white truncate">{item.name}</span>
                      <span className={`text-[9px] uppercase font-body px-1.5 py-0.5 rounded border ${colors}`}>
                        {tierLabel(item.tier)}
                      </span>
                    </div>
                    <span className="text-[10px] text-text-muted font-body">{item.slot}</span>
                    <p className="text-[10px] text-text-secondary font-body mt-1 leading-relaxed">{item.desc}</p>
                    {item.setBonus && (
                      <p className="text-[10px] text-primary font-body mt-1 italic">{item.setBonus}</p>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
