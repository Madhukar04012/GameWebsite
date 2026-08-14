/**
 * createFireMaterial — ShaderMaterial for animated torch/fire/magic flame.
 *
 * Full custom shader (not patched Standard) because flame needs additive
 * blending, vertex displacement, and emissive-only rendering. Three presets:
 * "torch" (warm flame), "magic" (cool ethereal), "ember" (glowing cinders).
 *
 * Uses a time uniform animated each frame by the owning component.
 */
import * as THREE from "three";
import { GLSL_NOISE_LIB } from "../shaders/noise.glsl";
const VERTEX = /* glsl */ `
  ${GLSL_NOISE_LIB}
  uniform float uTime;
  uniform float uIntensity;
  varying float vAlpha;
  varying float vHeight;

  void main() {
    vec3 pos = position;
    vHeight = pos.y;

    // Flame flicker: noise-based vertex displacement upward
    float n = fbm(pos.xz * 1.5 + uTime * 1.2);
    float flicker = fbm(pos.xz * 3.0 + uTime * 2.5);

    // Height mask: more movement at top
    float topMask = pos.y;
    pos.y += n * 0.3 * topMask * uIntensity;
    pos.x += (flicker - 0.5) * 0.15 * topMask * uIntensity;
    pos.z += (fbm(pos.xz * 2.0 + uTime * 1.8) - 0.5) * 0.15 * topMask * uIntensity;

    vAlpha = 1.0 - pos.y; // fade toward tip

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;
const FRAGMENT_TORCH = /* glsl */ `
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform float uIntensity;
  varying float vAlpha;
  varying float vHeight;
  uniform float uTime;

  void main() {
    float flicker = 0.8 + 0.2 * sin(uTime * 10.0 + vHeight * 5.0);
    // Core → mid → tip gradient
    vec3 col = mix(uColor1, uColor2, smoothstep(0.0, 0.5, vHeight));
    col = mix(col, uColor3, smoothstep(0.5, 1.0, vHeight));
    col *= flicker * uIntensity;
    float alpha = vAlpha * flicker;
    alpha = clamp(alpha * 1.3, 0.0, 1.0);
    gl_FragColor = vec4(col, alpha * 0.85);
  }
`;
const FRAGMENT_MAGIC = /* glsl */ `
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform float uIntensity;
  varying float vAlpha;
  varying float vHeight;
  uniform float uTime;

  void main() {
    float pulse = 0.7 + 0.3 * sin(uTime * 3.0 + vHeight * 8.0);
    vec3 col = mix(uColor1, uColor2, smoothstep(0.0, 0.4, vHeight));
    col = mix(col, uColor3, smoothstep(0.4, 1.0, vHeight));
    col *= pulse * uIntensity * 1.2;
    float alpha = vAlpha * pulse * 1.2;
    gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.9));
  }
`;
const FRAGMENT_EMBER = /* glsl */ `
  uniform vec3 uColor1;
  uniform float uIntensity;
  varying float vAlpha;
  varying float vHeight;
  uniform float uTime;

  void main() {
    float sparkle = 0.5 + 0.5 * sin(uTime * 5.0 + vHeight * 20.0 + gl_FragCoord.x * 0.1);
    vec3 col = uColor1 * sparkle * uIntensity * 1.5;
    float alpha = vAlpha * sparkle * 1.5;
    gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.8));
  }
`;
const FRAGMENTS = {
    torch: FRAGMENT_TORCH,
    magic: FRAGMENT_MAGIC,
    ember: FRAGMENT_EMBER,
};
const COLORS = {
    torch: { c1: 0xff6600, c2: 0xffcc44, c3: 0xffeedd },
    magic: { c1: 0x0055ff, c2: 0x4488ff, c3: 0xaaccff },
    ember: { c1: 0xff4400, c2: 0xff6600, c3: 0xff8800 },
};
export function createFireMaterial(opts = {}) {
    const kind = opts.kind ?? "torch";
    const colors = COLORS[kind];
    const intensity = opts.intensity ?? 1.0;
    return new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uIntensity: { value: intensity },
            uColor1: { value: new THREE.Color(opts.color ?? colors.c1) },
            uColor2: { value: new THREE.Color(colors.c2) },
            uColor3: { value: new THREE.Color(colors.c3) },
        },
        vertexShader: VERTEX,
        fragmentShader: FRAGMENTS[kind],
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
    });
}
//# sourceMappingURL=createFireMaterial.js.map