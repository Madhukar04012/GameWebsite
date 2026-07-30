import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import {
  computeCameraPosition,
  createDefaultCamera,
  smoothCameraTowards,
  clampDistance,
  resolveCameraCollision,
  heightAt,
} from "@legend/engine";
import type { PlayerAPI } from "./PlayerEntity";
import { useDebugStore } from "../store/debugStore";

const MOUSE_SENSITIVITY = 0.003;
const SMOOTH_RATE = 8; // camera-systems skill: 5=floaty, 12=snappy. 8 is balanced.

interface ThirdPersonCameraProps {
  playerRef: React.RefObject<PlayerAPI | null>;
}

export function ThirdPersonCamera({ playerRef }: ThirdPersonCameraProps) {
  const { camera } = useThree();
  const target = useRef(createDefaultCamera());
  const current = useRef(createDefaultCamera());
  const physics = useDebugStore((s) => s.physics);

  // Mouse look via pointer lock
  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!document.pointerLockElement) return;
      target.current.yaw += e.movementX * MOUSE_SENSITIVITY;
      target.current.pitch = Math.max(
        -0.8,
        Math.min(1.2, target.current.pitch - e.movementY * MOUSE_SENSITIVITY),
      );
    }

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  // Scroll wheel zoom (clamped)
  useEffect(() => {
    function onWheel(e: WheelEvent) {
      const delta = e.deltaY > 0 ? 1.2 : -1.2;
      target.current.distance = clampDistance(target.current.distance + delta);
    }
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  // Click to lock pointer on canvas
  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    function onPointerDown() {
      if (!document.pointerLockElement) {
        canvas?.requestPointerLock();
      }
    }
    canvas?.addEventListener("click", onPointerDown);
    return () => canvas.removeEventListener("click", onPointerDown);
  }, []);

  // Frame-rate-independent exponential smoothing per camera-systems skill
  useFrame((_, delta) => {
    const player = playerRef.current;
    if (!player) return;

    // Smooth toward target using exponential smoothing with delta
    const smoothed = smoothCameraTowards(
      current.current,
      target.current,
      SMOOTH_RATE,
      delta,
    );
    current.current = smoothed;

    // Compute camera world position
    const pos = computeCameraPosition(smoothed, player.position);
    // Terrain collision: never let the camera clip below the ground.
    pos.y = resolveCameraCollision(pos, (x, z) => heightAt(x, z), 0.8);
    camera.position.set(pos.x, pos.y, pos.z);

    // Look at player (slightly above feet for natural centering)
    camera.lookAt(player.position.x, player.position.y + 1.2, player.position.z);

    // Sync yaw so player walks relative to camera facing
    player.setCameraYaw(target.current.yaw);
  });

  return null;
}

