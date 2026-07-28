"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Unlock, ChevronRight, Zap, Shield, Heart, Eye, Star } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Skill {
  id: string;
  name: string;
  desc: string;
  icon: typeof Zap;
  tier: number;
  maxRank: number;
  dependsOn?: string;
  color: string;
}

const WARRIOR_SKILLS: Skill[] = [
  { id: "w1", name: "Iron Will", desc: "Fortitude increases by 5 per rank.", icon: Shield, tier: 1, maxRank: 5, color: "#ef4444" },
  { id: "w2", name: "War Cry", desc: "Taunts enemies within 10m. +10% threat per rank.", icon: Star, tier: 1, maxRank: 3, color: "#ef4444" },
  { id: "w3", name: "Shield Bash", desc: "Stuns target for 2s. 15s cooldown per rank reduction.", icon: Shield, tier: 2, maxRank: 3, dependsOn: "w1", color: "#ef4444" },
  { id: "w4", name: "Battle Rage", desc: "Attack speed +5% per rank. Stacks 3 times.", icon: Zap, tier: 2, maxRank: 5, dependsOn: "w2", color: "#ef4444" },
  { id: "w5", name: "Bladestorm", desc: "Spin attack dealing 200% weapon damage per rank.", icon: Zap, tier: 3, maxRank: 3, dependsOn: "w3", color: "#ef4444" },
  { id: "w6", name: "Last Stand", desc: "Below 20% HP: +50% armor per rank for 8s.", icon: Heart, tier: 3, maxRank: 2, dependsOn: "w4", color: "#ef4444" },
];

const MAGE_SKILLS: Skill[] = [
  { id: "m1", name: "Arcane Bolt", desc: "Basic spell. Damage +8% per rank.", icon: Zap, tier: 1, maxRank: 5, color: "#a855f7" },
  { id: "m2", name: "Ice Shield", desc: "Barrier absorbing 50 dmg per rank.", icon: Shield, tier: 1, maxRank: 3, color: "#a855f7" },
  { id: "m3", name: "Frost Nova", desc: "Freezes enemies in 8m radius. 2s per rank.", icon: Star, tier: 2, maxRank: 3, dependsOn: "m1", color: "#a855f7" },
  { id: "m4", name: "Arcane Surge", desc: "Mana regen +20% per rank for 10s.", icon: Zap, tier: 2, maxRank: 3, dependsOn: "m2", color: "#a855f7" },
  { id: "m5", name: "Meteor Storm", desc: "Devastating AoE. 300% spell power per rank.", icon: Star, tier: 3, maxRank: 3, dependsOn: "m3", color: "#a855f7" },
  { id: "m6", name: "Time Warp", desc: "Allies gain 30% haste per rank for 12s.", icon: Eye, tier: 3, maxRank: 2, dependsOn: "m4", color: "#a855f7" },
];

const ROGUE_SKILLS: Skill[] = [
  { id: "r1", name: "Shadow Step", desc: "Teleport behind target. Range +3m per rank.", icon: Zap, tier: 1, maxRank: 3, color: "#22c55e" },
  { id: "r2", name: "Backstab", desc: "+25% crit damage per rank from behind.", icon: Star, tier: 1, maxRank: 5, color: "#22c55e" },
  { id: "r3", name: "Smoke Bomb", desc: "Blind enemies in 6m radius. +1s duration per rank.", icon: Eye, tier: 2, maxRank: 3, dependsOn: "r1", color: "#22c55e" },
  { id: "r4", name: "Poison Blade", desc: "Apply poison dealing 5% of target HP per rank.", icon: Zap, tier: 2, maxRank: 3, dependsOn: "r2", color: "#22c55e" },
  { id: "r5", name: "Death Mark", desc: "Marked target takes 50% more dmg per rank.", icon: Star, tier: 3, maxRank: 2, dependsOn: "r3", color: "#22c55e" },
  { id: "r6", name: "Shadow Dance", desc: "Enter stealth for 6s. Next attack crits +20% per rank.", icon: Eye, tier: 3, maxRank: 2, dependsOn: "r4", color: "#22c55e" },
];

const CLASSES = [
  { id: "warrior", name: "Warrior", icon: Shield, skills: WARRIOR_SKILLS, color: "#ef4444", desc: "Unstoppable frontline might." },
  { id: "mage", name: "Mage", icon: Star, skills: MAGE_SKILLS, color: "#a855f7", desc: "Master of arcane forces." },
  { id: "rogue", name: "Rogue", icon: Eye, skills: ROGUE_SKILLS, color: "#22c55e", desc: "Deadly shadow assassin." },
];

