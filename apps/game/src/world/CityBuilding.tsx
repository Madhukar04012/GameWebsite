import { useWorldStore } from "../store/worldStore";
import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { heightAt } from "@legend/engine";
import type { BuildingDef, ArchFamily } from "@legend/shared";
import { getDistrictMaterials, DistrictMaterialSet, getAllDistrictMaterials } from "../materials/createDistrictMaterials";
import { INTERIOR_REGISTRY } from "./interiors/InteriorRegistry";
import { createStoneMaterial } from "../materials/createStoneMaterial";
import { createWoodMaterial } from "../materials/createWoodMaterial";
import { createMetalMaterial } from "../materials/createMetalMaterial";

const shopSignGoldMat = new THREE.MeshStandardMaterial({ color: "#d4af37", roughness: 0.4, metalness: 0.8 });

interface CityBuildingProps {
  def: BuildingDef;
  color?: string;
  district?: string;
}

export function CityBuilding({ def, color = "#cccccc", district = "residential" }: CityBuildingProps) {
  const { x, z, w, d, h, roof = "gable", floors = 2, family = "residential", isCorner = false, facadeType = "timber", hasBalcony = false, hasChimney = false, shopSign } = def;
  const roofH = Math.max(1.2, h * 0.32);

  const mats = useMemo(() => getDistrictMaterials(district), [district]);
  const { wall, plaster, brick, roof: roofMat, wood, glass, metal, accent, banner } = mats;

  let baseMat = wall;
  let upperMat = wall;
  if (facadeType === "plaster") { baseMat = plaster; upperMat = plaster; }
  else if (facadeType === "brick") { baseMat = brick; upperMat = brick; }
  else if (facadeType === "mixed") { baseMat = wall; upperMat = plaster; }
  else if (facadeType === "timber") { baseMat = plaster; upperMat = plaster; }

  const beamW = 0.18;
  const corners = [
    [-w / 2, -d / 2], [w / 2, -d / 2], [-w / 2, d / 2], [w / 2, d / 2],
  ];

  const { baseY, minH, doorTerrainY } = useMemo(() => {
    let maxH = -Infinity;
    let minH = Infinity;
    const pts = [[0, 0], ...corners];
    for (const [cx, cz] of pts) {
      const h = heightAt(x + cx, z + cz);
      if (h > maxH) maxH = h;
      if (h < minH) minH = h;
    }
    const baseY = maxH + 0.1;
    const doorTerrainY = heightAt(x, z + d / 2);
    return { baseY, minH, doorTerrainY };
  }, [x, z, w, d]);

  const fndHeight = baseY - minH + 1.2;
  const fndCenterY = 0.7 - fndHeight / 2;

  const storyH = h / floors;
  
  // Calculate stairs if door is above terrain
  const stairDrop = baseY - doorTerrainY;
  const stairSteps = stairDrop > 0.2 ? Math.ceil(stairDrop / 0.2) : 0;

  const interiorDef = def.label ? INTERIOR_REGISTRY[def.label] : undefined;

  return (
    <group position={[x, baseY, z]} userData={{ isBuilding: true }}>
      {/* 1. Foundation */}
      <mesh position={[0, fndCenterY, 0]} castShadow receiveShadow material={baseMat}>
        <boxGeometry args={[w + 0.5, fndHeight, d + 0.5]} />
      </mesh>
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow material={wood}>
        <boxGeometry args={[w + 0.25, 0.12, d + 0.25]} />
      </mesh>
      
      {/* Procedural Stairs to Street Level */}
      {stairSteps > 0 && Array.from({ length: stairSteps }).map((_, i) => {
        const stepY = -0.1 - i * 0.2;
        const stepZ = d / 2 + 0.25 + i * 0.3;
        return (
          <mesh key={`stair-${i}`} position={[0, stepY, stepZ]} castShadow receiveShadow material={baseMat}>
            <boxGeometry args={[1.8, 0.2, 0.3]} />
          </mesh>
        );
      })}

      {/* 2. Main Wall */}
      {interiorDef ? (
        <group position={[0, storyH / 2 + 0.3, 0]}>
          <mesh position={[0, 0, -d/2 + 0.1]} castShadow receiveShadow material={baseMat}>
            <boxGeometry args={[w, storyH, 0.2]} />
          </mesh>
          <mesh position={[-w/2 + 0.1, 0, 0]} castShadow receiveShadow material={baseMat}>
            <boxGeometry args={[0.2, storyH, d]} />
          </mesh>
          <mesh position={[w/2 - 0.1, 0, 0]} castShadow receiveShadow material={baseMat}>
            <boxGeometry args={[0.2, storyH, d]} />
          </mesh>
          <mesh position={[-w/4 - 0.3, 0, d/2 - 0.1]} castShadow receiveShadow material={baseMat}>
            <boxGeometry args={[w/2 - 0.6, storyH, 0.2]} />
          </mesh>
          <mesh position={[w/4 + 0.3, 0, d/2 - 0.1]} castShadow receiveShadow material={baseMat}>
            <boxGeometry args={[w/2 - 0.6, storyH, 0.2]} />
          </mesh>
          {storyH > 2.4 && (
            <mesh position={[0, 1.2, d/2 - 0.1]} castShadow receiveShadow material={baseMat}>
              <boxGeometry args={[1.2, storyH - 2.4, 0.2]} />
            </mesh>
          )}
        </group>
      ) : (
        <mesh position={[0, storyH / 2 + 0.3, 0]} castShadow receiveShadow material={baseMat}>
          <boxGeometry args={[w, storyH, d]} />
        </mesh>
      )}
      
      {floors > 1 && (
        <mesh position={[0, storyH + (h - storyH) / 2 + 0.3, 0]} castShadow receiveShadow material={upperMat}>
          <boxGeometry args={[w, h - storyH, d]} />
        </mesh>
      )}

      {/* 3. Timber Framing */}
      {facadeType === "timber" && corners.map((c, i) => (
        <mesh key={`corner-${i}`} position={[c[0], h / 2 + 0.3, c[1]]} castShadow receiveShadow material={wood}>
          <boxGeometry args={[beamW, h + 0.1, beamW]} />
        </mesh>
      ))}

      {/* 4. Jettying & Beams */}
      {Array.from({ length: floors }).map((_, f) => {
        const floorY = (f + 1) * storyH + 0.3;
        if (floorY >= h + 0.2) return null;
        return (
          <group key={`floor-beam-${f}`} position={[0, floorY, 0]}>
            <mesh castShadow receiveShadow material={wood}>
              <boxGeometry args={[w + 0.22, 0.2, d + 0.22]} />
            </mesh>
            {[-w / 2 + 0.4, w / 2 - 0.4].map((bx) => (
              <mesh key={`corbel-${bx}`} position={[bx, -0.15, d / 2 + 0.1]} castShadow material={wood}>
                <boxGeometry args={[0.2, 0.3, 0.25]} />
              </mesh>
            ))}
          </group>
        );
      })}

      <mesh position={[0, h + 0.35, 0]} castShadow material={accent ?? wood}>
        <boxGeometry args={[w * 1.04, 0.16, d * 1.04]} />
      </mesh>

      {/* Roof */}
      <BuildingRoof kind={roof} w={w} d={d} h={h + 0.35} roofH={roofH} material={roofMat} accent={accent} isCorner={isCorner} wood={wood} />

      {interiorDef && (
        <group position={[0, 0.3, 0]}>
           <interiorDef.component w={w} d={d} storyH={storyH} />
        </group>
      )}

      {/* Doors & Ground Floor */}
      <BuildingDoor family={family} w={w} d={d} storyH={storyH} woodMat={wood} metalMat={metal} glassMat={glass} isOpen={!!interiorDef} />

      {/* Windows & Awnings */}
      <BuildingWindows family={family} w={w} d={d} h={h} floors={floors} storyH={storyH} woodMat={wood} glassMat={glass} bannerMat={banner} isCorner={isCorner} />

      {/* Balconies */}
      {hasBalcony && floors >= 2 && (
        <BuildingBalcony family={family} w={Math.min(3.2, w * 0.6)} d={d} floorY={storyH + 0.4} woodMat={wood} stoneMat={wall} metalMat={metal} />
      )}

      {/* Craft External Storage / Piles */}
      {family === "craft" && (
        <BuildingCraftProps w={w} d={d} woodMat={wood} metalMat={metal} />
      )}

      {/* Chimney */}
      {hasChimney && (
        <BuildingChimney w={w} d={d} totalH={h + roofH * (roof === "flat" ? 0.2 : 0.8)} wallMat={brick} />
      )}

      {/* Shop Sign */}
      {shopSign && (
        <BuildingShopSign sign={shopSign} d={d} woodMat={wood} metalMat={metal} />
      )}
    </group>
  );
}

