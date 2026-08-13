import { createWoodMaterial } from "../../../materials/createWoodMaterial";
import { createStoneMaterial } from "../../../materials/createStoneMaterial";
import { createFabricMaterial } from "../../../materials/createFabricMaterial";
import { useWorldStore } from "../../../store/worldStore";

const woodDark = createWoodMaterial({ woodColor: "#352216", roughness: 0.8 });
const marble = createStoneMaterial({ stoneColor: "#ffffff", roughness: 0.4, metalness: 0.1 });
const richCarpet = createFabricMaterial({ kind: "banner", color: "#3a1860" });

export function ManorInterior({ w, d, storyH }: { w: number; d: number; storyH: number }) {
  const isNight = useWorldStore((s: any) => s.timeOfDay >= 18 || s.timeOfDay <= 6);
  const lightIntensity = isNight ? 1.0 : 0.5;

  return (
    <group>
      {/* Floor */}
      <mesh position={[0, 0.05, 0]} receiveShadow material={marble}>
        <boxGeometry args={[w - 0.2, 0.1, d - 0.2]} />
      </mesh>
      
      {/* Circular Carpet */}
      <mesh position={[0, 0.11, 0]} receiveShadow material={richCarpet} rotation={[-Math.PI/2, 0, 0]}>
        <circleGeometry args={[Math.min(w, d) * 0.35, 32]} />
      </mesh>

      {/* Dining Table */}
      <group position={[0, 0.5, 0]}>
        <mesh castShadow receiveShadow material={woodDark}>
          <boxGeometry args={[w * 0.5, 0.1, 1.2]} />
        </mesh>
        <mesh position={[-w * 0.2, -0.2, 0]} castShadow receiveShadow material={woodDark}>
          <cylinderGeometry args={[0.08, 0.08, 0.5]} />
        </mesh>
        <mesh position={[w * 0.2, -0.2, 0]} castShadow receiveShadow material={woodDark}>
           <cylinderGeometry args={[0.08, 0.08, 0.5]} />
        </mesh>
      </group>

      {/* Light */}
      <pointLight position={[0, storyH - 0.5, 0]} intensity={lightIntensity} distance={10} color="#ffddaa" castShadow />
    </group>
  );
}
