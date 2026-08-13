import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useWorldStore } from "../store/worldStore";
import { heightAt } from "@legend/engine";

/**
 * LandmarkLighting — Time-of-day reactive light sources for lanterns, braziers,
 * watchtowers, and shrines. Point lights automatically ignite as dusk falls
 * (in-game time >= 18 or < 6), casting warm flickering ambient light.
 */

interface LightSpot {
  x: number;
  z: number;
  yOffset?: number;
  color?: string;
  intensity?: number;
  distance?: number;
}

const LIGHT_SPOTS: LightSpot[] = [
  // South Gate Braziers
  { x: -5, z: 22, yOffset: 4.5, color: "#ff8833", intensity: 12, distance: 22 },
  { x: 5, z: 22, yOffset: 4.5, color: "#ff8833", intensity: 12, distance: 22 },

  // Market District Lanterns
  { x: 22, z: 6, yOffset: 3.5, color: "#ffa044", intensity: 8, distance: 18 },
  { x: 26, z: 12, yOffset: 3.5, color: "#ffa044", intensity: 8, distance: 18 },

  // Central Plaza Fountain & Monument
  { x: 0, z: -4, yOffset: 4.0, color: "#d4af37", intensity: 10, distance: 20 },

  // Watchtower Corner Braziers
  { x: -38, z: -38, yOffset: 8.0, color: "#ff7722", intensity: 15, distance: 25 },
  { x: 38, z: -38, yOffset: 8.0, color: "#ff7722", intensity: 15, distance: 25 },
  { x: -38, z: 38, yOffset: 8.0, color: "#ff7722", intensity: 15, distance: 25 },
  { x: 38, z: 38, yOffset: 8.0, color: "#ff7722", intensity: 15, distance: 25 },

  // Ancient Shrines Magic Glow
  { x: -75, z: -40, yOffset: 3.0, color: "#00e5ff", intensity: 14, distance: 20 },
  { x: 80, z: -60, yOffset: 3.0, color: "#00e5ff", intensity: 14, distance: 20 },
];

export function LandmarkLighting() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const timeOfDay = useWorldStore.getState().timeOfDay;
    const isNight = timeOfDay >= 18 || timeOfDay < 6;

    // Flicker animation factor
    const flicker = Math.sin(clock.elapsedTime * 8) * 0.15 + 0.92;

    groupRef.current.children.forEach((child, i) => {
      if (child instanceof THREE.PointLight) {
        const spot = LIGHT_SPOTS[i];
        if (!spot) return;
        const targetIntensity = isNight ? (spot.intensity || 10) * flicker : 0;
        child.intensity = THREE.MathUtils.lerp(child.intensity, targetIntensity, 0.1);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {LIGHT_SPOTS.map((spot, i) => {
        const groundY = heightAt(spot.x, spot.z);
        const y = groundY + (spot.yOffset || 3);
        return (
          <pointLight
            key={`lm-lit-${i}`}
            position={[spot.x, y, spot.z]}
            color={spot.color || "#ffaa44"}
            intensity={0}
            distance={spot.distance || 15}
            decay={2}
          />
        );
      })}
    </group>
  );
}
