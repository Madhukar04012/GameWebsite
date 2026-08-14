/**
 * BootSequence drives game through loading phases.
 *
 * Flow: BOOT → PRELOAD → AUTH → CONNECT_SERVER (socket via NetworkClient) →
 *       LOAD_WORLD → CINEMATIC → CHARACTER_SELECT → SPAWNING → PLAYING.
 *
 * CHARACTER_SELECT is inserted after CINEMATIC per the roadmap diagram so the
 * player picks a name before spawning. No offline fallback — real server required.
 */
export declare function BootSequence(): null;
//# sourceMappingURL=BootSequence.d.ts.map