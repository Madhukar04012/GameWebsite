import { create } from "zustand";
import { GamePhase, assertTransition, PHASE_LABELS } from "@legend/engine";
const INITIAL_PLAYER = {
    hp: 100,
    maxHp: 100,
    level: 1,
    xp: 0,
    xpToNext: 100,
};
const INITIAL_CONNECTION = {
    status: "disconnected",
    serverUrl: "http://localhost:3001",
    latency: 0,
    error: null,
    playerId: null,
    playerName: "Hero",
};
const INITIAL_LOADING = {
    progress: 0,
    tip: "Awakening the realm...",
};
export const useGameStore = create((set, get) => ({
    phase: GamePhase.BOOT,
    previousPhase: null,
    player: { ...INITIAL_PLAYER },
    connection: { ...INITIAL_CONNECTION },
    loading: { ...INITIAL_LOADING },
    remotePlayers: {},
    transitionTo: (nextPhase) => {
        const { phase } = get();
        try {
            assertTransition(phase, nextPhase);
            set({ phase: nextPhase, previousPhase: phase });
            // log removed
        }
        catch (e) {
            // log removed
        }
    },
    setPlayer: (update) => set((state) => ({ player: { ...state.player, ...update } })),
    setConnection: (update) => set((state) => ({ connection: { ...state.connection, ...update } })),
    setLoadingProgress: (progress) => set((state) => ({ loading: { ...state.loading, progress } })),
    setLoadingTip: (tip) => set((state) => ({ loading: { ...state.loading, tip } })),
    setRemotePlayers: (players) => set({ remotePlayers: players }),
    upsertRemotePlayer: (player) => set((state) => ({ remotePlayers: { ...state.remotePlayers, [player.id]: player } })),
    removeRemotePlayer: (id) => set((state) => {
        const next = { ...state.remotePlayers };
        delete next[id];
        return { remotePlayers: next };
    }),
    updateRemotePlayer: (id, position, rotation) => set((state) => {
        const existing = state.remotePlayers[id];
        if (!existing)
            return state;
        return {
            remotePlayers: { ...state.remotePlayers, [id]: { ...existing, position, rotation } },
        };
    }),
    reset: () => set({
        phase: GamePhase.BOOT,
        previousPhase: null,
        player: { ...INITIAL_PLAYER },
        connection: { ...INITIAL_CONNECTION },
        loading: { ...INITIAL_LOADING },
        remotePlayers: {},
    }),
}));
/* ── Selector helpers ── */
export const usePhaseLabel = () => useGameStore((s) => PHASE_LABELS[s.phase]);
export const useIsPlaying = () => useGameStore((s) => s.phase === GamePhase.PLAYING);
export const useIsLoading = () => useGameStore((s) => [GamePhase.PRELOAD, GamePhase.AUTH, GamePhase.CONNECT_SERVER, GamePhase.LOAD_WORLD].includes(s.phase));
//# sourceMappingURL=gameStore.js.map