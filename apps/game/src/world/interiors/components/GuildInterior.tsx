import React from "react";
import { createWoodMaterial } from "../../../materials/createWoodMaterial";
import { createStoneMaterial } from "../../../materials/createStoneMaterial";
import { createFabricMaterial } from "../../../materials/createFabricMaterial";
import { useWorldStore } from "../../../store/worldStore";

const woodDark = createWoodMaterial({ woodColor: "#301d12", roughness: 0.85 });
const woodMid = createWoodMaterial({ woodColor: "#4a2e1c", roughness: 0.8 });
const stoneFloor = createStoneMaterial({ stoneColor: "#6c6a65", roughness: 0.85 });
const redCarpet = createFabricMaterial({ kind: "banner", color: "#a02020" });

export function GuildInterior({ w, d, storyH }: { w: number; d: number; storyH: number }) {
  const isNight = useWorldStore((s: any) => s.timeOfDay >= 18 || s.timeOfDay <= 6);
  const lightIntensity = isNight ? 1.2 : 0.6;

  return (
    <group>
      {/* Floor */}
      <mesh position={[0, 0.05, 0]} receiveShadow material={stoneFloor}>
        <boxGeometry args={[w - 0.2, 0.1, d - 0.2]} />
      </mesh>
      
      {/* Central Carpet */}
      <mesh position={[0, 0.11, 0]} receiveShadow material={redCarpet}>
        <boxGeometry args={[w * 0.4, 0.02, d - 1.0]} />
      </mesh>

      {/* Guildmaster's Desk */}
      <group position={[0, 0.6, -d/2 + 1.2]}>
        <mesh castShadow receiveShadow material={woodDark}>
          <boxGeometry args={[2.0, 1.1, 1.0]} />
        </mesh>
      </group>

      {/* Pillars */}
      {[-w/3, w/3].map(px => 
        [-d/3, d/3].map(pz => (
          <mesh key={`${px}-${pz}`} position={[px, storyH / 2, pz]} castShadow receiveShadow material={woodMid}>
            <cylinderGeometry args={[0.2, 0.2, storyH, 8]} />
          </mesh>
        ))
      )}

      {/* Light */}
      <pointLight position={[0, storyH - 0.8, 0]} intensity={lightIntensity} distance={12} color="#ffeebb" castShadow />
    </group>
  );
}
