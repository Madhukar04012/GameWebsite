import { useEffect, useState } from "react";
import { useGameStore } from "../store/gameStore";
import { GamePhase } from "@legend/engine";

const styles = {
  container: {
    position: "fixed" as const,
    bottom: 20,
    left: 20,
    display: "flex",
    flexDirection: "column" as const,
    gap: 6,
    zIndex: 100,
    pointerEvents: "none" as const,
  },
  hpRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  hpLabel: {
    fontSize: 10,
    fontFamily: "Inter, sans-serif",
    color: "#a0a0a0",
    width: 30,
  },
  hpBarOuter: {
    width: 200,
    height: 6,
    background: "#2a2a2a",
    borderRadius: 3,
    overflow: "hidden",
  },
  hpBarInner: (pct: number) => ({
    width: `${pct}%`,
    height: "100%",
    background: pct > 50 ? "#6a9a4a" : pct > 25 ? "#c4a030" : "#c44a30",
    borderRadius: 3,
    transition: "width 0.3s ease-out",
  }),
  hpText: {
    fontSize: 10,
    fontFamily: "monospace",
    color: "#666",
    width: 50,
  },
  crosshair: {
    position: "fixed" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 100,
    pointerEvents: "none" as const,
    color: "rgba(212,175,55,0.4)",
    fontSize: 20,
    fontFamily: "monospace",
  },
  level: {
    fontSize: 10,
    fontFamily: "Inter, sans-serif",
    color: "#666",
  },
};

export function HUD() {
  const player = useGameStore((s) => s.player);
  const phase = useGameStore((s) => s.phase);
  const isPlaying = phase === GamePhase.PLAYING;
  const hpPct = (player.hp / player.maxHp) * 100;

  if (!isPlaying) return null;

  return (
    <>
      {/* Crosshair */}
      <div style={styles.crosshair}>+</div>

      {/* HUD bottom-left */}
      <div style={styles.container}>
        <div style={styles.level}>Level {player.level}</div>
        <div style={styles.hpRow}>
          <span style={styles.hpLabel}>HP</span>
          <div style={styles.hpBarOuter}>
            <div style={styles.hpBarInner(hpPct)} />
          </div>
          <span style={styles.hpText}>{player.hp}/{player.maxHp}</span>
        </div>
      </div>
    </>
  );
}
