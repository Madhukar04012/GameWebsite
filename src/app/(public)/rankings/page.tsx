"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowUpDown, Trophy, Medal, Award, Search, Crown, Star, Swords } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

// Mock leaderboard data — replace with API fetch in production
const mockPlayers = [
  { rank: 1, name: "Vex", guild: "Eternal Dawn", level: 85, title: "Grand Warden", score: 28450 },
  { rank: 2, name: "Lysara", guild: "Shadow Pact", level: 83, title: "Blade Master", score: 27120 },
  { rank: 3, name: "Kael", guild: "Iron Legion", level: 82, title: "Siegebreaker", score: 25980 },
  { rank: 4, name: "Morwen", guild: "Eternal Dawn", level: 80, title: "Archmage", score: 24310 },
  { rank: 5, name: "Rik", guild: "Freeblades", level: 79, title: "Pathfinder", score: 23750 },
  { rank: 6, name: "Sylas", guild: "Shadow Pact", level: 78, title: "Assassin", score: 22490 },
  { rank: 7, name: "Elara", guild: "Iron Legion", level: 77, title: "Paladin", score: 21880 },
  { rank: 8, name: "Dorn", guild: "Freeblades", level: 76, title: "Berserker", score: 20670 },
  { rank: 9, name: "Fen", guild: "Eternal Dawn", level: 75, title: "Ranger", score: 19540 },
  { rank: 10, name: "Zara", guild: "Shadow Pact", level: 74, title: "Necromancer", score: 18420 },
  { rank: 11, name: "Thane", guild: "Iron Legion", level: 73, title: "Guardian", score: 17390 },
  { rank: 12, name: "Ivy", guild: "Freeblades", level: 71, title: "Scout", score: 16210 },
];

type SortKey = "rank" | "name" | "level" | "score";

/* ── Top 3 Champion Cards ── */

const podiumColors = {
  1: {
    border: "border-yellow-500/50",
    glow: "rgba(234,179,8,0.15)",
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    icon: Trophy,
    label: "Grand Champion",
  },
  2: {
    border: "border-gray-300/50",
    glow: "rgba(209,213,219,0.12)",
    bg: "bg-gray-300/10",
    text: "text-gray-300",
    icon: Medal,
    label: "Silver Champion",
  },
  3: {
    border: "border-amber-600/50",
    glow: "rgba(217,119,6,0.12)",
    bg: "bg-amber-600/10",
    text: "text-amber-500",
    icon: Award,
    label: "Bronze Champion",
  },
};

