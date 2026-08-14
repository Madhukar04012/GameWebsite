import { GamePhase } from "@legend/engine";
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
    progress: number;
    tip: string;
}
interface GameState {
    phase: GamePhase;
    previousPhase: GamePhase | null;
    player: PlayerState;
    connection: ConnectionState;
    loading: LoadingState;
    remotePlayers: Record<string, RemotePlayerData>;
    transitionTo: (phase: GamePhase) => void;
    setPlayer: (player: Partial<PlayerState>) => void;
    setConnection: (conn: Partial<ConnectionState>) => void;
    setLoadingProgress: (progress: number) => void;
    setLoadingTip: (tip: string) => void;
    setRemotePlayers: (players: Record<string, RemotePlayerData>) => void;
    upsertRemotePlayer: (player: RemotePlayerData) => void;
    removeRemotePlayer: (id: string) => void;
    updateRemotePlayer: (id: string, position: {
        x: number;
        y: number;
        z: number;
    }, rotation: number) => void;
    reset: () => void;
}
export declare const useGameStore: import("zustand").UseBoundStore<import("zustand").StoreApi<GameState>>;
export declare const usePhaseLabel: () => string;
export declare const useIsPlaying: () => boolean;
export declare const useIsLoading: () => boolean;
export {};
//# sourceMappingURL=gameStore.d.ts.map