import { useEffect, useRef, useState } from "react";
import { useGameStore } from "../store/gameStore";
import { GamePhase } from "@legend/engine";
import { playerPos } from "../store/playerPosStore";

/**
 * Zone definitions keyed by id, ordered by traversal.
 * Crossing z past the gate boundary switches the current region.
 * "capital" sits north of the gate; "flower_fields" lies south.
 */
type ZoneId = "capital" | "flower_fields";

const ZONES: Record<ZoneId, { label: string; subtitle: string }> = {
  capital: {
    label: "Capital Kingdom",
    subtitle: "Where the golden banners fly",
  },
  flower_fields: {
    label: "Flower Fields",
    subtitle: "Wild blooms and wandering slimes",
  },
};

/** Boundary between the two zones. South Gate sits at the city wall (z=-46). */
const GATE_Z = -50;

export function ZoneTransition() {
  const phase = useGameStore((s) => s.phase);
  const [zone, setZone] = useState<ZoneId>("capital");
  const [active, setActive] = useState(false);
  const current = useRef<ZoneId>("capital");
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Only run while world is active (playing); bail in cinematic/spawn.
    if (phase !== GamePhase.PLAYING) return;

    const unsub = playerPos.subscribe((pos) => {
      const next: ZoneId = pos.z < GATE_Z ? "flower_fields" : "capital";
      if (next === current.current) return;
      current.current = next;
      setZone(next);
      setActive(true);

      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setActive(false), 1600);
    });
    return () => {
      unsub();
    };
  }, [phase]);

  if (!active) return null;
  const meta = ZONES[zone];

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 60,
      pointerEvents: "none",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 14,
    }}>
      <div key={zone} style={{
        animation: "zt-fade 1.6s ease-out forwards",
        textAlign: "center",
      }}>
        <div style={{
          fontSize: 42,
          fontWeight: "bold",
          fontFamily: "Inter, sans-serif",
          letterSpacing: "0.2em",
          color: "#d4af37",
          textShadow: "0 0 24px rgba(212,175,55,0.5)",
        }}>
          {meta.label}
        </div>
        <div style={{
          fontSize: 11,
          fontFamily: "Inter, sans-serif",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "#a0a0a0",
          marginTop: 8,
        }}>
          {meta.subtitle}
        </div>
      </div>
      <style>{`
        @keyframes zt-fade {
          0% { opacity: 0; transform: translateY(8px); }
          18% { opacity: 1; transform: translateY(0); }
          78% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
