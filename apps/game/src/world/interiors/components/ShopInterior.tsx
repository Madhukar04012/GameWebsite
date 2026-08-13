import React from "react";
import { createWoodMaterial } from "../../../materials/createWoodMaterial";
import { createStoneMaterial } from "../../../materials/createStoneMaterial";
import { useWorldStore } from "../../../store/worldStore";

const woodDark = createWoodMaterial({ woodColor: "#3a2416", roughness: 0.9 });
const woodMid = createWoodMaterial({ woodColor: "#5c3c24", roughness: 0.85 });
const stoneFloor = createStoneMaterial({ stoneColor: "#555248", roughness: 0.9 });

export function ShopInterior({ w, d, storyH }: { w: number; d: number; storyH: number }) {
  const isNight = useWorldStore((s: any) => s.timeOfDay >= 18 || s.timeOfDay <= 6);
  const lightIntensity = isNight ? 1.0 : 0.4;

  return (
    <group>
      {/* Floor */}
      <mesh position={[0, 0.05, 0]} receiveShadow material={stoneFloor}>
        <boxGeometry args={[w - 0.2, 0.1, d - 0.2]} />
      </mesh>
      
      {/* Display Counters */}
      <group position={[0, 0.5, 0]}>
        <mesh position={[-w/4 + 0.5, 0, 0]} castShadow receiveShadow material={woodDark}>
          <boxGeometry args={[w/2 - 1.5, 1.0, 0.8]} />
        </mesh>
        <mesh position={[w/4 - 0.5, 0, 0]} castShadow receiveShadow material={woodDark}>
          <boxGeometry args={[w/2 - 1.5, 1.0, 0.8]} />
        </mesh>
      </group>

      {/* Shelving against back wall */}
      <group position={[0, 1.2, -d/2 + 0.3]}>
        <mesh castShadow receiveShadow material={woodMid}>
          <boxGeometry args={[w - 1.0, 2.4, 0.4]} />
        </mesh>
        {Array.from({ length: 4 }).map((_, i) => (
          <mesh key={i} position={[0, -1.0 + i * 0.6, 0.2]} castShadow receiveShadow material={woodDark}>
            <boxGeometry args={[w - 1.2, 0.05, 0.3]} />
          </mesh>
        ))}
      </group>

      {/* Main Light */}
      <pointLight position={[0, storyH - 0.5, 0]} intensity={lightIntensity} distance={8} color="#ffd480" castShadow />
    </group>
  );
}
