import { useMemo } from "react";
import { WORLD_BOUNDS, SOUTH_GATE_POSITION } from "@legend/shared";
import { heightAt } from "@legend/engine";
import { createStoneMaterial } from "../materials/createStoneMaterial";
import { createMetalMaterial } from "../materials/createMetalMaterial";
import { createWoodMaterial } from "../materials/createWoodMaterial";

/**
 * Walls — outer city walls with battlements, corner towers, and South Gatehouse.
 * Proportions prioritized over detail. Walls run along the square city bounds
 * with a gap at the South Gate for the main road. Gatehouse has portcullis slot,
 * arrow slits, murder holes, and flanking guard rooms.
 */
const HALF = WORLD_BOUNDS.citySize / 2;
const WALL_H = WORLD_BOUNDS.wallHeight;
const TOWER_H = WORLD_BOUNDS.towerHeight;
const WALL_T = 1.4;
const GAP = 8;

const wallMat = createStoneMaterial({ stoneColor: 0xe0d6c8, roughness: 0.95 });
const towerMat = createStoneMaterial({ stoneColor: 0xd8cab6, roughness: 0.9, seed: [3.3, 1.1] });
const roofMat = createStoneMaterial({ roof: true, stoneColor: 0xa65330, roughness: 0.65, metalness: 0.35 });
const darkStone = createStoneMaterial({ stoneColor: 0x4a4652, roughness: 0.92, seed: [2, 9] });
const iron = createMetalMaterial({ kind: "iron", seed: [40, 1] });
const bronze = createMetalMaterial({ kind: "bronze", seed: [40, 2] });
const wood = createWoodMaterial({ woodColor: "#3a2e1c", roughness: 0.9, seed: [40, 3] });

