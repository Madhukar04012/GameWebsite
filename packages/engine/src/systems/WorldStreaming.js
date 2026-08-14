/**
 * WorldStreaming -- pure-logic chunk-based world streaming.
 *
 * Determines which chunks are visible from a player position,
 * computes LOD distance bands, and produces load/unload diffs
 * against the previously loaded set.
 *
 * No framework dependencies. Pure functions only.
 */
/* --- Defaults tuned for a 192-unit view, 32-unit chunks --- */
export const DEFAULT_STREAMING_CONFIG = {
    chunkSize: 32,
    viewDist: 192,
    nearBand: 2,
    midBand: 5,
};
/* --- Pure helpers --- */
/** Convert world-space position to the containing chunk coordinate. */
export function worldToChunk(worldX, worldZ, chunkSize) {
    return {
        x: Math.floor(worldX / chunkSize),
        z: Math.floor(worldZ / chunkSize),
    };
}
/** Serialize a chunk coordinate into a string key for map/set lookups. */
export function chunkKey(coord) {
    return `${coord.x},${coord.z}`;
}
/**
 * Determine LOD band for a given chunk-center distance.
 *
 * @param distChunks  Distance from player chunk in chunk units.
 * @param nearBand    Chunks within this distance get "high".
 * @param midBand     Chunks within this distance get "medium"; beyond gets "low".
 */
export function lodForDistance(distChunks, nearBand, midBand) {
    if (distChunks <= nearBand)
        return "high";
    if (distChunks <= midBand)
        return "medium";
    return "low";
}
/** Parse a chunkKey string back into a ChunkCoord. */
export function parseChunkKey(key) {
    const parts = key.split(",");
    return { x: Number(parts[0]), z: Number(parts[1]) };
}
/* --- Higher-level streaming logic --- */
/**
 * Compute the set of chunks visible from a world position.
 *
 * Iterates a square grid within the view radius, filters to a circle,
 * and assigns each visible chunk an LOD band based on its distance from
 * the player's chunk center.
 */
export function chunksInView(playerX, playerZ, viewDist, chunkSize, nearBand, midBand) {
    const center = worldToChunk(playerX, playerZ, chunkSize);
    const radiusChunks = Math.ceil(viewDist / chunkSize);
    const result = [];
    for (let dx = -radiusChunks; dx <= radiusChunks; dx++) {
        for (let dz = -radiusChunks; dz <= radiusChunks; dz++) {
            const distChunks = Math.sqrt(dx * dx + dz * dz);
            // Reject chunks whose center is outside the view circle
            if (distChunks * chunkSize > viewDist)
                continue;
            const coord = { x: center.x + dx, z: center.z + dz };
            const lod = lodForDistance(distChunks, nearBand, midBand);
            result.push({ coord, lod });
        }
    }
    return result;
}
/**
 * Compute the load/unload diff between a newly computed visible set
 * and the currently loaded set.
 *
 * Chunks whose LOD has changed are returned in **both** toUnload and
 * toLoad so the consumer can teardown and rebuild at the correct detail.
 */
export function diffChunks(visible, loaded) {
    const toLoad = [];
    const toUnload = [];
    const newlySeen = new Set();
    for (const entry of visible) {
        const key = chunkKey(entry.coord);
        newlySeen.add(key);
        const currentLod = loaded.get(key);
        if (!currentLod) {
            // Completely new chunk
            toLoad.push(entry);
        }
        else if (currentLod !== entry.lod) {
            // LOD transition -- unload old, reload at new level
            toUnload.push(entry.coord);
            toLoad.push(entry);
        }
        // else: already loaded at correct LOD -- no action
    }
    // Stale chunks no longer in the visible set
    for (const [key] of loaded) {
        if (!newlySeen.has(key)) {
            toUnload.push(parseChunkKey(key));
        }
    }
    return { toLoad, toUnload };
}
//# sourceMappingURL=WorldStreaming.js.map