function SkillNode({ skill, rank, onRankUp, onRankDown, unlocked, spent }: {
  skill: Skill;
  rank: number;
  onRankUp: () => void;
  onRankDown: () => void;
  unlocked: boolean;
  spent: number;
}) {
  const Icon = skill.icon;
  const canRankUp = unlocked && rank < skill.maxRank && spent > 0;

  return (
    <motion.div
      layout
      className={`relative rounded-lg border p-3 transition-colors ${
        rank > 0
          ? "border-primary/40 bg-primary-muted"
          : unlocked
            ? "border-border bg-card"
            : "border-border/40 bg-card/50 opacity-40"
      }`}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <div className="w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center">
          {unlocked ? (
            <Icon className="w-3.5 h-3.5" style={{ color: skill.color }} />
          ) : (
            <Lock className="w-3 h-3 text-text-muted" />
          )}
        </div>
        <span className="text-xs font-heading text-white">{skill.name}</span>
        <span className="ml-auto text-[10px] font-mono text-primary tabular-nums">
          {rank}/{skill.maxRank}
        </span>
      </div>
      <p className="text-[10px] text-text-secondary font-body leading-relaxed mb-2">{skill.desc}</p>
      <div className="flex gap-1">
        {Array.from({ length: skill.maxRank }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i < rank ? "bg-primary" : "bg-border"
            }`}
          />
        ))}
      </div>
      {unlocked && (
        <div className="flex gap-1 mt-2">
          <button
            onClick={onRankDown}
            disabled={rank <= 0}
            className="flex-1 text-[10px] py-0.5 rounded bg-surface border border-border hover:border-primary/30 transition-colors disabled:opacity-30 font-body text-text-secondary"
            aria-label={`Decrease ${skill.name}`}
          >
            −
          </button>
          <button
            onClick={onRankUp}
            disabled={!canRankUp}
            className="flex-1 text-[10px] py-0.5 rounded bg-primary/20 border border-primary/30 hover:bg-primary/30 transition-colors disabled:opacity-30 font-body text-primary"
            aria-label={`Increase ${skill.name}`}
          >
            +
          </button>
        </div>
      )}
    </motion.div>
  );
}

export function SkillTree() {
  const [activeClass, setActiveClass] = useState("warrior");
  const [ranks, setRanks] = useState<Record<string, number>>({});
  const [points, setPoints] = useState(20);
  const reduced = useReducedMotion();

  const cls = CLASSES.find((c) => c.id === activeClass)!;
  const spent = cls.skills.reduce((sum, s) => sum + (ranks[`${cls.id}-${s.id}`] || 0), 0);

  function isUnlocked(skill: Skill): boolean {
    if (skill.dependsOn) {
      const depRank = ranks[`${cls.id}-${skill.dependsOn}`] || 0;
      return depRank >= skill.maxRank;
    }
    return true;
  }

  function rankUp(skillId: string) {
    const key = `${cls.id}-${skillId}`;
    const skill = cls.skills.find((s) => s.id === skillId)!;
    const current = ranks[key] || 0;
    if (current >= skill.maxRank || points <= 0) return;
    if (!isUnlocked(skill)) return;
    setRanks((r) => ({ ...r, [key]: (r[key] || 0) + 1 }));
    setPoints((p) => p - 1);
  }

  function rankDown(skillId: string) {
    const key = `${cls.id}-${skillId}`;
    const current = ranks[key] || 0;
    if (current <= 0) return;
    setRanks((r) => ({ ...r, [key]: (r[key] || 0) - 1 }));
    setPoints((p) => p + 1);
  }

  function reset() {
    const total = cls.skills.reduce((sum, s) => sum + (ranks[`${cls.id}-${s.id}`] || 0), 0);
    setRanks({});
    setPoints((p) => p + total);
  }

  const tiers = [1, 2, 3] as const;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Class selector */}
      <div className="flex border-b border-border">
        {CLASSES.map((c) => {
          const Icon = c.icon;
          const isActive = c.id === activeClass;
          return (
            <button
              key={c.id}
              onClick={() => { setActiveClass(c.id); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs uppercase tracking-wider font-body transition-colors border-b-2 ${
                isActive
                  ? "text-primary border-primary bg-primary-muted"
                  : "text-text-muted border-transparent hover:text-text-secondary hover:bg-surface"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {c.name}
            </button>
          );
        })}
      </div>

      {/* Skill points bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-surface/50 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-xs font-body text-text-muted uppercase tracking-wider">Skill Points</span>
          <span className="text-lg font-heading text-primary tabular-nums">{points}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-text-muted font-body">
            Spent: {spent}
          </span>
          <button
            onClick={reset}
            disabled={spent === 0}
            className="text-[10px] uppercase tracking-wider text-text-muted hover:text-primary transition-colors disabled:opacity-30 font-body"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Skill tiers */}
      <div className="p-4 space-y-4">
        {tiers.map((tier) => (
          <div key={tier}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase tracking-widest text-text-muted font-body">
                Tier {tier}
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {cls.skills
                .filter((s) => s.tier === tier)
                .map((skill) => (
                  <SkillNode
                    key={skill.id}
                    skill={skill}
                    rank={ranks[`${cls.id}-${skill.id}`] || 0}
                    onRankUp={() => rankUp(skill.id)}
                    onRankDown={() => rankDown(skill.id)}
                    unlocked={isUnlocked(skill)}
                    spent={points}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
