import { useDebugStore, type DebugState } from "../store/debugStore";

/**
 * DebugTools — dev-only overlay with world visualization toggles.
 * Roadmap PRIORITY 14. Only rendered under `import.meta.env.DEV`.
 */
const TOGGLES: { key: keyof DebugState; label: string }[] = [
  { key: "grid", label: "Grid" },
  { key: "labels", label: "District Labels" },
  { key: "spawnPoints", label: "Spawn Points" },
  { key: "lighting", label: "Lighting" },
  { key: "roads", label: "Roads" },
  { key: "physics", label: "Physics" },
];

export function DebugTools() {
  if (!import.meta.env.DEV) return null;
  const debug = useDebugStore();

  return (
    <div
      style={{
        position: "fixed",
        top: 12,
        right: 12,
        zIndex: 90,
        background: "rgba(5,5,5,0.7)",
        border: "1px solid rgba(212,175,55,0.3)",
        borderRadius: 6,
        padding: "10px 12px",
        fontFamily: "Inter, monospace",
        fontSize: 11,
        color: "#d4af37",
        backdropFilter: "blur(4px)",
        maxWidth: 180,
      }}
    >
      <div style={{ fontWeight: "bold", letterSpacing: "0.15em", marginBottom: 8, textTransform: "uppercase" }}>
        Debug
      </div>
      {TOGGLES.map((t) => (
        <label
          key={t.key}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 0", cursor: "pointer", userSelect: "none" }}
        >
          <input
            type="checkbox"
            checked={debug[t.key] as boolean}
            onChange={() => debug.toggle(t.key)}
            style={{ accentColor: "#d4af37" }}
          />
          {t.label}
        </label>
      ))}
    </div>
  );
}
