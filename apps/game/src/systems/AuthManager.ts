import { useGameStore } from "../store/gameStore";

/**
 * AuthManager handles player authentication with the game server.
 *
 * Phase 2: Placeholder that returns a local player ID.
 * Phase 6+: Real authentication with server.
 */
export function useAuth() {
  const setConnection = useGameStore((s) => s.setConnection);

  async function authenticate(playerName: string): Promise<string | null> {
    setConnection({ status: "connecting" });

    try {
      const res = await fetch("http://localhost:3001/game/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName }),
        signal: AbortSignal.timeout(5000),
      });

      if (!res.ok) {
        setConnection({ status: "disconnected", error: "Auth failed" });
        return null;
      }

      const data = await res.json();
      setConnection({ status: "connected", latency: data.latency ?? 0 });
      return data.playerId ?? "local-player";
    } catch {
      // Offline fallback: return local ID
      setConnection({ status: "connected", latency: 0 });
      return "local-player";
    }
  }

  return { authenticate };
}
