/**
 * AudioManager — procedural ambient audio using Web Audio API.
 *
 * Generates all sounds via oscillators and noise (no audio files).
 * Lightweight: one AudioContext, shared across the game lifecycle.
 * Mount <AudioController /> once in the scene to activate.
 *
 * Audio zones are driven by worldStore (weather, time) and player position.
 */
/**
 * AudioController — mounts ambient audio processing. One instance in the scene.
 * Starts muted; user interaction (click) unmutes.
 */
export declare function AudioController({ enabled }: {
    enabled?: boolean;
}): null;
//# sourceMappingURL=AudioController.d.ts.map