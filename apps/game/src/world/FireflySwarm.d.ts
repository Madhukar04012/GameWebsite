/**
 * FireflySwarm -- Bioluminescent particles that drift and pulse like living
 * fireflies. Smaller, faster, and blink more erratically than DustMotes.
 * Intended for groves, flower fields, marshes, and damp forest understory.
 *
 * Art direction: each firefly has a small warm glow (green/gold/blue-green)
 * with a sharp decay so they read as discrete points of light, not fog.
 */
interface FireflySwarmProps {
    count?: number;
    /** Center of the swarm volume. */
    position?: [number, number, number];
    /** Horizontal spread radius (default 20). */
    radius?: number;
    /** Vertical spread (default 10). */
    height?: number;
    /** Glow color. Default bioluminescent green. */
    color?: string;
}
export declare function FireflySwarm({ count, position, radius, height, color, }: FireflySwarmProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=FireflySwarm.d.ts.map