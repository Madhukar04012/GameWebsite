/**
 * createDistrictMaterials — per-district building material palette.
 *
 * Each district gets a distinct architectural identity using the existing
 * patched material system. Reuses createStoneMaterial, createMetalMaterial,
 * createWoodMaterial, createGlassMaterial, createFabricMaterial.
 * No new shader code — only parameter bundles over proven primitives.
 */

import { createStoneMaterial } from "./createStoneMaterial";
import { createMetalMaterial } from "./createMetalMaterial";
import { createWoodMaterial } from "./createWoodMaterial";
import { createGlassMaterial } from "./createGlassMaterial";
import { createFabricMaterial } from "./createFabricMaterial";
import * as THREE from "three";

/** Complete material set for a district. */
export interface DistrictMaterialSet {
  /** Main wall material. */
  wall: THREE.MeshStandardMaterial;
  /** Roof material. */
  roof: THREE.MeshStandardMaterial;
  /** Accent wood (beams, doors, shutters). */
  wood: THREE.MeshStandardMaterial;
  /** Window glass. */
  glass: THREE.MeshStandardMaterial;
  /** Banner/cloth accents. */
  banner: THREE.MeshStandardMaterial;
  /** Metal accents (hinges, fixtures, grilles). */
  metal: THREE.MeshStandardMaterial;
  /** Optional secondary accent for variety. */
  accent?: THREE.MeshStandardMaterial;
}

/**
 * Returns a memo-stable material set for a district.
 * Keyed by district name — same parameters = same materials = GPU reuse.
 */
