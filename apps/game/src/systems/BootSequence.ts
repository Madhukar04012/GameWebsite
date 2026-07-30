import { useEffect } from "react";
import { useGameStore } from "../store/gameStore";
import { GamePhase } from "@legend/engine";

/**
 * BootSequence drives game through loading phases.
 *
 * Flow: BOOT → PRELOAD → AUTH → CONNECT_SERVER (socket via NetworkClient) →
 *       LOAD_WORLD → CINEMATIC → CHARACTER_SELECT → SPAWNING → PLAYING.
 *
 * CHARACTER_SELECT is inserted after CINEMATIC per the roadmap diagram so the
 * player picks a name before spawning. No offline fallback — real server required.
 */
export function BootSequence() {
  const store = useGameStore;

  useEffect(() => {
    let cancelled = false;
    const s = () => store.getState();

    async function boot() {
      // Boot → PRELOAD
      await sleep(50);
      if (cancelled) return;
      s().transitionTo(GamePhase.PRELOAD);

      // Preload assets
      s().setLoadingTip("Loading assets...");
      await simProgress(0, 25, 400);
      if (cancelled) return;

      s().setLoadingTip("Preparing world...");
      await simProgress(25, 45, 300);
      if (cancelled) return;

      // AUTH: register with the server's auth endpoint
      s().transitionTo(GamePhase.AUTH);
      s().setLoadingTip("Authenticating...");
      await sleep(200);
      if (cancelled) return;

      const playerName = s().connection.playerName || "Hero";
      try {
        const res = await fetch("http://localhost:3001/game/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerName }),
          signal: AbortSignal.timeout(4000),
        });
        if (cancelled) return;
        if (!res.ok) throw new Error(`auth ${res.status}`);
        const data = await res.json();
        s().setConnection({ playerName: data.playerName });
      } catch (e) {
        if (cancelled) return;
        fail(s(), e);
        return;
      }
      s().setLoadingProgress(55);

      // CONNECT_SERVER: NetworkClient opens socket on this phase transition.
      s().transitionTo(GamePhase.CONNECT_SERVER);
      s().setLoadingTip("Connecting...");
      s().setConnection({ status: "connecting" });

      // Wait for socket connect (set by NetworkClient) or error timeout
      const connected = await waitForConnection(8000);
      if (cancelled) return;
      if (!connected || s().connection.status !== "connected") {
        fail(s(), new Error("Could not reach game server"));
        return;
      }
      s().setLoadingProgress(70);

      // Load world
      s().transitionTo(GamePhase.LOAD_WORLD);
      s().setLoadingTip("Building realm...");
      await simProgress(70, 95, 500);
      if (cancelled) return;
      s().setLoadingProgress(100);
      await sleep(100);
      if (cancelled) return;

      // Cinematic preview
      s().transitionTo(GamePhase.CINEMATIC);
      await sleep(2500);
      if (cancelled) return;

      // Character select (name entry)
      s().transitionTo(GamePhase.CHARACTER_SELECT);
      // Wait here — CharacterSelectScreen transitions to SPAWNING on confirm.
      // If the player never confirms, nothing further runs. The cleanup cancels.
    }

    boot();
    return () => { cancelled = true; };
  }, []);

  return null;
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function simProgress(from: number, to: number, dur: number) {
  const steps = 8;
  for (let i = 0; i < steps; i++) {
    await sleep(dur / steps);
    const p = from + (to - from) * ((i + 1) / steps);
    useGameStore.getState().setLoadingProgress(p);
  }
  useGameStore.getState().setLoadingProgress(to);
}

/** Poll store until connection resolves or timeout. */
function waitForConnection(timeout: number): Promise<boolean> {
  return new Promise((resolve) => {
    const start = performance.now();
    const tick = () => {
      const conn = useGameStore.getState().connection.status;
      if (conn === "connected") return resolve(true);
      if (performance.now() - start > timeout) return resolve(false);
      setTimeout(tick, 100);
    };
    tick();
  });
}

function fail(state: ReturnType<typeof useGameStore.getState>, err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  console.error("[Boot] Failure:", msg);
  state.setConnection({ status: "disconnected", error: msg });
  state.transitionTo(GamePhase.ERROR);
}

