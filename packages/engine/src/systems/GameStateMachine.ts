/**
 * LEGEND Game State Machine
 *
 * Pure enum + valid transitions. No React dependency.
 * Consumed by the Zustand store in apps/game.
 */

export enum GamePhase {
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
  ERROR = "ERROR",
}

const VALID_TRANSITIONS: Record<GamePhase, GamePhase[]> = {
  [GamePhase.BOOT]: [GamePhase.PRELOAD, GamePhase.ERROR],
  [GamePhase.PRELOAD]: [GamePhase.AUTH, GamePhase.ERROR],
  [GamePhase.AUTH]: [GamePhase.CONNECT_SERVER, GamePhase.ERROR],
  [GamePhase.CONNECT_SERVER]: [GamePhase.LOAD_WORLD, GamePhase.ERROR],
  [GamePhase.LOAD_WORLD]: [GamePhase.CINEMATIC, GamePhase.ERROR],
  [GamePhase.CINEMATIC]: [GamePhase.CHARACTER_SELECT, GamePhase.SPAWNING, GamePhase.ERROR],
  [GamePhase.CHARACTER_SELECT]: [GamePhase.SPAWNING, GamePhase.ERROR],
  [GamePhase.SPAWNING]: [GamePhase.PLAYING, GamePhase.ERROR],
  [GamePhase.PLAYING]: [GamePhase.PAUSED, GamePhase.DISCONNECTED, GamePhase.ERROR],
  [GamePhase.PAUSED]: [GamePhase.PLAYING, GamePhase.DISCONNECTED, GamePhase.ERROR],
  [GamePhase.DISCONNECTED]: [GamePhase.CONNECT_SERVER, GamePhase.ERROR],
  [GamePhase.ERROR]: [GamePhase.BOOT, GamePhase.PRELOAD, GamePhase.ERROR],
};

export function canTransition(from: GamePhase, to: GamePhase): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

export function assertTransition(from: GamePhase, to: GamePhase): void {
  if (!canTransition(from, to)) {
    throw new Error(`Invalid state transition: ${from} → ${to}`);
  }
}

/** Human-readable label for each phase (for loading screens, debug) */
export const PHASE_LABELS: Record<GamePhase, string> = {
  [GamePhase.BOOT]: "Initializing...",
  [GamePhase.PRELOAD]: "Loading assets...",
  [GamePhase.AUTH]: "Authenticating...",
  [GamePhase.CONNECT_SERVER]: "Connecting to server...",
  [GamePhase.LOAD_WORLD]: "Preparing world...",
  [GamePhase.CINEMATIC]: "Entering the realm...",
  [GamePhase.CHARACTER_SELECT]: "Select your champion...",
  [GamePhase.SPAWNING]: "Spawning...",
  [GamePhase.PLAYING]: "Playing",
  [GamePhase.PAUSED]: "Paused",
  [GamePhase.DISCONNECTED]: "Disconnected",
  [GamePhase.ERROR]: "Error",
};
