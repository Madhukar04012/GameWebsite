import { create } from "zustand";
import { GamePhase, assertTransition, PHASE_LABELS } from "@legend/engine";
import type { RemotePlayerData } from "@legend/engine";

interface PlayerState {
  hp: number;
  maxHp: number;
  level: number;
  xp: number;
  xpToNext: number;
}

interface ConnectionState {
  status: "disconnected" | "connecting" | "connected";
  serverUrl: string;
  latency: number;
  error: string | null;
  playerId: string | null;
  playerName: string;
}

interface LoadingState {
  progress: number; // 0-100
  tip: string;
}

interface GameState {
  phase: GamePhase;
  previousPhase: GamePhase | null;
  player: PlayerState;
  connection: ConnectionState;
  loading: LoadingState;
  remotePlayers: Record<string, RemotePlayerData>;

  /* ── Actions ── */
  transitionTo: (phase: GamePhase) => void;
  setPlayer: (player: Partial<PlayerState>) => void;
  setConnection: (conn: Partial<ConnectionState>) => void;
  setLoadingProgress: (progress: number) => void;
  setLoadingTip: (tip: string) => void;
  setRemotePlayers: (players: Record<string, RemotePlayerData>) => void;
  upsertRemotePlayer: (player: RemotePlayerData) => void;
  removeRemotePlayer: (id: string) => void;
  updateRemotePlayer: (id: string, position: { x: number; y: number; z: number }, rotation: number) => void;
  reset: () => void;
}

const INITIAL_PLAYER: PlayerState = {
  hp: 100,
  maxHp: 100,
  level: 1,
  xp: 0,
  xpToNext: 100,
};

const INITIAL_CONNECTION: ConnectionState = {
  status: "disconnected",
  serverUrl: "http://localhost:3001",
  latency: 0,
  error: null,
  playerId: null,
  playerName: "Hero",
};

const INITIAL_LOADING: LoadingState = {
  progress: 0,
  tip: "Awakening the realm...",
};

export const useGameStore = create<GameState>((set, get) => ({
  phase: GamePhase.BOOT,
  previousPhase: null,
  player: { ...INITIAL_PLAYER },
  connection: { ...INITIAL_CONNECTION },
  loading: { ...INITIAL_LOADING },
  remotePlayers: {},

  transitionTo: (nextPhase: GamePhase) => {
    const { phase } = get();
    try {
      assertTransition(phase, nextPhase);
      set({ phase: nextPhase, previousPhase: phase });
      console.log(`[GameState] ${phase} → ${nextPhase}`);
    } catch (e) {
      console.error(`[GameState] Invalid transition: ${phase} → ${nextPhase}`);
    }
  },

  setPlayer: (update) =>
    set((state) => ({ player: { ...state.player, ...update } })),

  setConnection: (update) =>
    set((state) => ({ connection: { ...state.connection, ...update } })),

  setLoadingProgress: (progress) =>
    set((state) => ({ loading: { ...state.loading, progress } })),

  setLoadingTip: (tip) =>
    set((state) => ({ loading: { ...state.loading, tip } })),

  setRemotePlayers: (players) => set({ remotePlayers: players }),

  upsertRemotePlayer: (player) =>
    set((state) => ({ remotePlayers: { ...state.remotePlayers, [player.id]: player } })),

  removeRemotePlayer: (id) =>
    set((state) => {
      const next = { ...state.remotePlayers };
      delete next[id];
      return { remotePlayers: next };
    }),

  updateRemotePlayer: (id, position, rotation) =>
    set((state) => {
      const existing = state.remotePlayers[id];
      if (!existing) return state;
      return {
        remotePlayers: { ...state.remotePlayers, [id]: { ...existing, position, rotation } },
      };
    }),

  reset: () =>
    set({
      phase: GamePhase.BOOT,
      previousPhase: null,
      player: { ...INITIAL_PLAYER },
      connection: { ...INITIAL_CONNECTION },
      loading: { ...INITIAL_LOADING },
      remotePlayers: {},
    }),
}));

/* ── Selector helpers ── */
export const usePhaseLabel = () =>
  useGameStore((s) => PHASE_LABELS[s.phase]);

export const useIsPlaying = () =>
  useGameStore((s) => s.phase === GamePhase.PLAYING);

export const useIsLoading = () =>
  useGameStore((s) =>
    [GamePhase.PRELOAD, GamePhase.AUTH, GamePhase.CONNECT_SERVER, GamePhase.LOAD_WORLD].includes(s.phase)
  );
