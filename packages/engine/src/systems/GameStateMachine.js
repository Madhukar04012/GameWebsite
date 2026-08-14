/**
 * LEGEND Game State Machine
 *
 * Pure enum + valid transitions. No React dependency.
 * Consumed by the Zustand store in apps/game.
 */
export var GamePhase;
(function (GamePhase) {
    GamePhase["BOOT"] = "BOOT";
    GamePhase["PRELOAD"] = "PRELOAD";
    GamePhase["AUTH"] = "AUTH";
    GamePhase["CONNECT_SERVER"] = "CONNECT_SERVER";
    GamePhase["LOAD_WORLD"] = "LOAD_WORLD";
    GamePhase["CINEMATIC"] = "CINEMATIC";
    GamePhase["CHARACTER_SELECT"] = "CHARACTER_SELECT";
    GamePhase["SPAWNING"] = "SPAWNING";
    GamePhase["PLAYING"] = "PLAYING";
    GamePhase["PAUSED"] = "PAUSED";
    GamePhase["DISCONNECTED"] = "DISCONNECTED";
    GamePhase["ERROR"] = "ERROR";
})(GamePhase || (GamePhase = {}));
const VALID_TRANSITIONS = {
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
export function canTransition(from, to) {
    return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}
export function assertTransition(from, to) {
    if (!canTransition(from, to)) {
        throw new Error(`Invalid state transition: ${from} → ${to}`);
    }
}
/** Human-readable label for each phase (for loading screens, debug) */
export const PHASE_LABELS = {
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
//# sourceMappingURL=GameStateMachine.js.map