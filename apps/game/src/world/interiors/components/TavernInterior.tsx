import React from "react";
import { createWoodMaterial } from "../../../materials/createWoodMaterial";
import { createStoneMaterial } from "../../../materials/createStoneMaterial";
import { createMetalMaterial } from "../../../materials/createMetalMaterial";
import { useWorldStore } from "../../../store/worldStore";

const woodDark = createWoodMaterial({ woodColor: "#3a2416", roughness: 0.9 });
const woodMid = createWoodMaterial({ woodColor: "#5c3c24", roughness: 0.85 });
const woodLight = createWoodMaterial({ woodColor: "#8c6239", roughness: 0.8 });
const stoneFloor = createStoneMaterial({ stoneColor: "#403e3b", roughness: 0.95 });
const iron = createMetalMaterial({ kind: "iron" });

export function TavernInterior({ w, d, storyH }: { w: number; d: number; storyH: number }) {
  const isNight = useWorldStore((s: any) => s.timeOfDay >= 18 || s.timeOfDay <= 6);
  const lightIntensity = isNight ? 1.5 : 0.5;

  return (
    <group>
      {/* Floor */}
      <mesh position={[0, 0.05, 0]} receiveShadow material={woodDark}>
        <boxGeometry args={[w - 0.2, 0.1, d - 0.2]} />
      </mesh>
      
      {/* Bar Counter */}
      <group position={[-w/4, 0.6, -d/4]}>
        <mesh castShadow receiveShadow material={woodMid}>
          <boxGeometry args={[w/2 - 1, 1.1, 0.8]} />
        </mesh>
        <mesh position={[0, 0.6, 0]} castShadow receiveShadow material={woodLight}>
          <boxGeometry args={[w/2 - 0.8, 0.1, 1.0]} />
        </mesh>
      </group>

      {/* Dining Tables */}
      {[ {x: w/4, z: d/4}, {x: w/4, z: -d/4}, {x: -w/4, z: d/4} ].map((pos, i) => (
        <group key={i} position={[pos.x, 0.45, pos.z]}>
          <mesh castShadow receiveShadow material={woodMid}>
            <cylinderGeometry args={[0.6, 0.6, 0.1, 12]} />
          </mesh>
          <mesh position={[0, -0.2, 0]} castShadow receiveShadow material={woodDark}>
            <cylinderGeometry args={[0.1, 0.1, 0.4, 8]} />
          </mesh>
          <mesh position={[0, 0.1, 0]} material={iron}>
            <cylinderGeometry args={[0.05, 0.05, 0.1, 6]} />
          </mesh>
          <pointLight position={[0, 0.3, 0]} intensity={lightIntensity * 0.5} distance={3} color="#ffb366" />
        </group>
      ))}

      {/* Fireplace Hearth */}
      <group position={[0, 1.2, -d/2 + 0.4]}>
        <mesh castShadow receiveShadow material={stoneFloor}>
          <boxGeometry args={[2.5, 2.4, 0.8]} />
        </mesh>
        <mesh position={[0, -0.6, 0.3]} material={iron}>
          <boxGeometry args={[1.5, 1.0, 0.6]} />
        </mesh>
        <pointLight position={[0, -0.5, 0.6]} intensity={lightIntensity * 2} distance={8} color="#ff6600" />
      </group>

      {/* Stairs to Upper Floor */}
      <group position={[w/2 - 0.8, 1, 0]}>
        {Array.from({length: 8}).map((_, i) => (
          <mesh key={`stair-${i}`} position={[0, i * 0.25 - 0.8, i * 0.25 - 0.8]} castShadow receiveShadow material={woodMid}>
            <boxGeometry args={[1.2, 0.1, 0.3]} />
          </mesh>
        ))}
      </group>

      {/* Main Chandelier */}
      <pointLight position={[0, storyH - 0.5, 0]} intensity={lightIntensity} distance={10} color="#ffd480" castShadow />
    </group>
  );
}
