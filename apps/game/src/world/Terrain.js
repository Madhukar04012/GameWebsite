import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from "react";
import { PlaneGeometry } from "three";
import { heightAt } from "@legend/engine";
import { WORLD_BOUNDS } from "@legend/shared";
import { createTerrainMaterial } from "../materials/createTerrainMaterial";
import { useQualitySettings } from "../systems/GraphicsScalability";
/**
 * Terrain — chunked, height-displaced ground replacing the flat plane.
 *
 * The world is divided into CHUNK_SIZE tiles, each its own geometry so R3F
 * can frustum-cull per-chunk (P12 performance). Vertex y is set from
 * `heightAt`; albedo is derived in the fragment shader from world position +
 * slope + fbm (see createTerrainMaterial) so ground blends without textures.
 * Additional regions stream in by adding more chunks — the chunk grid is the
 * future streaming primitive.
 */
const CHUNK = WORLD_BOUNDS.citySize / 4; // ~23-unit chunks around the city
const TILES = Math.ceil(WORLD_BOUNDS.terrainSize / CHUNK);
// Module-level cache for terrain material instances
const terrainMatCache = new Map();
function getSharedTerrainMaterial(x, z) {
    const key = `${Math.round(x * 0.137)},${Math.round(z * 0.137)}`;
    if (!terrainMatCache.has(key)) {
        terrainMatCache.set(key, createTerrainMaterial({ seed: [x * 0.137, z * 0.137] }));
    }
    return terrainMatCache.get(key);
}
export function Terrain() {
    const settings = useQualitySettings();
    const seg = Math.max(8, settings.geometrySegments || 24);
    const tiles = useMemo(() => {
        const list = [];
        for (let ix = -TILES / 2; ix < TILES / 2; ix++) {
            for (let iz = -TILES / 2; iz < TILES / 2; iz++) {
                list.push({ x: ix * CHUNK, z: iz * CHUNK, key: `tile-${ix}-${iz}` });
            }
        }
        return list;
    }, []);
    return (_jsx("group", { children: tiles.map((t) => (_jsx(TerrainTile, { x: t.x, z: t.z, size: CHUNK, seg: seg }, t.key))) }));
}
function TerrainTile({ x, z, size, seg }) {
    const geometry = useMemo(() => {
        const geo = new PlaneGeometry(size, size, seg, seg);
        const pos = geo.attributes.position;
        // Plane is XY; rotate -PI/2 around X so it lies in XZ. We do it per-vertex
        // below rather than mesh rotation so normals match displacement.
        for (let i = 0; i < pos.count; i++) {
            const px = pos.getX(i) + x;
            const py = pos.getY(i) + z;
            const h = heightAt(px, py);
            pos.setZ(i, h);
        }
        geo.computeVertexNormals();
        return geo;
    }, [x, z, size, seg]);
    // Cached material instance per seed position
    const material = useMemo(() => getSharedTerrainMaterial(x, z), [x, z]);
    return (_jsx("mesh", { geometry: geometry, rotation: [-Math.PI / 2, 0, 0], position: [x, 0, z], material: material, receiveShadow: true }));
}
//# sourceMappingURL=Terrain.js.map