function BuildingRoof({ kind, w, d, h, roofH, material, accent, isCorner, wood }: any) {
  switch (kind) {
    case "flat":
      return (
        <group position={[0, h, 0]}>
          <mesh position={[0, 0.12, 0]} castShadow receiveShadow material={material}>
            <boxGeometry args={[w * 1.02, 0.24, d * 1.02]} />
          </mesh>
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
    case "shallow":
      return (
        <group position={[0, h, 0]}>
          <mesh position={[0, 0.2, 0]} rotation={[0.1, 0, 0]} castShadow material={material}>
            <boxGeometry args={[w * 1.1, 0.2, d * 1.1]} />
          </mesh>
        </group>
      );
    case "hip":
      return (
        <group position={[0, h + roofH / 2, 0]}>
          <mesh rotation={[0, Math.PI / 4, 0]} castShadow material={material}>
             <cylinderGeometry args={[0, Math.max(w, d) * 0.8, roofH * 1.2, 4]} />
          </mesh>
        </group>
      );
    case "mansard":
      return (
        <group position={[0, h + roofH / 2, 0]}>
          <mesh castShadow material={material}>
            <cylinderGeometry args={[Math.min(w, d) * 0.4, Math.min(w, d) * 0.6, roofH * 1.2, 4]} />
          </mesh>
          {/* Iron Cresting */}
          <mesh position={[0, roofH * 0.6 + 0.1, 0]} material={accent ?? wood}>
             <boxGeometry args={[Math.min(w, d) * 0.7, 0.2, Math.min(w, d) * 0.7]} />
          </mesh>
        </group>
      );
    case "double-gable":
      return (
        <group position={[0, h + roofH / 2, 0]}>
           {[-w * 0.25, w * 0.25].map((wx, i) => (
             <mesh key={`gable-${i}`} position={[wx, 0, 0]} rotation={[0, Math.PI / 4, 0]} castShadow material={material}>
               <coneGeometry args={[Math.min(w, d) * 0.5, roofH * 1.4, 4]} />
             </mesh>
           ))}
        </group>
      );
    case "tower":
      return (
        <group position={[0, h, 0]}>
          <mesh position={[0, 0.2, 0]} castShadow material={material}>
            <cylinderGeometry args={[Math.min(w, d) * 0.72, Math.min(w, d) * 0.76, 0.4, 8]} />
          </mesh>
          <mesh position={[0, roofH * 0.7, 0]} castShadow material={material}>
            <coneGeometry args={[Math.min(w, d) * 0.7, roofH * 1.4, 8]} />
          </mesh>
        </group>
      );
    case "cone":
      return (
        <group position={[0, h, 0]}>
          <mesh position={[0, roofH / 2, 0]} castShadow material={material}>
            <coneGeometry args={[Math.max(w, d) * 0.72, roofH * 1.3, 8]} />
          </mesh>
        </group>
      );
    case "dome":
      return (
        <group position={[0, h, 0]}>
          <mesh position={[0, 0, 0]} castShadow material={material}>
            <sphereGeometry args={[Math.min(w, d) * 0.58, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
        </group>
      );
    case "gable":
    default:
      return (
        <group position={[0, h + roofH / 2, 0]}>
          <mesh rotation={[0, Math.PI / 4, 0]} castShadow material={material}>
            <coneGeometry args={[Math.max(w, d) * 1.06, roofH * 1.4, 4]} />
          </mesh>
          {w > 4 && d > 4 && !isCorner && (
            <>
              {[-w * 0.25, w * 0.25].map((dx, i) => (
                <group key={`dormer-${i}`} position={[dx, roofH * 0.1, d * 0.35]}>
                  <mesh castShadow material={wood}>
                    <boxGeometry args={[0.8, 1.2, 0.8]} />
                  </mesh>
                  <mesh position={[0, 0.7, 0]} rotation={[0, Math.PI / 4, 0]} castShadow material={material}>
                    <coneGeometry args={[0.8, 0.6, 4]} />
                  </mesh>
                </group>
              ))}
            </>
          )}
        </group>
      );
  }
}

function BuildingDoor({ family, w, d, storyH, woodMat, metalMat, glassMat, isOpen = false }: any) {
  if (family === "commercial") {
    // Grand double doors for shops
    return (
      <group position={[0, 0, d / 2 + 0.02]}>
        <mesh position={[0, 1.3, 0.02]} castShadow receiveShadow material={woodMat}>
          <boxGeometry args={[1.8, 2.6, 0.14]} />
        </mesh>
        {!isOpen && (
          <>
            <mesh position={[-0.45, 1.25, 0.06]} castShadow material={woodMat}>
              <boxGeometry args={[0.7, 2.3, 0.06]} />
            </mesh>
            <mesh position={[0.45, 1.25, 0.06]} castShadow material={woodMat}>
              <boxGeometry args={[0.7, 2.3, 0.06]} />
            </mesh>
            {/* Glass panels */}
            <mesh position={[-0.45, 1.7, 0.1]} material={glassMat}>
              <planeGeometry args={[0.4, 0.8]} />
            </mesh>
            <mesh position={[0.45, 1.7, 0.1]} material={glassMat}>
              <planeGeometry args={[0.4, 0.8]} />
            </mesh>
          </>
        )}
      </group>
    );
  }
  if (family === "craft") {
    // Large double workshop doors
    return (
      <group position={[0, 0, d / 2 + 0.02]}>
        <mesh position={[0, 1.4, 0.06]} castShadow material={woodMat}>
          <boxGeometry args={[2.4, 2.6, 0.1]} />
        </mesh>
        {!isOpen && [-0.6, 0.6].map(hx => (
          <mesh key={`hinge-${hx}`} position={[hx, 1.4, 0.12]} material={metalMat}>
            <boxGeometry args={[0.8, 0.1, 0.04]} />
          </mesh>
        ))}
      </group>
    );
  }
  if (family === "noble") {
    // Ornate stone portal + heavy door
    return (
      <group position={[0, 0, d / 2 + 0.02]}>
        <mesh position={[0, 1.4, 0.15]} castShadow material={woodMat}>
           <boxGeometry args={[1.6, 2.6, 0.4]} />
        </mesh>
        {!isOpen && (
          <mesh position={[0, 1.3, 0.06]} castShadow material={woodMat}>
            <boxGeometry args={[1.2, 2.4, 0.1]} />
          </mesh>
        )}
      </group>
    );
  }
  // Standard residential
  return (
    <group position={[0, 0, d / 2 + 0.02]}>
      <mesh position={[0, 1.15, 0.02]} castShadow receiveShadow material={woodMat}>
        <boxGeometry args={[1.2, 2.3, 0.14]} />
      </mesh>
      {!isOpen && (
        <>
          <mesh position={[-0.26, 1.1, 0.06]} castShadow material={woodMat}>
            <boxGeometry args={[0.48, 2.0, 0.06]} />
          </mesh>
          <mesh position={[0.26, 1.1, 0.06]} castShadow material={woodMat}>
            <boxGeometry args={[0.48, 2.0, 0.06]} />
          </mesh>
        </>
      )}
    </group>
  );
}

function BuildingWindows({ family, w, d, h, floors, storyH, woodMat, glassMat, bannerMat, isCorner }: any) {
  const positions: any[] = [];
  const colsX = Math.max(1, Math.floor(w / 2.2));
  const spacingX = w / (colsX + 1);

  for (let f = 1; f <= floors; f++) {
    const wy = (f - 0.45) * storyH;
    for (let col = 1; col <= colsX; col++) {
      if (f === 1 && colsX > 1 && col === Math.ceil(colsX / 2)) continue;
      if (f === 1 && family === "commercial") continue; // Ground floor commercial handled by doors
      if (f === 1 && family === "craft") continue; // Ground floor craft handled by double doors
      const wx = -w / 2 + col * spacingX;
      positions.push({ pos: [wx, wy, d / 2 + 0.04], rotY: 0, f });
      if (!isCorner) {
        positions.push({ pos: [wx, wy, -d / 2 - 0.04], rotY: Math.PI, f });
      }
    }
    if (d >= 4) {
      const colsZ = Math.max(1, Math.floor(d / 2.2));
      const spacingZ = d / (colsZ + 1);
      for (let col = 1; col <= colsZ; col++) {
        const wz = -d / 2 + col * spacingZ;
        positions.push({ pos: [-w / 2 - 0.04, wy, wz], rotY: -Math.PI / 2, f });
        if (!isCorner) {
           positions.push({ pos: [w / 2 + 0.04, wy, wz], rotY: Math.PI / 2, f });
        }
      }
    }
  }

  return (
    <group>
      {/* Commercial Awning */}
      {family === "commercial" && (
        <mesh position={[0, storyH * 0.9, d / 2 + 0.4]} rotation={[-0.4, 0, 0]} material={bannerMat}>
           <boxGeometry args={[w * 0.9, 0.05, 1.2]} />
        </mesh>
      )}
      
      {positions.map(({ pos, rotY, f }, i) => (
        <group key={`win-${i}`} position={pos} rotation={[0, rotY, 0]}>
           {family === "noble" ? (
             // Tall ornate window
             <group>
               <mesh position={[0, 0.2, 0]} castShadow receiveShadow material={woodMat}>
                 <boxGeometry args={[0.8, 1.4, 0.08]} />
               </mesh>
               <mesh position={[0, 0.2, 0.02]} material={glassMat}>
                 <planeGeometry args={[0.65, 1.2]} />
               </mesh>
             </group>
           ) : family === "craft" ? (
             // Small workshop vent/window
             <group>
               <mesh castShadow receiveShadow material={woodMat}>
                 <boxGeometry args={[0.6, 0.5, 0.08]} />
               </mesh>
               <mesh position={[0, 0, 0.02]} material={glassMat}>
                 <planeGeometry args={[0.4, 0.3]} />
               </mesh>
             </group>
           ) : (
             // Standard residential/commercial upper window
             <group>
               <mesh castShadow receiveShadow material={woodMat}>
                 <boxGeometry args={[0.7, 0.85, 0.08]} />
               </mesh>
               <mesh position={[0, 0, 0.02]} material={glassMat}>
                 <planeGeometry args={[0.55, 0.7]} />
               </mesh>
               <mesh position={[-0.42, 0, 0.03]} rotation={[0, 0.35, 0]} castShadow material={woodMat}>
                 <boxGeometry args={[0.26, 0.75, 0.03]} />
               </mesh>
               <mesh position={[0.42, 0, 0.03]} rotation={[0, -0.35, 0]} castShadow material={woodMat}>
                 <boxGeometry args={[0.26, 0.75, 0.03]} />
               </mesh>
             </group>
           )}
        </group>
      ))}
    </group>
  );
}

function BuildingBalcony({ family, w, d, floorY, woodMat, stoneMat, metalMat }: any) {
  if (family === "noble") {
    return (
      <group position={[0, floorY, d / 2 + 0.5]}>
        <mesh castShadow material={stoneMat}>
          <boxGeometry args={[w, 0.2, 1.2]} />
        </mesh>
        <mesh position={[0, 0.45, 0.55]} material={stoneMat}>
          <boxGeometry args={[w, 0.15, 0.15]} />
        </mesh>
        {/* Stone pillars */}
        {[-w/2+0.1, 0, w/2-0.1].map(x => (
          <mesh key={`pillar-${x}`} position={[x, 0.25, 0.55]} material={stoneMat}>
            <cylinderGeometry args={[0.05, 0.05, 0.4]} />
          </mesh>
        ))}
      </group>
    );
  }
  return (
    <group position={[0, floorY, d / 2 + 0.5]}>
      <mesh castShadow receiveShadow material={woodMat}>
        <boxGeometry args={[w, 0.12, 1.0]} />
      </mesh>
      {[-w / 2 + 0.3, w / 2 - 0.3].map((bx) => (
        <mesh key={`brace-${bx}`} position={[bx, -0.4, -0.2]} rotation={[0.45, 0, 0]} castShadow material={woodMat}>
          <boxGeometry args={[0.12, 0.8, 0.12]} />
        </mesh>
      ))}
      <mesh position={[0, 0.45, 0.45]} castShadow material={woodMat}>
        <boxGeometry args={[w, 0.08, 0.08]} />
      </mesh>
    </group>
  );
}

function BuildingCraftProps({ w, d, woodMat, metalMat }: any) {
  return (
    <group position={[-w / 2 - 0.4, 0.4, 0]}>
      <mesh castShadow material={woodMat}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
      </mesh>
      <mesh position={[0, 0.6, 0]} castShadow material={metalMat}>
         <cylinderGeometry args={[0.2, 0.2, 0.4]} />
      </mesh>
    </group>
  );
}

function BuildingChimney({ w, d, totalH, wallMat }: any) {
  return (
    <group position={[-w * 0.32, totalH * 0.6, d * 0.28]}>
      <mesh castShadow receiveShadow material={wallMat}>
        <boxGeometry args={[0.7, totalH * 0.8, 0.7]} />
      </mesh>
      <mesh position={[0, totalH * 0.4 + 0.1, 0]} castShadow material={wallMat}>
        <boxGeometry args={[0.9, 0.15, 0.9]} />
      </mesh>
      <mesh position={[0, totalH * 0.4 + 0.3, 0]} castShadow material={wallMat}>
        <cylinderGeometry args={[0.18, 0.22, 0.35, 8]} />
      </mesh>
    </group>
  );
}

function BuildingShopSign({ sign, d, woodMat, metalMat }: any) {
  return (
    <group position={[1.4, 2.2, d / 2 + 0.05]}>
      <mesh position={[0, 0, 0.35]} material={metalMat}>
        <boxGeometry args={[0.05, 0.05, 0.7]} />
      </mesh>
      <mesh position={[0, -0.2, 0.2]} rotation={[0.6, 0, 0]} material={metalMat}>
        <boxGeometry args={[0.04, 0.5, 0.04]} />
      </mesh>
      <mesh position={[0, -0.3, 0.55]} castShadow material={woodMat}>
        <boxGeometry args={[0.06, 0.5, 0.5]} />
      </mesh>
      <mesh position={[0.04, -0.3, 0.55]} rotation={[0, Math.PI / 2, 0]} material={shopSignGoldMat}>
        <circleGeometry args={[0.16, 8]} />
      </mesh>
    </group>
  );
}

export function NightLightingUpdater() {
  const timeOfDay = useWorldStore(s => s.timeOfDay);
  const isNight = timeOfDay >= 18 || timeOfDay <= 6;
  const cachedMats = useMemo(() => getAllDistrictMaterials(), []);
  useFrame(() => {
    const target = isNight ? 1 : 0;
    for (const mat of cachedMats) {
      if (mat.glass) {
        if (!mat.glass.userData.baseEmissive) {
           mat.glass.userData.baseEmissive = mat.glass.color.clone();
        }
        mat.glass.emissive.copy(mat.glass.userData.baseEmissive).multiplyScalar(0.8);
        mat.glass.emissiveIntensity = THREE.MathUtils.lerp(
          mat.glass.emissiveIntensity,
          target,
          0.05
        );
      }
    }
  });
  return null;
}
