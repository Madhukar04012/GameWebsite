import { useMemo } from "react";
import { WORLD_BOUNDS, SOUTH_GATE_POSITION } from "@legend/shared";
import { heightAt } from "@legend/engine";
import { createStoneMaterial } from "../materials/createStoneMaterial";

/**
 * Walls — outer city walls, corner guard towers, and the South Gate.
 *
 * Proportions prioritized over detail. Walls run along the square city bounds
 * with a gap at the South Gate for the main road. The gate itself is a stone
 * frame + two flanking towers sized for future gate traffic.
 *
 * Meshes are simple boxes/cones so they can be replaced by styled blockout
 * assets later without touching placement logic.
 */
const HALF = WORLD_BOUNDS.citySize / 2;
const WALL_H = WORLD_BOUNDS.wallHeight;
const TOWER_H = WORLD_BOUNDS.towerHeight;
const WALL_T = 1.4; // wall thickness
const GAP = 8; // gate opening width

// Shared procedural stone materials (one instance reused across walls/towers).
const wallMat = createStoneMaterial({ stoneColor: 0xe0d6c8, roughness: 0.95 });
const towerMat = createStoneMaterial({ stoneColor: 0xd8cab6, roughness: 0.9, seed: [3.3, 1.1] });
const roofMat = createStoneMaterial({ roof: true, stoneColor: 0xa65330, roughness: 0.65, metalness: 0.35 });

export function Walls() {
  const walls = useMemo(() => {
    const list: { key: string; pos: [number, number, number]; size: [number, number, number] }[] = [];
    // North & south walls split around the south gate
    // North wall full
    list.push({ key: "wall-n", pos: [0, WALL_H / 2, -HALF], size: [WORLD_BOUNDS.citySize, WALL_H, WALL_T] });
    // South wall: two segments leaving center gap at SOUTH_GATE_POSITION
    const segLen = (WORLD_BOUNDS.citySize - GAP) / 2;
    list.push({
      key: "wall-s-w",
      pos: [-(GAP / 2 + segLen / 2), WALL_H / 2, HALF],
      size: [segLen, WALL_H, WALL_T],
    });
    list.push({
      key: "wall-s-e",
      pos: [GAP / 2 + segLen / 2, WALL_H / 2, HALF],
      size: [segLen, WALL_H, WALL_T],
    });
    // East & west walls full
    list.push({ key: "wall-e", pos: [HALF, WALL_H / 2, 0], size: [WALL_T, WALL_H, WORLD_BOUNDS.citySize] });
    list.push({ key: "wall-w", pos: [-HALF, WALL_H / 2, 0], size: [WALL_T, WALL_H, WORLD_BOUNDS.citySize] });
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
      {walls.map((w) => (
        <mesh key={w.key} position={w.pos} castShadow receiveShadow material={wallMat}>
          <boxGeometry args={w.size} />
        </mesh>
      ))}

      {towers.map((t) => (
        <group key={t.key} position={[t.pos[0], heightAt(t.pos[0], t.pos[2]), t.pos[2]]}>
          {/* Tower base */}
          <mesh position={[0, TOWER_H / 2, 0]} castShadow receiveShadow material={towerMat}>
            <cylinderGeometry args={[2.2, 2.6, TOWER_H, 8]} />
          </mesh>
          {/* Crenellated roof */}
          <mesh position={[0, TOWER_H + 1, 0]} castShadow material={roofMat}>
            <coneGeometry args={[2.8, 2.5, 8]} />
          </mesh>
        </group>
      ))}

      {/* South Gate frame — two flanking towers + lintel */}
      <group position={[SOUTH_GATE_POSITION.x, gateBaseY, SOUTH_GATE_POSITION.z]}>
        <mesh position={[-GAP / 2 - 1, TOWER_H / 2, 0]} castShadow receiveShadow material={towerMat}>
          <boxGeometry args={[2, TOWER_H, 3]} />
        </mesh>
        <mesh position={[GAP / 2 + 1, TOWER_H / 2, 0]} castShadow receiveShadow material={towerMat}>
          <boxGeometry args={[2, TOWER_H, 3]} />
        </mesh>
        <mesh position={[0, TOWER_H, 0]} castShadow material={roofMat}>
          <boxGeometry args={[GAP + 4, 1.4, 3]} />
        </mesh>
        <mesh position={[0, TOWER_H + 0.9, 0.4]}>
          <planeGeometry args={[GAP, 0.9]} />
          <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={0.3} />
        </mesh>
      </group>
    </group>
  );
}