export function getDistrictMaterials(districtName: string): DistrictMaterialSet {
  switch (districtName) {
    case "castle":
      return {
        wall: createStoneMaterial({ stoneColor: "#f0e8d8", roughness: 0.88, metalness: 0.02, seed: [100, 1] }),
        roof: createStoneMaterial({ stoneColor: "#7c2818", roughness: 0.6, metalness: 0.3, roof: true, seed: [100, 2] }),
        wood: createWoodMaterial({ woodColor: "#2a1a0e", roughness: 0.92, seed: [100, 3] }),
        glass: createGlassMaterial({ kind: "stained", color: 0x662244, opacity: 0.8, seed: [100, 4] }),
        banner: createFabricMaterial({ kind: "banner", color: "#8a2a2a", seed: [100, 5] }),
        metal: createMetalMaterial({ kind: "gold", seed: [100, 6] }),
        accent: createMetalMaterial({ kind: "bronze", seed: [100, 7] }),
      };
    case "guild_hall":
      return {
        wall: createStoneMaterial({ stoneColor: "#c8b8a0", roughness: 0.86, metalness: 0.03, seed: [200, 1] }),
        roof: createStoneMaterial({ stoneColor: "#5a3a28", roughness: 0.65, metalness: 0.35, roof: true, seed: [200, 2] }),
        wood: createWoodMaterial({ woodColor: "#3a2618", roughness: 0.9, seed: [200, 3] }),
        glass: createGlassMaterial({ kind: "clear", color: 0x88aacc, opacity: 0.4, seed: [200, 4] }),
        banner: createFabricMaterial({ kind: "banner", color: "#5a3a2a", seed: [200, 5] }),
        metal: createMetalMaterial({ kind: "iron", seed: [200, 6] }),
        accent: createMetalMaterial({ kind: "bronze", seed: [200, 7] }),
      };
    case "market":
      return {
        wall: createStoneMaterial({ stoneColor: "#d8c8a8", roughness: 0.84, metalness: 0.04, seed: [300, 1] }),
        roof: createStoneMaterial({ stoneColor: "#b86a28", roughness: 0.6, metalness: 0.3, roof: true, seed: [300, 2] }),
        wood: createWoodMaterial({ woodColor: "#5a3a22", roughness: 0.88, seed: [300, 3] }),
        glass: createGlassMaterial({ kind: "clear", color: 0xaaccee, opacity: 0.35, seed: [300, 4] }),
        banner: createFabricMaterial({ kind: "tent", color: "#c4a060", seed: [300, 5] }),
        metal: createMetalMaterial({ kind: "bronze", seed: [300, 6] }),
        accent: createMetalMaterial({ kind: "gold", seed: [300, 7] }),
      };
    case "noble":
      return {
        wall: createStoneMaterial({ stoneColor: "#e8e0d0", roughness: 0.82, metalness: 0.05, seed: [400, 1] }),
        roof: createStoneMaterial({ stoneColor: "#8b4513", roughness: 0.55, metalness: 0.25, roof: true, seed: [400, 2] }),
        wood: createWoodMaterial({ woodColor: "#4a3a28", roughness: 0.85, seed: [400, 3] }),
        glass: createGlassMaterial({ kind: "stained", color: 0x446688, opacity: 0.7, seed: [400, 4] }),
        banner: createFabricMaterial({ kind: "silk", color: "#8866aa", seed: [400, 5] }),
        metal: createMetalMaterial({ kind: "gold", seed: [400, 6] }),
        accent: createMetalMaterial({ kind: "silver", seed: [400, 7] }),
      };
    case "training":
      return {
        wall: createStoneMaterial({ stoneColor: "#9a8a7a", roughness: 0.9, metalness: 0.02, seed: [500, 1] }),
        roof: createStoneMaterial({ stoneColor: "#4a3a28", roughness: 0.7, metalness: 0.3, roof: true, seed: [500, 2] }),
        wood: createWoodMaterial({ woodColor: "#3a2a1a", roughness: 0.92, seed: [500, 3] }),
        glass: createGlassMaterial({ kind: "clear", color: 0x88aacc, opacity: 0.4, seed: [500, 4] }),
        banner: createFabricMaterial({ kind: "banner", color: "#6a5a3a", seed: [500, 5] }),
        metal: createMetalMaterial({ kind: "iron", seed: [500, 6] }),
      };
    case "blacksmith":
      return {
        wall: createStoneMaterial({ stoneColor: "#6a5a4a", roughness: 0.9, metalness: 0.05, seed: [600, 1] }),
        roof: createStoneMaterial({ stoneColor: "#3a2a1a", roughness: 0.75, metalness: 0.4, roof: true, seed: [600, 2] }),
        wood: createWoodMaterial({ woodColor: "#2a1a0e", roughness: 0.95, seed: [600, 3] }),
        glass: createGlassMaterial({ kind: "clear", color: 0x88aacc, opacity: 0.35, seed: [600, 4] }),
        banner: createFabricMaterial({ kind: "tent", color: "#5a3a2a", seed: [600, 5] }),
        metal: createMetalMaterial({ kind: "iron", seed: [600, 6] }),
        accent: createMetalMaterial({ kind: "bronze", seed: [600, 7] }),
      };
    case "residential":
      return {
        wall: createStoneMaterial({ stoneColor: "#d8d0c0", roughness: 0.85, metalness: 0.03, seed: [700, 1] }),
        roof: createStoneMaterial({ stoneColor: "#a65330", roughness: 0.6, metalness: 0.3, roof: true, seed: [700, 2] }),
        wood: createWoodMaterial({ woodColor: "#4a3a28", roughness: 0.88, seed: [700, 3] }),
        glass: createGlassMaterial({ kind: "clear", color: 0xaaccee, opacity: 0.4, seed: [700, 4] }),
        banner: createFabricMaterial({ kind: "banner", color: "#6a6a4a", seed: [700, 5] }),
        metal: createMetalMaterial({ kind: "bronze", seed: [700, 6] }),
      };
    case "inn":
      return {
        wall: createStoneMaterial({ stoneColor: "#c8b898", roughness: 0.84, metalness: 0.04, seed: [800, 1] }),
        roof: createStoneMaterial({ stoneColor: "#8b5a2a", roughness: 0.6, metalness: 0.3, roof: true, seed: [800, 2] }),
        wood: createWoodMaterial({ woodColor: "#4a3622", roughness: 0.88, seed: [800, 3] }),
        glass: createGlassMaterial({ kind: "clear", color: 0xb8d4e8, opacity: 0.35, seed: [800, 4] }),
        banner: createFabricMaterial({ kind: "tent", color: "#d4af37", seed: [800, 5] }),
        metal: createMetalMaterial({ kind: "bronze", seed: [800, 6] }),
        accent: createMetalMaterial({ kind: "gold", seed: [800, 7] }),
      };
    case "harbor":
      return {
        wall: createStoneMaterial({ stoneColor: "#9aa8b8", roughness: 0.88, metalness: 0.03, seed: [900, 1] }),
        roof: createStoneMaterial({ stoneColor: "#4a5a6a", roughness: 0.65, metalness: 0.3, roof: true, seed: [900, 2] }),
        wood: createWoodMaterial({ woodColor: "#3a4a5a", roughness: 0.9, seed: [900, 3] }),
        glass: createGlassMaterial({ kind: "clear", color: 0x88ccee, opacity: 0.4, seed: [900, 4] }),
        banner: createFabricMaterial({ kind: "banner", color: "#4a6a7a", seed: [900, 5] }),
        metal: createMetalMaterial({ kind: "iron", seed: [900, 6] }),
        accent: createMetalMaterial({ kind: "silver", seed: [900, 7] }),
      };
    default:
      return {
        wall: createStoneMaterial({ stoneColor: "#e0d6c8", roughness: 0.85, metalness: 0.02 }),
        roof: createStoneMaterial({ stoneColor: "#a65330", roughness: 0.7, metalness: 0.3, roof: true }),
        wood: createWoodMaterial({ woodColor: "#3a2a18", roughness: 0.9 }),
        glass: createGlassMaterial({ kind: "clear", opacity: 0.4 }),
        banner: createFabricMaterial({ kind: "banner", color: "#8a7a4a" }),
        metal: createMetalMaterial({ kind: "iron" }),
      };
  }
}