/**
 * createMagicMaterial — patched MeshStandardMaterial for glowing magical surfaces.
 *
 * Procedural animated rune glow: pulsing emissive with noise-driven patterns.
 * Three presets: "rune" (glyph patterns), "shield" (barrier shimmer),
 * "portal" (swirling vortex). Phase B: map for authored rune textures.
 *
 * The owning component must animate uTime and uPulse each frame.
 */

import * as THREE from "three";
import { createPatchedMaterial, type PatchedMaterialOptions } from "./patchStandard";

export type MagicKind = "rune" | "shield" | "portal";

export interface MagicMaterialOptions extends PatchedMaterialOptions {
  kind?: MagicKind;
  glowColor?: THREE.ColorRepresentation;
}

const DECLARATIONS = `
uniform float uTime;
uniform float uPulse;
uniform vec3 uGlow;
`;

const RUNE_BODY = /* glsl */ `
  vec2 wp = vWorldPos.xz + vWorldPos.y * 0.3 + uSeed;
  float n = fbm(wp * 0.8);
  float lines = fbm(wp * 2.0 + uTime * 0.15);
  float glyph = smoothstep(0.35, 0.55, lines) * (1.0 - smoothstep(0.6, 0.8, lines));
  // Pulsing glow
  float pulse = 0.6 + 0.4 * sin(uTime * 1.5 + n * 6.28);
  vec3 glow = uGlow * glyph * pulse * uPulse;
  diffuseColor.rgb = mix(diffuseColor.rgb, glow, glyph * 0.8);
  diffuseColor.rgb += glow * 0.3;
  roughnessFactor = mix(roughnessFactor, 0.3, glyph);
`;

const SHIELD_BODY = /* glsl */ `
  vec2 wp = vWorldPos.xz + vWorldPos.y * 0.2 + uSeed;
  float n = fbm(wp * 0.6 + uTime * 0.1);
  float cells = fbm(wp * 3.0 + uTime * 0.2);
  float hex = smoothstep(0.3, 0.6, cells);
  float pulse = 0.7 + 0.3 * sin(uTime * 2.0);
  vec3 glow = uGlow * hex * pulse * uPulse;
  diffuseColor.rgb = mix(diffuseColor.rgb, glow, hex * 0.6);
  diffuseColor.rgb += glow * 0.2;
  roughnessFactor = mix(roughnessFactor, 0.2, hex);
  // Edge glow via fresnel
  float fres = 1.0 - abs(dot(normalize(vNormalW), normalize(cameraPosition - vWorldPos)));
  diffuseColor.rgb += uGlow * pow(fres, 3.0) * 0.5;
`;

const PORTAL_BODY = /* glsl */ `
  vec2 wp = vWorldPos.xz + vWorldPos.y * 0.5 + uSeed;
  // Swirling vortex pattern
  float angle = atan(wp.y, wp.x);
  float radius = length(wp);
  float swirl = fbm(vec2(angle * 3.0 + uTime * 0.5, radius * 2.0));
  float pulse = 0.5 + 0.5 * sin(uTime * 1.0 + radius * 3.0);
  float mask = smoothstep(3.0, 0.0, radius) * swirl;
  vec3 glow = uGlow * mask * pulse * uPulse;
  diffuseColor.rgb = mix(diffuseColor.rgb, glow, mask * 0.9);
  diffuseColor.rgb += glow * 0.4;
  roughnessFactor = mix(roughnessFactor, 0.1, mask);
`;

const BODIES: Record<MagicKind, string> = {
  rune: RUNE_BODY,
  shield: SHIELD_BODY,
  portal: PORTAL_BODY,
};

export function createMagicMaterial(opts: MagicMaterialOptions = {}): THREE.MeshStandardMaterial {
  const kind = opts.kind ?? "rune";
  const glowColor = opts.glowColor ?? (kind === "portal" ? 0x8844ff : kind === "shield" ? 0x4488ff : 0xd4af37);
  const { kind: _kind, glowColor: _glowColor, ...rest } = opts;

  return createPatchedMaterial(
    {
      color: opts.color ?? 0x1a1a2e,
      roughness: 0.7,
      metalness: 0.0,
      emissive: glowColor,
      emissiveIntensity: 0.2,
      ...rest,
      transparent: opts.transparent ?? (kind === "shield" || kind === "portal"),
      opacity: opts.opacity ?? (kind === "portal" ? 0.85 : kind === "shield" ? 0.5 : 1.0),
      side: THREE.DoubleSide,
    },
    {
      declarations: DECLARATIONS,
      uniforms: {
        uTime: { value: 0 },
        uPulse: { value: 1.0 },
        uGlow: { value: new THREE.Color(glowColor) },
      },
      fragmentBody: BODIES[kind],
    },
  );
}
