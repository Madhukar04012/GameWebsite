import { useMemo } from "react";
import { heightAt } from "@legend/engine";
import type { BuildingDef } from "@legend/shared";
import { createStoneMaterial } from "../materials/createStoneMaterial";

interface CityBuildingProps {
  def: BuildingDef;
  color: string;
}

/**
 * Modular placeholder building. Dispatches a roof silhouette by `def.roof`
 * for readable blockout silhouettes (castle dome/tower, gable houses, market
 * flats). Sits on terrain height so hills don't clip the base.
 */
export function CityBuilding({ def, color = "#cccccc" }: CityBuildingProps) {
  const { x, z, w, d, h, roof = "gable" } = def;
  const roofH = Math.max(0.5, h * 0.28);
  const baseY = useMemo(() => heightAt(x, z), [x, z]);

  // One procedural stone material per building (lit/shadowed PBR preserved).
  const wallMat = useMemo(
    () => createStoneMaterial({ stoneColor: color, roughness: 0.8, metalness: 0.1, seed: [x, z] }),
    [color, x, z],
  );
  const roofMat = useMemo(
    () =>
      createStoneMaterial({
        roof: true,
        stoneColor: darken(color, 0.2),
        roughness: 0.6,
        metalness: 0.35,
        seed: [x + 0.7, z + 0.3],
      }),
    [color, x, z],
  );

  const woodMat = useMemo(
    () => createStoneMaterial({ stoneColor: "#3a2318", roughness: 0.95, metalness: 0, seed: [x + 0.1, z + 0.2] }),
    [x, z],
  );

  const beamW = 0.15;
  const corners = [
    [-w / 2, -d / 2],
    [w / 2, -d / 2],
    [-w / 2, d / 2],
    [w / 2, d / 2],
  ];

  return (
    <group position={[x, baseY, z]}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow material={wallMat}>
        <boxGeometry args={[w, h, d]} />
      </mesh>
      
      {/* Corner wooden beams */}
      {corners.map((c, i) => (
        <mesh key={`corner-${i}`} position={[c[0], h / 2, c[1]]} castShadow receiveShadow material={woodMat}>
          <boxGeometry args={[beamW, h + 0.1, beamW]} />
        </mesh>
      ))}
      
      {/* Horizontal mid-beam for taller buildings */}
      {h >= 3 && (
        <mesh position={[0, h / 2, 0]} castShadow receiveShadow material={woodMat}>
          <boxGeometry args={[w + 0.1, beamW, d + 0.1]} />
        </mesh>
      )}
      {/* Gold rune cornice line along the roof base. */}
      <mesh position={[0, h, 0]} castShadow>
        <boxGeometry args={[w * 1.02, 0.15, d * 1.02]} />
        <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={0.6} />
      </mesh>
      <Roof kind={roof} w={w} d={d} h={h} roofH={roofH} material={roofMat} />
      {h > 1.5 && (
        <group>
          {/* Main Door */}
          <mesh position={[0, 0.6, d / 2 + 0.01]}>
            <planeGeometry args={[0.6, 1.2]} />
            <meshStandardMaterial color="#2a1710" />
          </mesh>
          {/* Simple Barrel Prop next to door if building is wide enough */}
          {w > 2.5 && (
            <mesh position={[0.6, 0.35, d / 2 + 0.2]} castShadow receiveShadow>
              <cylinderGeometry args={[0.2, 0.2, 0.5, 8]} />
              <meshStandardMaterial color="#5c3a21" roughness={0.9} />
            </mesh>
          )}
          {/* Simple Crate Prop */}
          {w > 3.0 && (
            <mesh position={[-0.8, 0.3, d / 2 + 0.3]} rotation={[0, 0.2, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.6, 0.6, 0.6]} />
              <meshStandardMaterial color="#6a4a2a" roughness={1.0} />
            </mesh>
          )}
        </group>
      )}
      
      {/* Glowing Windows on Upper Floors */}
      {h >= 3 && (
        <group>
          <mesh position={[-0.4, h * 0.7, d / 2 + 0.01]}>
            <planeGeometry args={[0.4, 0.5]} />
            <meshStandardMaterial color="#ffe5b4" emissive="#ffe5b4" emissiveIntensity={1.5} />
          </mesh>
          <mesh position={[0.4, h * 0.7, d / 2 + 0.01]}>
            <planeGeometry args={[0.4, 0.5]} />
            <meshStandardMaterial color="#ffe5b4" emissive="#ffe5b4" emissiveIntensity={1.5} />
          </mesh>
        </group>
      )}
    </group>
  );
}

function Roof({
  kind, w, d, h, roofH, material,
}: { kind: BuildingDef["roof"]; w: number; d: number; h: number; roofH: number; material: import("three").MeshStandardMaterial }) {
  switch (kind) {
    case "flat":
      return (
        <mesh position={[0, h + 0.1, 0]} castShadow receiveShadow material={material}>
          <boxGeometry args={[w * 0.98, 0.22, d * 0.98]} />
        </mesh>
      );
    case "tower":
      return (
        <>
          <mesh position={[0, h + roofH / 2, 0]} castShadow material={material}>
            <coneGeometry args={[Math.min(w, d) * 0.75, roofH * 1.2, 6]} />
          </mesh>
          <mesh position={[0.22, h + roofH + 0.45, 0]}>
            <planeGeometry args={[0.4, 0.25]} />
            <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={0.3} side={2} />
          </mesh>
        </>
      );
    case "cone":
      return (
        <mesh position={[0, h + roofH / 2, 0]} castShadow material={material}>
          <coneGeometry args={[Math.max(w, d) * 0.7, roofH * 1.4, 8]} />
        </mesh>
      );
    case "dome":
      return (
        <mesh position={[0, h, 0]} castShadow material={material}>
          <sphereGeometry args={[Math.min(w, d) * 0.55, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
      );
    case "gable":
    default:
      return (
        <mesh position={[0, h + roofH / 2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow material={material}>
          <coneGeometry args={[Math.max(w, d) * 1.05, roofH * 1.5, 4]} />
        </mesh>
      );
  }
}

function darken(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, (num >> 16) - Math.round(255 * amount));
  const g = Math.max(0, ((num >> 8) & 0xff) - Math.round(255 * amount));
  const b = Math.max(0, (num & 0xff) - Math.round(255 * amount));
  return `rgb(${r},${g},${b})`;
}
