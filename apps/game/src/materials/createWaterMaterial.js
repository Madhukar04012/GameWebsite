/**
 * createWaterMaterial — raw ShaderMaterial for the harbor water plane.
 *
 * Replaces the CPU per-vertex sine animation (+ per-frame computeVertexNormals)
 * with GPU vertex waves + a procedural fragment: fresnel sky reflection,
 * sun specular highlight, animated ripple normals, shoreline foam. Fully
 * procedural, no textures, no network.
 *
 * Fog: manual FogExp2 blend with uFogColor/uFogDensity (the scene fog is
 * FogExp2 — Scene.tsx). Doing it by hand avoids the three fog-chunk
 * include/define plumbing a raw ShaderMaterial requires.
 */
import * as THREE from "three";
import { GLSL_NOISE_LIB } from "../shaders/noise.glsl";
const VERTEX = /* glsl */ `
  ${GLSL_NOISE_LIB}
  uniform float uTime;
  uniform vec2 uSeed;
  varying vec3 vWorldPos;
  varying vec3 vNormalW;
  varying float vWave;
  varying float vFogDepth;

  // Summed sines in the vertex shader — replaces the old JS per-vertex loop.
  float waveHeight(vec2 p, float t) {
    float h = sin(p.x * 0.40 + t * 1.20) * 0.12;
    h += cos(p.y * 0.30 + t * 0.90) * 0.10;
    h += sin((p.x + p.y) * 0.18 + t * 0.6) * 0.05;
    return h;
  }

  void main() {
    vec3 pos = position;
    float h = waveHeight(pos.xy + uSeed, uTime);
    pos.z += h; // plane is XY pre -PI/2 rotation
    vWave = h;

    // Finite-difference normal from the wave field.
    float e = 0.5;
    float hx = waveHeight(pos.xy + vec2(e, 0.0) + uSeed, uTime) - h;
    float hy = waveHeight(pos.xy + vec2(0.0, e) + uSeed, uTime) - h;
    vec3 n = normalize(vec3(-hx, -hy, e));

    vec4 wp = modelMatrix * vec4(pos, 1.0);
    vWorldPos = wp.xyz;
    vNormalW = normalize(mat3(modelMatrix) * n);
    vec4 mvPosition = viewMatrix * wp;
    vFogDepth = -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
  }
`;
const FRAGMENT = /* glsl */ `
  ${GLSL_NOISE_LIB}
  precision highp float;
  uniform float uTime;
  uniform vec3 uDeep;
  uniform vec3 uSky;
  uniform vec3 uSunDir;
  uniform vec3 uSunColor;
  uniform vec3 uFoam;
  uniform vec2 uShore; // (shoreZ or centerOffset, foamWidth)
  uniform vec2 uShoreNormal; // (nx, nz) — zero = legacy Z-mode
  uniform float uWaterHalfWidth; // water half-width for normal-mode foam
  uniform vec2 uSeed;
  uniform vec3 uFogColor;
  uniform float uFogDensity;
  varying vec3 vWorldPos;
  varying vec3 vNormalW;
  varying float vWave;
  varying float vFogDepth;

  void main() {
    vec3 N = normalize(vNormalW);
    vec3 V = normalize(cameraPosition - vWorldPos);

    // Fresnel: more reflective at grazing angles.
    float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 3.0);

    // Animated ripple perturbs the normal for sparkly specular.
    float rx = fbm(vWorldPos.xz * 0.5 + uTime * 0.15);
    float ry = fbm(vWorldPos.xz * 0.5 - uTime * 0.12 + 13.0);
    vec3 Np = normalize(N + vec3((rx - 0.5) * 0.25, (ry - 0.5) * 0.25, 0.0));

    vec3 L = normalize(uSunDir);
    float spec = pow(max(dot(reflect(-L, Np), V), 0.0), 48.0);

    vec3 col = mix(uDeep, uSky, fres);
    col += uSunColor * spec * 0.6;

    // Foam near the shoreline + on wave crests.
    // Two modes: Z-axis band (legacy) or perpendicular-distance band (shoreNormal set).
    float shoreDist;
    if (length(uShoreNormal) > 0.001) {
      float perpDist = dot(vWorldPos.xz, uShoreNormal);
      float edgeDist = abs(perpDist - uShore.x) - uWaterHalfWidth;
      shoreDist = max(0.0, edgeDist);
    } else {
      shoreDist = abs(vWorldPos.z - uShore.x);
    }
    float foamBand = smoothstep(uShore.y, 0.0, shoreDist);
    float crest = smoothstep(0.13, 0.20, vWave);
    float foam = clamp(foamBand * 0.7 + crest * 0.3, 0.0, 1.0);
    col = mix(col, uFoam, foam * 0.6);

    // Subtle depth darkening further from shore.
    col *= 1.0 - 0.1 * smoothstep(0.0, 1.5, -vWave);

    // Manual FogExp2 blend to match the scene's warm haze.
    float fogFactor = 1.0 - exp(-uFogDensity * uFogDensity * vFogDepth * vFogDepth);
    col = mix(col, uFogColor, clamp(fogFactor, 0.0, 1.0));

    gl_FragColor = vec4(col, 0.92);
  }
`;
export function createWaterMaterial(opts = {}) {
    return new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uSeed: { value: [0, 0] },
            uDeep: { value: new THREE.Color(opts.deepColor ?? 0x005b8a) },
            uSky: { value: new THREE.Color(opts.skyColor ?? 0x87ceeb) },
            uSunDir: { value: new THREE.Vector3(...(opts.sunDirection ?? [0.6, 0.5, -0.4])).normalize() },
            uSunColor: { value: new THREE.Color(opts.sunColor ?? 0xffe5b4) },
            uFoam: { value: new THREE.Color(opts.foamColor ?? 0xffffff) },
            uShore: { value: [opts.shoreZ ?? 0, 2.5] },
            uShoreNormal: { value: opts.shoreNormal ? new THREE.Vector2(opts.shoreNormal[0], opts.shoreNormal[1]) : new THREE.Vector2(0, 0) },
            uWaterHalfWidth: { value: opts.waterHalfWidth ?? 0 },
            uFogColor: { value: new THREE.Color(opts.fogColor ?? 0x87ceeb) },
            uFogDensity: { value: opts.fogDensity ?? 0.0065 },
        },
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
    });
}
//# sourceMappingURL=createWaterMaterial.js.map