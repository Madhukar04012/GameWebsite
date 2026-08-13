import { useMemo } from "react";
import { heightAt } from "@legend/engine";
import type { BuildingDef } from "@legend/shared";
import { createStoneMaterial } from "../materials/createStoneMaterial";
import { createWoodMaterial } from "../materials/createWoodMaterial";
import { getDistrictMaterials } from "../materials/createDistrictMaterials";
import { createGlassMaterial } from "../materials/createGlassMaterial";
import { createMetalMaterial } from "../materials/createMetalMaterial";

interface CityBuildingProps {
  def: BuildingDef;
  color: string;
  /** District name for material palette selection. */
  district?: string;
}

/**
 * Modular placeholder building with district-specific materials.
 * Dispatches roof silhouette by `def.roof`. Adds glass windows,
 * metal grilles, wooden shutters, and detailed doors.
 */
export function CityBuilding({ def, color = "#cccccc", district = "residential" }: CityBuildingProps) {
  const { x, z, w, d, h, roof = "gable" } = def;
  const roofH = Math.max(0.5, h * 0.28);
  const baseY = useMemo(() => heightAt(x, z), [x, z]);

  // District material palette (memo-stable per district)
  const { wall, roof: roofMat, wood, glass, banner, metal, accent } = useMemo(
    () => getDistrictMaterials(district),
    [district],
  );

  const beamW = 0.15;
  const corners = [
    [-w / 2, -d / 2],
    [w / 2, -d / 2],
    [-w / 2, d / 2],
    [w / 2, d / 2],
  ];

  // Window positions (front + sides) — scaled to building size
  const windowPositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    const cols = Math.max(1, Math.floor(w / 1.8));
    const rows = Math.max(1, Math.floor(h / 1.8));
    const spacingX = w / (cols + 1);
    const spacingY = h / (rows + 1);
    for (let row = 1; row <= rows; row++) {
      for (let col = 1; col <= cols; col++) {
        const wx = -w / 2 + col * spacingX;
        const wy = row * spacingY;
        // Front face
        positions.push([wx, wy, d / 2 + 0.02]);
        // Back face
        positions.push([wx, wy, -d / 2 - 0.02]);
      }
    }
    // Side faces (if deep enough)
    if (d > 3) {
      const sideCols = Math.max(1, Math.floor(d / 2));
      const sideSpacing = d / (sideCols + 1);
      for (let row = 1; row <= rows; row++) {
        for (let col = 1; col <= sideCols; col++) {
          const wz = -d / 2 + col * sideSpacing;
          const wy = row * spacingY;
          // Left face
          positions.push([-w / 2 - 0.02, wy, wz]);
          // Right face
          positions.push([w / 2 + 0.02, wy, wz]);
        }
      }
    }
    return positions;
  }, [w, d, h]);

  return (
    <group position={[x, baseY, z]}>
      {/* Submerged Stone Foundation Plinth — guarantees zero floating gaps */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow material={wall}>
        <boxGeometry args={[w + 0.35, 0.6, d + 0.35]} />
      </mesh>

      {/* Main wall volume */}
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow material={wall}>
        <boxGeometry args={[w, h, d]} />
      </mesh>

      {/* Corner wooden beams */}
      {corners.map((c, i) => (
        <mesh key={`corner-${i}`} position={[c[0], h / 2, c[1]]} castShadow receiveShadow material={wood}>
          <boxGeometry args={[beamW, h + 0.1, beamW]} />
        </mesh>
      ))}

      {/* Horizontal mid-beam for taller buildings */}
      {h >= 3 && (
        <mesh position={[0, h / 2, 0]} castShadow receiveShadow material={wood}>
          <boxGeometry args={[w + 0.1, beamW, d + 0.1]} />
        </mesh>
      )}

      {/* Gold cornice line at roof base — use accent metal if available, else gold */}
      <mesh position={[0, h, 0]} castShadow material={accent}>
        {!accent && (
          <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={0.6} />
        )}
        <boxGeometry args={[w * 1.02, 0.15, d * 1.02]} />
      </mesh>

      {/* Roof */}
      <Roof kind={roof} w={w} d={d} h={h} roofH={roofH} material={roofMat} />

      {/* Main Door — wood with metal grille */}
      {h > 1.5 && (
        <group>
          {/* Door frame */}
          <mesh position={[0, 0.9, d / 2 + 0.02]} castShadow receiveShadow material={wood}>
            <boxGeometry args={[0.7, 1.8, 0.08]} />
          </mesh>
          {/* Door panels */}
          <mesh position={[0, 0.9, d / 2 + 0.06]} castShadow material={wood}>
            <boxGeometry args={[0.55, 0.85, 0.04]} />
          </mesh>
          <mesh position={[0, 0.9, d / 2 + 0.06]} rotation={[0, 0, 0]}>
            <planeGeometry args={[0.5, 0.8]} />
            <meshStandardMaterial color="#1a1008" />
          </mesh>
          {/* Metal grille on upper door */}
          <mesh position={[0, 1.55, d / 2 + 0.08]} castShadow material={metal}>
            <boxGeometry args={[0.5, 0.3, 0.02]} />
          </mesh>
          {/* Door handle */}
          <mesh position={[0.25, 0.9, d / 2 + 0.09]} castShadow material={metal}>
            <cylinderGeometry args={[0.03, 0.03, 0.06, 6]} />
          </mesh>
        </group>
      )}

      {/* Glazed Windows with frames and shutters */}
      {windowPositions.map(([wx, wy, wz], i) => (
        <group key={`window-${i}`} position={[wx, wy, wz]}>
          {/* Window frame */}
          <mesh position={[0, 0, 0]} castShadow receiveShadow material={wood}>
            <boxGeometry args={[0.55, 0.65, 0.06]} />
          </mesh>
          {/* Glass panes */}
          <mesh position={[0, 0, 0.04]} material={glass}>
            <planeGeometry args={[0.45, 0.55]} />
          </mesh>
          {/* Metal grille (district-specific) */}
          <mesh position={[0, 0, 0.07]} castShadow material={metal}>
            <boxGeometry args={[0.45, 0.06, 0.02]} />
          </mesh>
          <mesh position={[0, 0, 0.07]} castShadow material={metal}>
            <boxGeometry args={[0.06, 0.5, 0.02]} />
          </mesh>
          {/* Wooden shutters (closed at night would be animated) */}
          <mesh position={[-0.32, 0, 0.05]} rotation={[0, Math.PI / 2, 0]} material={wood}>
            <boxGeometry args={[0.03, 0.6, 0.5]} />
          </mesh>
          <mesh position={[0.32, 0, 0.05]} rotation={[0, -Math.PI / 2, 0]} material={wood}>
            <boxGeometry args={[0.03, 0.6, 0.5]} />
          </mesh>
        </group>
      ))}

      {/* Roof chimney for taller buildings */}
      {h >= 4 && roof !== "flat" && (
        <mesh position={[-w * 0.3, h + roofH * 0.6, d * 0.3]} castShadow receiveShadow material={wall}>
          <boxGeometry args={[0.6, roofH * 0.8, 0.6]} />
        </mesh>
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
        <>
          <mesh position={[0, h + 0.1, 0]} castShadow receiveShadow material={material}>
            <boxGeometry args={[w * 0.98, 0.22, d * 0.98]} />
          </mesh>
          {/* Flat roof parapet */}
          <mesh position={[0, h + 0.45, d * 0.45]} castShadow material={material}>
            <boxGeometry args={[w * 0.9, 0.5, 0.3]} />
          </mesh>
          <mesh position={[0, h + 0.45, -d * 0.45]} castShadow material={material}>
            <boxGeometry args={[w * 0.9, 0.5, 0.3]} />
          </mesh>
        </>
      );
    case "tower":
      return (
        <>
          <mesh position={[0, h + roofH / 2, 0]} castShadow material={material}>
            <coneGeometry args={[Math.min(w, d) * 0.75, roofH * 1.2, 8]} />
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
        <>
          <mesh position={[0, h, 0]} castShadow material={material}>
            <sphereGeometry args={[Math.min(w, d) * 0.55, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
          {/* Dome lantern */}
          <mesh position={[0, h + Math.min(w, d) * 0.55, 0]} castShadow material={material}>
            <sphereGeometry args={[0.25, 8, 6]} />
          </mesh>
        </>
      );
    case "gable":
    default:
      return (
        <>
          <mesh position={[0, h + roofH / 2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow material={material}>
            <coneGeometry args={[Math.max(w, d) * 1.05, roofH * 1.5, 4]} />
          </mesh>
          {/* Gable end decoration */}
          <mesh position={[0, h + roofH * 0.85, d * 0.52]} castShadow>
            <planeGeometry args={[w * 0.4, roofH * 0.3]} />
            <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={0.4} side={2} />
          </mesh>
        </>
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