/**
 * WorldStreaming -- pure-logic chunk-based world streaming.
 *
 * Determines which chunks are visible from a player position,
 * computes LOD distance bands, and produces load/unload diffs
 * against the previously loaded set.
 *
 * No framework dependencies. Pure functions only.
 */
/** Integer chunk coordinate in grid space. */
export interface ChunkCoord {
    x: number;
    z: number;
}
/** Detail level assigned to a chunk based on distance from player. */
export type LodBand = "high" | "medium" | "low";
/** A chunk coordinate paired with its target LOD. */
export interface ChunkWithLod {
    coord: ChunkCoord;
    lod: LodBand;
}
/** Result of comparing visible set against currently loaded set. */
export interface StreamingDiff {
    /** Chunks to load (new or LOD-changed). */
    toLoad: ChunkWithLod[];
    /** Chunks to fully unload (no longer visible). */
    toUnload: ChunkCoord[];
}
/** Configuration parameters for streaming. */
export interface StreamingConfig {
    /** World units per chunk side. */
    chunkSize: number;
    /** Maximum world-unit distance at which chunks are kept loaded. */
    viewDist: number;
    /** Chunks within this distance (in chunk units) get "high" LOD. */
    nearBand: number;
    /** Chunks within this distance (in chunk units) get "medium" LOD; beyond gets "low". */
    midBand: number;
}
export declare const DEFAULT_STREAMING_CONFIG: StreamingConfig;
/** Convert world-space position to the containing chunk coordinate. */
export declare function worldToChunk(worldX: number, worldZ: number, chunkSize: number): ChunkCoord;
/** Serialize a chunk coordinate into a string key for map/set lookups. */
export declare function chunkKey(coord: ChunkCoord): string;
/**
 * Determine LOD band for a given chunk-center distance.
 *
 * @param distChunks  Distance from player chunk in chunk units.
 * @param nearBand    Chunks within this distance get "high".
 * @param midBand     Chunks within this distance get "medium"; beyond gets "low".
 */
export declare function lodForDistance(distChunks: number, nearBand: number, midBand: number): LodBand;
/** Parse a chunkKey string back into a ChunkCoord. */
export declare function parseChunkKey(key: string): ChunkCoord;
/**
 * Compute the set of chunks visible from a world position.
 *
 * Iterates a square grid within the view radius, filters to a circle,
 * and assigns each visible chunk an LOD band based on its distance from
 * the player's chunk center.
 */
export declare function chunksInView(playerX: number, playerZ: number, viewDist: number, chunkSize: number, nearBand: number, midBand: number): ChunkWithLod[];
/**
 * Compute the load/unload diff between a newly computed visible set
 * and the currently loaded set.
 *
 * Chunks whose LOD has changed are returned in **both** toUnload and
 * toLoad so the consumer can teardown and rebuild at the correct detail.
 */
export declare function diffChunks(visible: ChunkWithLod[], loaded: ReadonlyMap<string, LodBand>): StreamingDiff;
//# sourceMappingURL=WorldStreaming.d.ts.map