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
export { heightAt, normalAt, groundTypeAt } from "./systems/TerrainSystem.js";
export type { GroundType, RegionDef } from "./systems/TerrainSystem.js";
