export { GamePhase, canTransition, assertTransition, PHASE_LABELS } from "./systems/GameStateMachine.js";
export {
  createInitialPlayerState,
  updatePlayer,
} from "./systems/PlayerController.js";
export type { InputState, PlayerState } from "./systems/PlayerController.js";
export {
  createDefaultCamera,
  computeCameraPosition,
  smoothCameraTowards,
  lerpCamera,
  clampDistance,
  resolveCameraCollision,
  CAMERA_ZOOM,
} from "./systems/CameraController.js";
export type { CameraState, CameraPosition } from "./systems/CameraController.js";
export { resolveAnimation } from "./systems/AnimationFSM.js";
export type { AnimationState, AnimationContext } from "./systems/AnimationFSM.js";
export {
  createNetworkState,
  addRemotePlayer,
  removeRemotePlayer,
  updateRemotePlayerPosition,
} from "./systems/NetworkManager.js";
export type { RemotePlayerData, NetworkState } from "./systems/NetworkManager.js";
export { createSlime, createWraith, createGolem, updateMonster } from "./systems/MonsterController.js";
export type { MonsterData, MonsterState, MonsterKind } from "./systems/MonsterController.js";
export { rollDamage, inRange, DEFAULT_WEAPON } from "./systems/CombatController.js";
export type { WeaponStats } from "./systems/CombatController.js";
export {
  worldToChunk,
  chunkKey,
  lodForDistance,
  parseChunkKey,
  chunksInView,
  diffChunks,
  DEFAULT_STREAMING_CONFIG,
} from "./systems/WorldStreaming.js";
export type { ChunkCoord, LodBand, ChunkWithLod, StreamingDiff, StreamingConfig } from "./systems/WorldStreaming.js";
export {
  createDefaultSave,
  loadSave,
  writeSave,
  clearSave,
  migrateSave,
  SAVE_KEY,
  SAVE_SCHEMA_VERSION,
} from "./systems/SaveSystem.js";
export type {
  SaveData,
  InventoryItem,
  EquipmentSlot,
  Settings,
} from "./systems/SaveSystem.js";
export { heightAt, normalAt, groundTypeAt, getTerrainGeography } from "./systems/TerrainSystem.js";
export type { GroundType, RegionDef } from "./systems/TerrainSystem.js";
export {
  computeCelestialState,
} from "./systems/DayNightCycle.js";
export type { CelestialState } from "./systems/DayNightCycle.js";
export {
  createWeatherState,
  updateWeather,
  windAmplitude,
} from "./systems/WeatherSystem.js";
export type { WeatherState, WeatherPreset, WindStrength } from "./systems/WeatherSystem.js";
export {
  createEffect,
  createHitSpark,
  createMagicBurst,
  createFootstep,
  pruneEffects,
} from "./systems/EffectSystem.js";
export type { EffectKind, ParticleSpawn, EffectConfig } from "./systems/EffectSystem.js";
export {
  qualityIndex,
  clampQuality,
  suggestQuality,
  budgetFor,
  accumulateFrame,
} from "./systems/PerformanceFramework.js";
export type {
  QualityLevel,
  PerformanceMetrics,
  PerformanceBudget,
  FrameSample,
} from "./systems/PerformanceFramework.js";
export { QUALITY_LABELS } from "./systems/PerformanceFramework.js";