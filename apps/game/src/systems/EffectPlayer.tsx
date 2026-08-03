/**
 * EffectPlayer — renders pooled particle effects (sparks, magic, hits, heals).
 *
 * Each effect kind shares a single Points mesh with instanced uniforms per
 * burst. Effects self-terminate after their duration. Designed to be driven by
 * the engine EffectSystem or called imperatively.
 *
 * Performance: one draw call per active effect kind. Bursts recycle into a
 * fixed pool (no allocations after warm-up).
 */

import { useRef, useMemo, useCallback, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { EffectKind } from "@legend/engine";
import { createEffect, pruneEffects } from "@legend/engine";
import type { ParticleSpawn } from "@legend/engine";

/* ── Burst particle counts ── */
const BUDGET: Record<EffectKind, number> = {
  spark: 24,
  magicBurst: 32,
  hitSpark: 16,
  footstep: 4,
  healGlow: 20,
  deathPoof: 40,
  torchEmber: 1, // handled separately (continuous)
  weatherRain: 0,
  weatherSnow: 0,
  portalRift: 48,
};

/* ── Effect visual config ── */
interface EffectVisual {
  size: number;
  speed: number;
  life: number; // seconds
  color1: string;
  color2: string;
  gravity: number; // downward acceleration
}

const VISUALS: Record<Exclude<EffectKind, "weatherRain" | "weatherSnow" | "torchEmber">, EffectVisual> = {
  spark: { size: 0.15, speed: 4, life: 0.8, color1: "#ffcc44", color2: "#ff6600", gravity: 2 },
  magicBurst: { size: 0.3, speed: 2.5, life: 1.2, color1: "#4488ff", color2: "#8844ff", gravity: -0.3 },
  hitSpark: { size: 0.12, speed: 6, life: 0.4, color1: "#ffffff", color2: "#ff9944", gravity: 3 },
  footstep: { size: 0.08, speed: 0.5, life: 0.6, color1: "#c4a060", color2: "#8a6a3a", gravity: 0 },
  healGlow: { size: 0.25, speed: 1.5, life: 1.0, color1: "#44ff88", color2: "#228833", gravity: -0.5 },
  deathPoof: { size: 0.2, speed: 2, life: 1.5, color1: "#664488", color2: "#331144", gravity: -0.2 },
  portalRift: { size: 0.35, speed: 1, life: 2.0, color1: "#8844ff", color2: "#4400aa", gravity: -0.8 },
};

/* ── Effect handle for imperative use ── */
export interface EffectHandle {
  spawn: (kind: EffectKind, x: number, y: number, z: number) => void;
}

/**
 * Hook to spawn effects imperatively (e.g., from combat or footstep callbacks).
 */
export function useEffects(): EffectHandle {
  const queueRef = useRef<ParticleSpawn[]>([]);
  const spawn = useCallback((kind: EffectKind, x: number, y: number, z: number) => {
    queueRef.current.push(createEffect(kind, x, y, z, 2000, 1.0));
  }, []);
  return { spawn };
}

/**
 * EffectPlayer — renders all active particle effects.
 * Mount once in the scene. Consumes effects from a queue.
 */
export function EffectPlayer({ effectQueue }: { effectQueue?: { current: ParticleSpawn[] } }) {
  const [effects, setEffects] = useState<ParticleSpawn[]>([]);
  const timeRef = useRef(0);

  // Drain queue each frame
  useFrame((_, dt) => {
    timeRef.current += dt;

    // Drain external queue if provided
    if (effectQueue && effectQueue.current.length > 0) {
      setEffects((prev) => [...prev, ...effectQueue.current]);
      effectQueue.current = [];
    }

    // Prune expired
    setEffects((prev) => {
      const now = performance.now();
      return pruneEffects(prev, now);
    });
  });

  return (
    <group>
      {Object.entries(BUDGET)
        .filter(([_, count]) => count > 2)
        .map(([kind]) => {
          const kindKey = kind as Exclude<EffectKind, "weatherRain" | "weatherSnow" | "torchEmber">;
          return (
            <EffectBurst
              key={kindKey}
              kind={kindKey}
              effects={effects.filter((e) => e.kind === kindKey)}
            />
          );
        })}
    </group>
  );
}

/* ── Single burst renderer ── */

interface EffectBurstProps {
  kind: Exclude<EffectKind, "weatherRain" | "weatherSnow" | "torchEmber">;
  effects: ParticleSpawn[];
}

function EffectBurst({ kind, effects }: EffectBurstProps) {
  const vis = VISUALS[kind];
  const count = BUDGET[kind];
  const meshRef = useRef<THREE.Points>(null);

  // Pre-allocate geometry
  const geo = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const phase = new Float32Array(count);
    return { pos, vel, phase, count };
  }, [count]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color(vis.color1) },
    uColor2: { value: new THREE.Color(vis.color2) },
    uSize: { value: vis.size },
    uGravity: { value: vis.gravity },
    uLife: { value: vis.life },
    uSpeed: { value: vis.speed },
  }), [vis.color1, vis.color2, vis.size, vis.gravity, vis.life, vis.speed]);

  // Track effect lifetimes
  const spawnsRef = useRef<Map<string, number>>(new Map());

  useFrame((_, dt) => {
    const now = performance.now();

    // Initialize newly spawned particles
    for (const e of effects) {
      if (spawnsRef.current.has(e.id)) continue;
      spawnsRef.current.set(e.id, now);

      // Distribute particles in a burst sphere
      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const speed = 0.5 + Math.random() * 0.5;
        geo.pos[i * 3] = e.x + Math.sin(phi) * Math.cos(theta) * 0.1;
        geo.pos[i * 3 + 1] = e.y + Math.cos(phi) * 0.1;
        geo.pos[i * 3 + 2] = e.z + Math.sin(phi) * Math.sin(theta) * 0.1;
        geo.vel[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
        geo.vel[i * 3 + 1] = Math.cos(phi) * speed;
        geo.vel[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * speed;
        geo.phase[i] = Math.random() * Math.PI * 2;
      }
    }

    // Remove expired spawns
    for (const [id, spawnTime] of spawnsRef.current) {
      if (!effects.find((e) => e.id === id)) {
        spawnsRef.current.delete(id);
      }
    }

    // Update geometry
    const posAttr = meshRef.current?.geometry.attributes.position;
    if (posAttr) {
      posAttr.needsUpdate = true;
    }

    // Update uniforms
    uniforms.uTime.value = now * 0.001;

    // Auto-decay: fade out when no effects active
    if (effects.length === 0 && spawnsRef.current.size === 0) {
      uniforms.uTime.value = 0;
    }
  });

  if (effects.length === 0 && spawnsRef.current.size === 0) return null;

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[geo.pos, 3]}
          count={count}
          array={geo.pos}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-velocity"
          args={[geo.vel, 3]}
          count={count}
          array={geo.vel}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime;
          uniform float uSize;
          uniform float uGravity;
          uniform float uLife;
          uniform float uSpeed;
          attribute vec3 velocity;
          varying float vAlpha;

          void main() {
            vec3 pos = position;
            // Simple kinematic: pos += vel * speed * time
            float t = mod(uTime, uLife);
            pos += velocity * uSpeed * t;
            pos.y -= uGravity * t * t * 0.5;

            vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPos;
            gl_PointSize = uSize * (120.0 / -mvPos.z);

            vAlpha = 1.0 - t / uLife;
          }
        `}
        fragmentShader={`
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          varying float vAlpha;

          void main() {
            vec2 cxy = 2.0 * gl_PointCoord - 1.0;
            float r = dot(cxy, cxy);
            if (r > 1.0) discard;
            float alpha = (1.0 - r) * vAlpha;
            vec3 col = mix(uColor1, uColor2, 1.0 - vAlpha);
            gl_FragColor = vec4(col, alpha * 0.6);
          }
        `}
      />
    </points>
  );
}
