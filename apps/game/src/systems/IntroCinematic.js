import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Vector3, CatmullRomCurve3 } from "three";
import { useGameStore } from "../store/gameStore";
import { GamePhase } from "@legend/engine";
/**
 * IntroCinematic — camera flythrough on game start.
 *
 * Flies camera along a spline path, looking at the origin (Capital Kingdom).
 * On completion, triggers SPAWNING → PLAYING.
 */
const SPLINE_POINTS = [
    new Vector3(50, 40, 50), // Start: high above, SE
    new Vector3(0, 35, 60), // Approach from south
    new Vector3(-40, 30, 40), // Sweep left
    new Vector3(-50, 25, 0), // North side
    new Vector3(-30, 15, -30), // Descend NW
    new Vector3(0, 10, -20), // Approach from north
    new Vector3(0, 3, 8), // Final: at spawn, behind player
];
const CINEMATIC_DURATION = 4000; // ms
export function IntroCinematic() {
    const { camera } = useThree();
    const transitionTo = useGameStore((s) => s.transitionTo);
    const startTime = useRef(performance.now());
    const curve = useRef(new CatmullRomCurve3(SPLINE_POINTS));
    useFrame(() => {
        const elapsed = performance.now() - startTime.current;
        const t = Math.min(elapsed / CINEMATIC_DURATION, 1);
        // Ease in-out for smooth camera
        const eased = easeInOutCubic(t);
        // Get position along spline
        const pos = curve.current.getPoint(eased);
        camera.position.copy(pos);
        // Look toward origin (center of Capital Kingdom)
        camera.lookAt(0, 0, 0);
    });
    useEffect(() => {
        startTime.current = performance.now();
        const timer = setTimeout(() => {
            // Cinematic complete — spawn player
            transitionTo(GamePhase.SPAWNING);
            // Brief spawn delay, then playing
            setTimeout(() => {
                transitionTo(GamePhase.PLAYING);
            }, 400);
        }, CINEMATIC_DURATION + 200);
        return () => clearTimeout(timer);
    }, []);
    return null;
}
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
//# sourceMappingURL=IntroCinematic.js.map