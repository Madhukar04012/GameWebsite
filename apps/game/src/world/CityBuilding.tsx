import { useMemo } from "react";
import * as THREE from "three";
import { heightAt } from "@legend/engine";
import type { BuildingDef } from "@legend/shared";
import { getDistrictMaterials } from "../materials/createDistrictMaterials";

interface CityBuildingProps {
  def: BuildingDef;
  color?: string;
  district?: string;
}

/**
 * AAA Modular City Building Generator.
 *
 * Implements a structured architectural grammar:
 * Foundation -> Timber Framework -> Floor Jettying -> Windows & Shutters ->
 * Doors & Stone Porches -> Balconies & Planters -> Roofs & Dormers -> Chimneys & Shop Signs.
 */
export function CityBuilding({ def, color = "#cccccc", district = "residential" }: CityBuildingProps) {
  const { x, z, w, d, h, roof = "gable", floors = 2, hasBalcony = false, hasChimney = false, shopSign } = def;
  const roofH = Math.max(1.2, h * 0.32);
  const baseY = useMemo(() => heightAt(x, z), [x, z]);

  // District material palette
  const { wall, roof: roofMat, wood, glass, metal, accent, banner } = useMemo(
    () => getDistrictMaterials(district),
    [district],
  );

  const beamW = 0.18;
  const corners = [
    [-w / 2, -d / 2],
    [w / 2, -d / 2],
    [-w / 2, d / 2],
    [w / 2, d / 2],
  ];

  // Window positions across multi-story facades
  const windowPositions = useMemo(() => {
    const positions: { pos: [number, number, number]; rotY: number }[] = [];
    const colsX = Math.max(1, Math.floor(w / 2.2));
    const spacingX = w / (colsX + 1);

    for (let f = 1; f <= floors; f++) {
      const wy = (f - 0.45) * (h / floors);
      // Front face
      for (let col = 1; col <= colsX; col++) {
        // Leave center open on ground floor for the main door
        if (f === 1 && colsX > 1 && col === Math.ceil(colsX / 2)) continue;
        const wx = -w / 2 + col * spacingX;
        positions.push({ pos: [wx, wy, d / 2 + 0.04], rotY: 0 });
        positions.push({ pos: [wx, wy, -d / 2 - 0.04], rotY: Math.PI });
      }

      // Side faces if building is deep enough
      if (d >= 4) {
        const colsZ = Math.max(1, Math.floor(d / 2.2));
        const spacingZ = d / (colsZ + 1);
        for (let col = 1; col <= colsZ; col++) {
          const wz = -d / 2 + col * spacingZ;
          positions.push({ pos: [-w / 2 - 0.04, wy, wz], rotY: -Math.PI / 2 });
          positions.push({ pos: [w / 2 + 0.04, wy, wz], rotY: Math.PI / 2 });
        }
      }
    }
    return positions;
  }, [w, d, h, floors]);

  return (
    <group position={[x, baseY, z]}>
      {/* 1. Foundation: Stepped Stone Base & Water Table Plinth */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow material={wall}>
        <boxGeometry args={[w + 0.5, 0.9, d + 0.5]} />
      </mesh>
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow material={wood}>
        <boxGeometry args={[w + 0.25, 0.12, d + 0.25]} />
      </mesh>

      {/* 2. Main Wall Core Volume */}
      <mesh position={[0, h / 2 + 0.3, 0]} castShadow receiveShadow material={wall}>
        <boxGeometry args={[w, h, d]} />
      </mesh>

      {/* 3. Timber Framing: Vertical Posts at Corners */}
      {corners.map((c, i) => (
        <mesh key={`corner-${i}`} position={[c[0], h / 2 + 0.3, c[1]]} castShadow receiveShadow material={wood}>
          <boxGeometry args={[beamW, h + 0.1, beamW]} />
        </mesh>
      ))}

      {/* 4. Horizontal Story Beams (Jettying) */}
      {Array.from({ length: floors }).map((_, f) => {
        const floorY = (f + 1) * (h / floors) + 0.3;
        if (floorY >= h + 0.2) return null;
        return (
          <group key={`floor-beam-${f}`} position={[0, floorY, 0]}>
            <mesh castShadow receiveShadow material={wood}>
              <boxGeometry args={[w + 0.22, 0.2, d + 0.22]} />
            </mesh>
            {/* Decorative stone/wood corbels under upper stories */}
            {[-w / 2 + 0.4, w / 2 - 0.4].map((bx) => (
              <mesh key={`corbel-${bx}`} position={[bx, -0.15, d / 2 + 0.1]} castShadow material={wood}>
                <boxGeometry args={[0.2, 0.3, 0.25]} />
              </mesh>
            ))}
          </group>
        );
      })}

      {/* 5. Gold / Bronze Cornice Moulding at Eaves */}
      <mesh position={[0, h + 0.35, 0]} castShadow material={accent ?? wood}>
        <boxGeometry args={[w * 1.04, 0.16, d * 1.04]} />
      </mesh>

      {/* 6. Roof Architecture */}
      <BuildingRoof kind={roof} w={w} d={d} h={h + 0.35} roofH={roofH} material={roofMat} accent={accent} />

      {/* 7. Arched Entrance Door with Stone Trim */}
      <BuildingDoor d={d} woodMat={wood} metalMat={metal} />

      {/* 8. Glazed Multi-Pane Windows with Shutters and Grilles */}
      {windowPositions.map(({ pos, rotY }, i) => (
        <BuildingWindow key={`win-${i}`} pos={pos} rotY={rotY} woodMat={wood} glassMat={glass} metalMat={metal} />
      ))}

      {/* 9. Balconies with Carved Railings & Planters */}
      {hasBalcony && floors >= 2 && (
        <BuildingBalcony w={Math.min(3.2, w * 0.6)} d={d} floorY={h / floors + 0.4} woodMat={wood} />
      )}

      {/* 10. Stone Chimney with Smoke */}
      {hasChimney && (
        <BuildingChimney w={w} d={d} totalH={h + roofH * 0.8} wallMat={wall} />
      )}

      {/* 11. Hanging Artisan Shop Sign */}
      {shopSign && (
        <BuildingShopSign sign={shopSign} d={d} woodMat={wood} metalMat={metal} accentMat={accent} />
      )}
    </group>
  );
}

/** Rich Procedural Roofs */
function BuildingRoof({
  kind,
  w,
  d,
  h,
  roofH,
  material,
  accent,
}: {
  kind: BuildingDef["roof"];
  w: number;
  d: number;
  h: number;
  roofH: number;
  material: THREE.MeshStandardMaterial;
  accent?: THREE.MeshStandardMaterial;
}) {
  switch (kind) {
    case "flat":
      return (
        <group position={[0, h, 0]}>
          <mesh position={[0, 0.12, 0]} castShadow receiveShadow material={material}>
            <boxGeometry args={[w * 1.02, 0.24, d * 1.02]} />
          </mesh>
          {/* Parapet with Crenellations */}
          {[-d / 2, d / 2].map((pz, zi) => (
            <mesh key={`parapet-z-${zi}`} position={[0, 0.45, pz]} castShadow material={material}>
              <boxGeometry args={[w * 0.98, 0.5, 0.28]} />
            </mesh>
          ))}
          {[-w / 2, w / 2].map((px, xi) => (
            <mesh key={`parapet-x-${xi}`} position={[px, 0.45, 0]} castShadow material={material}>
              <boxGeometry args={[0.28, 0.5, d * 0.98]} />
            </mesh>
          ))}
        </group>
      );

    case "tower":
      return (
        <group position={[0, h, 0]}>
          {/* Eave flared base */}
          <mesh position={[0, 0.2, 0]} castShadow material={material}>
            <cylinderGeometry args={[Math.min(w, d) * 0.72, Math.min(w, d) * 0.76, 0.4, 8]} />
          </mesh>
          {/* Polygonal Spire */}
          <mesh position={[0, roofH * 0.7, 0]} castShadow material={material}>
            <coneGeometry args={[Math.min(w, d) * 0.7, roofH * 1.4, 8]} />
          </mesh>
          {/* Gold Weather Vane */}
          <mesh position={[0, roofH * 1.4 + 0.35, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.7, 6]} />
            <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={0.6} />
          </mesh>
        </group>
      );

    case "cone":
      return (
        <group position={[0, h, 0]}>
          <mesh position={[0, roofH / 2, 0]} castShadow material={material}>
            <coneGeometry args={[Math.max(w, d) * 0.72, roofH * 1.3, 8]} />
          </mesh>
          <mesh position={[0, roofH * 1.15, 0]} castShadow material={accent ?? material}>
            <sphereGeometry args={[0.3, 8, 8]} />
          </mesh>
        </group>
      );

    case "dome":
      return (
        <group position={[0, h, 0]}>
          <mesh position={[0, 0, 0]} castShadow material={material}>
            <sphereGeometry args={[Math.min(w, d) * 0.58, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
          {/* Dome Ribbing Rings */}
          <mesh position={[0, Math.min(w, d) * 0.28, 0]}>
            <torusGeometry args={[Math.min(w, d) * 0.5, 0.06, 6, 16]} />
            <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={0.5} />
          </mesh>
          {/* Crown Lantern */}
          <mesh position={[0, Math.min(w, d) * 0.58 + 0.3, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.35, 0.6, 8]} />
            <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={0.7} />
          </mesh>
        </group>
      );

    case "gable":
    default:
      return (
        <group position={[0, h + roofH / 2, 0]}>
          {/* Main Sloped Gable Roof */}
          <mesh rotation={[0, Math.PI / 4, 0]} castShadow material={material}>
            <coneGeometry args={[Math.max(w, d) * 1.06, roofH * 1.4, 4]} />
          </mesh>
          {/* Ridge Cresting Line */}
          <mesh position={[0, roofH * 0.72, 0]} castShadow>
            <boxGeometry args={[w * 0.85, 0.12, 0.12]} />
            <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={0.4} />
          </mesh>
          {/* Dormer Windows on long sides */}
          {w > 4 && d > 4 && (
            <>
              {[-w * 0.25, w * 0.25].map((dx, i) => (
                <group key={`dormer-front-${i}`} position={[dx, roofH * 0.1, d * 0.35]}>
                  {/* Dormer walls */}
                  <mesh castShadow material={accent ?? material}>
                    <boxGeometry args={[0.8, 1.2, 0.8]} />
                  </mesh>
                  {/* Dormer roof */}
                  <mesh position={[0, 0.7, 0]} rotation={[0, Math.PI / 4, 0]} castShadow material={material}>
                    <coneGeometry args={[0.8, 0.6, 4]} />
                  </mesh>
                  {/* Dormer glass */}
                  <mesh position={[0, 0, 0.41]} material={accent ?? material}>
                    <planeGeometry args={[0.4, 0.6]} />
                  </mesh>
                </group>
              ))}
            </>
          )}
        </group>
      );
  }
}

/** Detailed Wooden Arched Entry Door */
function BuildingDoor({
  d,
  woodMat,
  metalMat,
}: {
  d: number;
  woodMat: THREE.MeshStandardMaterial;
  metalMat: THREE.MeshStandardMaterial;
}) {
  return (
    <group position={[0, 0, d / 2 + 0.02]}>
      {/* Stone / Timber Door Frame */}
      <mesh position={[0, 1.15, 0.02]} castShadow receiveShadow material={woodMat}>
        <boxGeometry args={[1.2, 2.3, 0.14]} />
      </mesh>
      {/* Recessed Door Leaves */}
      <mesh position={[-0.26, 1.1, 0.06]} castShadow material={woodMat}>
        <boxGeometry args={[0.48, 2.0, 0.06]} />
      </mesh>
      <mesh position={[0.26, 1.1, 0.06]} castShadow material={woodMat}>
        <boxGeometry args={[0.48, 2.0, 0.06]} />
      </mesh>
      {/* Iron Strap Hinges */}
      {[-0.26, 0.26].map((hx) => (
        <group key={`hinge-${hx}`} position={[hx, 0, 0.09]}>
          <mesh position={[0, 1.7, 0]} material={metalMat}>
            <boxGeometry args={[0.4, 0.04, 0.02]} />
          </mesh>
          <mesh position={[0, 0.5, 0]} material={metalMat}>
            <boxGeometry args={[0.4, 0.04, 0.02]} />
          </mesh>
        </group>
      ))}
      {/* Iron Door Knocker Ring */}
      <mesh position={[0.15, 1.1, 0.1]} material={metalMat}>
        <torusGeometry args={[0.06, 0.015, 6, 8]} />
      </mesh>
      {/* Stone Entry Steps */}
      <mesh position={[0, 0.12, 0.2]} castShadow receiveShadow material={woodMat}>
        <boxGeometry args={[1.6, 0.24, 0.4]} />
      </mesh>
    </group>
  );
}

/** Recessed Multi-Pane Window */
function BuildingWindow({
  pos,
  rotY,
  woodMat,
  glassMat,
  metalMat,
}: {
  pos: [number, number, number];
  rotY: number;
  woodMat: THREE.MeshStandardMaterial;
  glassMat: THREE.MeshStandardMaterial;
  metalMat: THREE.MeshStandardMaterial;
}) {
  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      {/* Timber Window Frame */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow material={woodMat}>
        <boxGeometry args={[0.7, 0.85, 0.08]} />
      </mesh>
      {/* Glass Pane with Warm Interior Glow */}
      <mesh position={[0, 0, 0.02]} material={glassMat}>
        <planeGeometry args={[0.55, 0.7]} />
      </mesh>
      {/* Wooden Mullions / Crossbar */}
      <mesh position={[0, 0, 0.04]} material={woodMat}>
        <boxGeometry args={[0.55, 0.04, 0.02]} />
      </mesh>
      <mesh position={[0, 0, 0.04]} material={woodMat}>
        <boxGeometry args={[0.04, 0.7, 0.02]} />
      </mesh>
      {/* Wooden Window Shutters */}
      <mesh position={[-0.42, 0, 0.03]} rotation={[0, 0.35, 0]} castShadow material={woodMat}>
        <boxGeometry args={[0.26, 0.75, 0.03]} />
      </mesh>
      <mesh position={[0.42, 0, 0.03]} rotation={[0, -0.35, 0]} castShadow material={woodMat}>
        <boxGeometry args={[0.26, 0.75, 0.03]} />
      </mesh>
    </group>
  );
}

/** Wooden Balcony with Balustrades & Flower Planters */
function BuildingBalcony({
  w,
  d,
  floorY,
  woodMat,
}: {
  w: number;
  d: number;
  floorY: number;
  woodMat: THREE.MeshStandardMaterial;
}) {
  return (
    <group position={[0, floorY, d / 2 + 0.5]}>
      {/* Balcony Timber Deck */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow material={woodMat}>
        <boxGeometry args={[w, 0.12, 1.0]} />
      </mesh>
      {/* Support Timber Braces */}
      {[-w / 2 + 0.3, w / 2 - 0.3].map((bx) => (
        <mesh key={`brace-${bx}`} position={[bx, -0.4, -0.2]} rotation={[0.45, 0, 0]} castShadow material={woodMat}>
          <boxGeometry args={[0.12, 0.8, 0.12]} />
        </mesh>
      ))}
      {/* Railings */}
      <mesh position={[0, 0.45, 0.45]} castShadow material={woodMat}>
        <boxGeometry args={[w, 0.08, 0.08]} />
      </mesh>
      {/* Flower Planter Box */}
      <mesh position={[0, 0.25, 0.48]} castShadow material={woodMat}>
        <boxGeometry args={[w * 0.85, 0.2, 0.18]} />
      </mesh>
      {/* Colorful Flowers */}
      {[-0.6, -0.2, 0.2, 0.6].map((fx, i) => (
        <mesh key={`flower-${i}`} position={[fx * (w * 0.4), 0.4, 0.48]}>
          <sphereGeometry args={[0.08, 6, 6]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#f72585" : "#4cc9f0"} emissive={i % 2 === 0 ? "#7209b7" : "#4361ee"} emissiveIntensity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

/** Stone Chimney */
function BuildingChimney({
  w,
  d,
  totalH,
  wallMat,
}: {
  w: number;
  d: number;
  totalH: number;
  wallMat: THREE.MeshStandardMaterial;
}) {
  return (
    <group position={[-w * 0.32, totalH * 0.6, d * 0.28]}>
      <mesh castShadow receiveShadow material={wallMat}>
        <boxGeometry args={[0.7, totalH * 0.8, 0.7]} />
      </mesh>
      {/* Chimney Cap */}
      <mesh position={[0, totalH * 0.4 + 0.1, 0]} castShadow material={wallMat}>
        <boxGeometry args={[0.9, 0.15, 0.9]} />
      </mesh>
      {/* Chimney Pot */}
      <mesh position={[0, totalH * 0.4 + 0.3, 0]} castShadow material={wallMat}>
        <cylinderGeometry args={[0.18, 0.22, 0.35, 8]} />
      </mesh>
    </group>
  );
}

/** Hanging Artisan Shop Signs */
function BuildingShopSign({
  sign,
  d,
  woodMat,
  metalMat,
  accentMat,
}: {
  sign: NonNullable<BuildingDef["shopSign"]>;
  d: number;
  woodMat: THREE.MeshStandardMaterial;
  metalMat: THREE.MeshStandardMaterial;
  accentMat?: THREE.MeshStandardMaterial;
}) {
  return (
    <group position={[1.4, 2.2, d / 2 + 0.05]}>
      {/* Wrought Iron Mounting Bracket */}
      <mesh position={[0, 0, 0.35]} material={metalMat}>
        <boxGeometry args={[0.05, 0.05, 0.7]} />
      </mesh>
      <mesh position={[0, -0.2, 0.2]} rotation={[0.6, 0, 0]} material={metalMat}>
        <boxGeometry args={[0.04, 0.5, 0.04]} />
      </mesh>
      {/* Wooden Sign Board */}
      <mesh position={[0, -0.3, 0.55]} castShadow material={woodMat}>
        <boxGeometry args={[0.06, 0.5, 0.5]} />
      </mesh>
      {/* Sign Emblem */}
      <mesh position={[0.04, -0.3, 0.55]} rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[0.16, 8]} />
        <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}