export function Walls() {
  const walls = useMemo(() => {
    const list: { key: string; pos: [number, number, number]; rotY: number; size: [number, number, number] }[] = [];
    
    // Instead of 4 massive boxes, build the wall in shorter segments so it follows the terrain elevation
    const numSegs = 20;
    const segLen = WORLD_BOUNDS.citySize / numSegs;

    const addEdge = (startX: number, startZ: number, endX: number, endZ: number, isSouth: boolean) => {
      for (let i = 0; i < numSegs; i++) {
        const cx = startX + ((endX - startX) * (i + 0.5)) / numSegs;
        const cz = startZ + ((endZ - startZ) * (i + 0.5)) / numSegs;

        // Leave a gap for the South Gate
        if (isSouth && Math.abs(cx) < GAP / 2 + 1) continue;

        const cy = heightAt(cx, cz);
        const rotY = startX === endX ? Math.PI / 2 : 0;
        list.push({ key: `wall-${cx}-${cz}`, pos: [cx, cy + WALL_H / 2, cz], rotY, size: [segLen, WALL_H, WALL_T] });
      }
    };

    addEdge(-HALF, -HALF, HALF, -HALF, false); // North
    addEdge(-HALF, HALF, HALF, HALF, true);    // South
    addEdge(HALF, -HALF, HALF, HALF, false);   // East
    addEdge(-HALF, -HALF, -HALF, HALF, false); // West

    return list;
  }, []);

  const towers = useMemo(
    () => [
      { key: "tower-nw", pos: [-HALF, 0, -HALF] },
      { key: "tower-ne", pos: [HALF, 0, -HALF] },
      { key: "tower-sw", pos: [-HALF, 0, HALF] },
      { key: "tower-se", pos: [HALF, 0, HALF] },
    ],
    [],
  );

  const gateBaseY = heightAt(SOUTH_GATE_POSITION.x, SOUTH_GATE_POSITION.z);

  return (
    <group>
      {/* Wall segments with battlements */}
      {walls.map((w) => (
        <group key={w.key} position={w.pos} rotation={[0, w.rotY, 0]}>
          <mesh castShadow receiveShadow material={wallMat}>
            <boxGeometry args={w.size} />
          </mesh>
          {/* Battlements (merlons) along wall top */}
          <Battlements length={w.size[0]} thickness={w.size[2]} height={w.size[1]} />
        </group>
      ))}

      {/* Corner towers with machicolations */}
      {towers.map((t) => (
        <group key={t.key} position={[t.pos[0], heightAt(t.pos[0], t.pos[2]), t.pos[2]]}>
          <mesh position={[0, TOWER_H / 2, 0]} castShadow receiveShadow material={towerMat}>
            <cylinderGeometry args={[2.2, 2.6, TOWER_H, 8]} />
          </mesh>
          {/* Machicolation gallery */}
          <mesh position={[0, TOWER_H + 0.5, 0]} castShadow material={darkStone}>
            <cylinderGeometry args={[2.8, 2.4, 1, 8]} />
          </mesh>
          {/* Crenellated roof */}
          <mesh position={[0, TOWER_H + 1.8, 0]} castShadow material={roofMat}>
            <coneGeometry args={[2.8, 2.5, 8]} />
          </mesh>
          {/* Tower flag */}
          <mesh position={[2.8, TOWER_H + 2.5, 0]} rotation={[0, 0, -0.2]} castShadow>
            <planeGeometry args={[1.5, 1]} />
            <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={0.3} side={2} />
          </mesh>
        </group>
      ))}

      {/* South Gatehouse — deep portal with portcullis, murder holes, guard rooms */}
      <group position={[SOUTH_GATE_POSITION.x, gateBaseY, SOUTH_GATE_POSITION.z]}>
        {/* Gate passage — recessed into wall thickness */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow material={wallMat}>
          <boxGeometry args={[GAP + 2, WALL_H + 2, WALL_T * 2.5]} />
        </mesh>
        {/* Flanking gate towers */}
        <mesh position={[-GAP / 2 - 1.5, TOWER_H / 2, 0]} castShadow receiveShadow material={towerMat}>
          <boxGeometry args={[3, TOWER_H + 2, 4]} />
        </mesh>
        <mesh position={[GAP / 2 + 1.5, TOWER_H / 2, 0]} castShadow receiveShadow material={towerMat}>
          <boxGeometry args={[3, TOWER_H + 2, 4]} />
        </mesh>
        {/* Gate tower roofs */}
        <mesh position={[-GAP / 2 - 1.5, TOWER_H + 2.5, 0]} castShadow material={roofMat}>
          <coneGeometry args={[2.5, 2, 8]} />
        </mesh>
        <mesh position={[GAP / 2 + 1.5, TOWER_H + 2.5, 0]} castShadow material={roofMat}>
          <coneGeometry args={[2.5, 2, 8]} />
        </mesh>
        {/* Portcullis slot — iron grille in recessed groove */}
        <mesh position={[0, GAP / 2, -WALL_T * 1.3]} castShadow material={iron}>
          <boxGeometry args={[GAP + 0.5, 4, 0.1]} />
        </mesh>
        <mesh position={[0, GAP / 2, -WALL_T * 1.3]} castShadow material={iron}>
          <boxGeometry args={[GAP + 0.5, 0.1, 4]} />
        </mesh>
        {/* Portcullis vertical bars */}
        {Array.from({ length: 9 }, (_, i) => (
          <mesh key={`portcullis-${i}`} position={[-GAP / 2 + 0.5 + i * (GAP / 8), GAP / 2, -WALL_T * 1.35]} castShadow material={iron}>
            <cylinderGeometry args={[0.06, 0.06, 4.2, 6]} />
          </mesh>
        ))}
        {/* Murder holes in ceiling of gate passage */}
        {Array.from({ length: 3 }, (_, i) => (
          <mesh key={`murder-${i}`} position={[-(GAP / 3) + i * (GAP / 3), WALL_H - 0.5, 0]} castShadow material={darkStone}>
            <cylinderGeometry args={[0.3, 0.3, WALL_T * 2.5, 8]} />
          </mesh>
        ))}
        {/* Arrow slits in gate towers */}
        {[-1, 1].map((side) => (
          <group key={`arrow-slit-${side}`} position={[side * (GAP / 2 + 1.5), 3.5, 0]}>
            <mesh position={[0, 0, 1.8]} castShadow material={darkStone}>
              <boxGeometry args={[0.15, 0.5, 0.3]} />
            </mesh>
            <mesh position={[0, -1.2, 1.8]} castShadow material={darkStone}>
              <boxGeometry args={[0.15, 0.5, 0.3]} />
            </mesh>
          </group>
        ))}
        {/* Guard room windows */}
        {[-1, 1].map((side) => (
          <mesh key={`guard-window-${side}`} position={[side * (GAP / 2 + 1.5), 5.5, 1.8]} castShadow>
            <planeGeometry args={[0.6, 0.8]} />
            <meshStandardMaterial color="#ffe5b4" emissive="#ffe5b4" emissiveIntensity={1.2} />
          </mesh>
        ))}
        {/* Gate lintel with heraldry */}
        <mesh position={[0, WALL_H + 0.7, 0]} castShadow material={roofMat}>
          <boxGeometry args={[GAP + 2, 1.2, 4]} />
        </mesh>
        <mesh position={[0, WALL_H + 1.4, 0.5]} castShadow>
          <circleGeometry args={[1.8, 12]} />
          <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={0.5} />
        </mesh>
        {/* Wooden gate doors (closed) */}
        {[-1, 1].map((side) => (
          <mesh key={`gate-door-${side}`} position={[side * (GAP / 4), GAP / 2, -WALL_T * 1.5]} castShadow receiveShadow material={wood}>
            <boxGeometry args={[GAP / 2 + 0.3, GAP, 0.3]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** Repeating merlon battlements along wall top. */
function Battlements({ length, thickness, height }: { length: number; thickness: number; height: number }) {
  const merlonW = 1.2;
  const merlonGap = 0.8;
  const count = Math.floor(length / (merlonW + merlonGap));
  const startX = -length / 2 + merlonW / 2;

  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <mesh
          key={`merlon-${i}`}
          position={[startX + i * (merlonW + merlonGap), height / 2 + 0.5, 0]}
          castShadow
          material={darkStone}
        >
          <boxGeometry args={[merlonW, 1, thickness + 0.2]} />
        </mesh>
      ))}
    </>
  );
}