/**
 * LEGEND Game State Machine
 *
 * Pure enum + valid transitions. No React dependency.
 * Consumed by the Zustand store in apps/game.
 */
export declare enum GamePhase {
    BOOT = "BOOT",
    PRELOAD = "PRELOAD",
    AUTH = "AUTH",
    CONNECT_SERVER = "CONNECT_SERVER",
    LOAD_WORLD = "LOAD_WORLD",
    CINEMATIC = "CINEMATIC",
    CHARACTER_SELECT = "CHARACTER_SELECT",
    SPAWNING = "SPAWNING",
    PLAYING = "PLAYING",
    PAUSED = "PAUSED",
    DISCONNECTED = "DISCONNECTED",
    ERROR = "ERROR"
}
export declare function canTransition(from: GamePhase, to: GamePhase): boolean;
export declare function assertTransition(from: GamePhase, to: GamePhase): void;
/** Human-readable label for each phase (for loading screens, debug) */
export declare const PHASE_LABELS: Record<GamePhase, string>;
//# sourceMappingURL=GameStateMachine.d.ts.map