function TopChampions() {
  const top3 = mockPlayers.slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {/* Gold - center on desktop */}
      {top3.map((player, i) => {
        const style = podiumColors[player.rank as keyof typeof podiumColors];
        const isFirst = player.rank === 1;
        const Icon = style.icon;

        return (
          <motion.div
            key={player.name}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
            className={`relative rounded-lg border ${style.border} ${style.bg} backdrop-blur-sm p-6 text-center ${
              isFirst ? "md:-mt-4 md:mb-4" : ""
            }`}
          >
            {/* Animated glow ring for #1 */}
            {isFirst && (
              <motion.div
                className="absolute inset-0 rounded-lg pointer-events-none"
                animate={{ boxShadow: ["0 0 20px rgba(234,179,8,0.1)", "0 0 40px rgba(234,179,8,0.2)", "0 0 20px rgba(234,179,8,0.1)"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden="true"
              />
            )}

            {/* Crown for #1 */}
            {isFirst && (
              <motion.div
                className="absolute -top-4 left-1/2 -translate-x-1/2"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Crown className="w-6 h-6 text-yellow-400" />
              </motion.div>
            )}

            {/* Rank icon */}
            <div className={`w-12 h-12 mx-auto mb-3 rounded-full ${style.bg} border ${style.border} flex items-center justify-center`}>
              <Icon className={`w-6 h-6 ${style.text}`} />
            </div>

            <h3 className="text-2xl font-heading text-white mb-1">{player.name}</h3>
            <p className={`text-xs uppercase tracking-wider font-body mb-2 ${style.text}`}>
              {style.label}
            </p>
            <div className="inline-flex items-center gap-1 bg-background/60 px-3 py-1 rounded-full border border-border text-xs text-text-secondary font-body mb-3">
              <Swords className="w-3 h-3" />
              {player.guild}
            </div>

            <div className="flex justify-center gap-6 text-sm">
              <div>
                <span className="block text-2xl font-heading text-primary">{player.score.toLocaleString()}</span>
                <span className="text-[10px] uppercase tracking-widest text-text-muted font-body">Score</span>
              </div>
              <div>
                <span className="block text-2xl font-heading text-white">{player.level}</span>
                <span className="text-[10px] uppercase tracking-widest text-text-muted font-body">Level</span>
              </div>
            </div>

            <p className="text-xs text-primary font-body mt-2 italic">{player.title}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ── Main Page ── */

export default function RankingsPage() {
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortAsc, setSortAsc] = useState(true);
  const [search, setSearch] = useState("");

  const sorted = [...mockPlayers]
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      return sortAsc
        ? String(valA).localeCompare(String(valB), undefined, { numeric: true })
        : String(valB).localeCompare(String(valA), undefined, { numeric: true });
    });

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(key !== "rank"); }
  }

  function rankIcon(rank: number) {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-500" />;
    return null;
  }

  return (
    <div className="pt-24 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-6">
        {/* Header */}
        <AnimatedSection className="mb-12 text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-8xl font-heading text-primary mb-4">
            Rankings
          </h1>
          <p className="text-lg md:text-xl text-text-secondary font-subheading">
            The strongest players and guilds across the realm.
          </p>
        </AnimatedSection>

        {/* Top 3 Champions */}
        <TopChampions />

        {/* Search */}
        <AnimatedSection variant="fade-up" delay={0.3}>
          <div className="max-w-md mx-auto mb-10 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Search player..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg pl-12 pr-4 py-3 text-text-primary font-body text-sm placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </AnimatedSection>

        {/* Table */}
        <AnimatedSection variant="fade-up" delay={0.4}>
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    {[
                      { key: "rank" as SortKey, label: "Rank" },
                      { key: "name" as SortKey, label: "Player" },
                      { key: null, label: "Guild" },
                      { key: "level" as SortKey, label: "Level" },
                      { key: null, label: "Title" },
                      { key: "score" as SortKey, label: "Score" },
                    ].map((col) => (
                      <th
                        key={col.label}
                        className={`px-6 py-4 text-xs uppercase tracking-widest text-text-muted font-body ${
                          col.key ? "cursor-pointer hover:text-primary transition-colors" : ""
                        }`}
                        onClick={() => col.key && toggleSort(col.key)}
                        scope="col"
                      >
                        <span className="flex items-center gap-2">
                          {col.label}
                          {col.key && sortKey === col.key && (
                            <ArrowUpDown className={`w-3 h-3 transition-transform ${sortAsc ? "" : "rotate-180"}`} />
                          )}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((player, i) => (
                    <motion.tr
                      key={player.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.03 }}
                      className="border-b border-border/50 last:border-0 hover:bg-surface/50 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <span className="flex items-center gap-2">
                          {rankIcon(player.rank) || (
                            <span className="w-5 h-5 flex items-center justify-center text-text-muted font-body text-sm tabular-nums">
                              {player.rank}
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-white font-body font-medium">{player.name}</td>
                      <td className="px-6 py-5 text-text-secondary font-body text-sm">{player.guild}</td>
                      <td className="px-6 py-5 text-text-secondary font-body tabular-nums">{player.level}</td>
                      <td className="px-6 py-5 text-primary font-body text-sm">{player.title}</td>
                      <td className="px-6 py-5 text-white font-body font-mono tabular-nums">{player.score.toLocaleString()}</td>
                    </motion.tr>
                  ))}
                  {sorted.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-text-muted font-body">
                        No players found matching &quot;{search}&quot;
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
