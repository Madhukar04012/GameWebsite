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
  yaw: number;      // horizontal orbit (radians)
  pitch: number;    // vertical orbit (radians, clamped)
  distance: number; // distance from target
  height: number;   // target height offset
}

export function createDefaultCamera(): CameraState {
  return {
    yaw: 0,
    pitch: 0.4, // slightly above horizon
    distance: 8,
    height: 1.5,
  };
}

/** Zoom limits for the orbit distance (scroll wheel clamps to this range). */
export const CAMERA_ZOOM = { min: 3, max: 18 } as const;

/** Clamp a candidate distance to the zoom range. */
export function clampDistance(distance: number): number {
  return Math.max(CAMERA_ZOOM.min, Math.min(CAMERA_ZOOM.max, distance));
}

/**
 * Camera collision probe hook.
 *
 * Without real physics, we do a simple terrain-raise: ensure the camera never
 * dips below the terrain height plus a margin at its world position. A future
 * implementation can replace `groundHeightAt` with a raycast against world
 * colliders and pull the camera in instead. Returns an adjusted Y.
 */
export function resolveCameraCollision(
  camPos: { x: number; y: number; z: number },
  groundHeightAt: (x: number, z: number) => number,
  margin = 0.6,
): number {
  const ground = groundHeightAt(camPos.x, camPos.z);
  return camPos.y < ground + margin ? ground + margin : camPos.y;
}

export interface CameraPosition {
  x: number;
  y: number;
  z: number;
}

/**
 * Compute camera position from orbit state + target position.
 */
export function computeCameraPosition(
  cam: CameraState,
  target: { x: number; y: number; z: number },
): CameraPosition {
  const clampedPitch = clamp(cam.pitch, -0.8, 1.2);
  const cosPitch = Math.cos(clampedPitch);
  const sinPitch = Math.sin(clampedPitch);
  const cosYaw = Math.cos(cam.yaw);
  const sinYaw = Math.sin(cam.yaw);

  return {
    x: target.x + cam.distance * cosPitch * sinYaw,
    y: target.y + cam.height + cam.distance * sinPitch,
    z: target.z + cam.distance * cosPitch * cosYaw,
  };
}

/**
 * Smooth toward target using frame-rate-independent exponential smoothing.
 * rate ≈ 5 (floaty) .. 12 (snappy)
 *
 * Formula: t = 1 - exp(-rate * dt)
 * This converges at the same rate regardless of frame time.
 */
export function smoothCameraTowards(
  current: CameraState,
  target: CameraState,
  rate: number,
  dt: number,
): CameraState {
  const t = 1 - Math.exp(-rate * dt);

  return {
    yaw: lerpAngle(current.yaw, target.yaw, t),
    pitch: current.pitch + (target.pitch - current.pitch) * t,
    distance: current.distance + (target.distance - current.distance) * t,
    height: current.height + (target.height - current.height) * t,
  };
}

/**
 * @deprecated Use smoothCameraTowards with delta time instead.
 * Legacy per-frame lerp kept for reference.
 */
export function lerpCamera(
  from: CameraState,
  to: CameraState,
  t: number,
): CameraState {
  return {
    yaw: lerpAngle(from.yaw, to.yaw, t),
    pitch: from.pitch + (to.pitch - from.pitch) * t,
    distance: from.distance + (to.distance - from.distance) * t,
    height: from.height + (to.height - from.height) * t,
  };
}

/**
 * Clamp pitch to prevent camera flipping.
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function lerpAngle(a: number, b: number, t: number): number {
  let diff = b - a;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  return a + diff * t;
}
