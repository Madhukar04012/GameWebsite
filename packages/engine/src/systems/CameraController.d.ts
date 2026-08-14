/**
 * Third-person camera controller.
 *
 * Pure math: takes orbit angles + distance, returns camera position
 * and look-at target. Frame-rate-independent via exponential smoothing.
 *
 * Per camera-systems skill: use `1 - exp(-rate * dt)` instead of
 * per-frame lerp for consistent feel at any framerate.
 *
 * No Three.js dependency — works with any coordinate system.
 */
export interface CameraState {
    yaw: number;
    pitch: number;
    distance: number;
    height: number;
}
export declare function createDefaultCamera(): CameraState;
/** Zoom limits for the orbit distance (scroll wheel clamps to this range). */
export declare const CAMERA_ZOOM: {
    readonly min: 3;
    readonly max: 18;
};
/** Clamp a candidate distance to the zoom range. */
export declare function clampDistance(distance: number): number;
/**
 * Camera collision probe hook.
 *
 * Without real physics, we do a simple terrain-raise: ensure the camera never
 * dips below the terrain height plus a margin at its world position. A future
 * implementation can replace `groundHeightAt` with a raycast against world
 * colliders and pull the camera in instead. Returns an adjusted Y.
 */
export declare function resolveCameraCollision(camPos: {
    x: number;
    y: number;
    z: number;
}, groundHeightAt: (x: number, z: number) => number, margin?: number): number;
export interface CameraPosition {
    x: number;
    y: number;
    z: number;
}
/**
 * Compute camera position from orbit state + target position.
 */
export declare function computeCameraPosition(cam: CameraState, target: {
    x: number;
    y: number;
    z: number;
}): CameraPosition;
/**
 * Smooth toward target using frame-rate-independent exponential smoothing.
 * rate ≈ 5 (floaty) .. 12 (snappy)
 *
 * Formula: t = 1 - exp(-rate * dt)
 * This converges at the same rate regardless of frame time.
 */
export declare function smoothCameraTowards(current: CameraState, target: CameraState, rate: number, dt: number): CameraState;
/**
 * @deprecated Use smoothCameraTowards with delta time instead.
 * Legacy per-frame lerp kept for reference.
 */
export declare function lerpCamera(from: CameraState, to: CameraState, t: number): CameraState;
//# sourceMappingURL=CameraController.d.ts.map