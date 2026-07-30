import { useRef, useMemo, useEffect } from "react";
import { PerspectiveCamera, OrbitControls, Text } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { PlayerEntity } from "../systems/PlayerEntity";
import { ThirdPersonCamera } from "../systems/ThirdPersonCamera";
import { RemotePlayers } from "../systems/RemotePlayers";
import { CapitalKingdom } from "../world/CapitalKingdom";
import { FlowerFields } from "../world/FlowerFields";
import { Harbor } from "../world/Harbor";
import { Terrain } from "../world/Terrain";
import { Environment } from "../world/Environment";
import { Vegetation } from "../world/Vegetation";
import { DustMotes } from "../world/DustMotes";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { N8AO } from "@react-three/postprocessing";
import { PlayerSpawn } from "../world/PlayerSpawn";
import type { PlayerAPI } from "../systems/PlayerEntity";
import { useDebugStore } from "../store/debugStore";
import { PLAYER_SPAWN, SOUTH_GATE_POSITION, WORLD_SIZE } from "@legend/shared";

/**
 * Scene — world composition.
 *
 * Layout mirrors the roadmap's World tree:
 *   Environment → Terrain → Roads/Walls/Districts/Vegetation → Player/Camera.
 *
 * Architectural note: the R3F scene consumes engine state (heightAt, player
 * state via PlayerEntity apiRef) rather than owning it; gameplay systems live
 * in packages/engine.
 */
// Warm gold-washed horizon fog (matches the sun direction in Environment).
// Warm gold-washed horizon fog (matches the sun direction in Environment).
const SUN_COLOR = "#ffe5b4";
const FOG_COLOR = "#87ceeb";

/**
 * Offline grounded IBL — RoomEnvironment renders an interior probe in-memory
 * via PMREMGenerator (no network fetch, respects the offline constraint). PBR
 * materials (water fresnel, castle stone, gold accents) pick it up for
 * believable ambient reflection without an external HDR.
 */
function GroundedEnvironment() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    return () => {
      envTex.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

export function Scene() {
  const playerRef = useRef<PlayerAPI | null>(null);
  const debug = useDebugStore();

  return (
    <group>
      {/* Atmospheric scene fog — warm gold-tinted haze so distance reads as
          golden hour, not a hard clip. Exponential falloff for soft depth. */}
      <color attach="background" args={[FOG_COLOR]} />
      <fogExp2 attach="fog" args={[FOG_COLOR, 0.0065]} />

      <Environment />
      <GroundedEnvironment />

      {/* Lighting block (toggleable via debug.lighting). */}
      {debug.lighting && <SceneLighting />}

      {/* Debug grid + spawn markers (dev only). */}
      {debug.grid && <gridHelper args={[WORLD_SIZE, 80, "#d4af37", "#1a3b66"]} />}
      {debug.spawnPoints && <PlayerSpawn />}

      {/* Terrain heightfield replaces the flat plane. */}
      <Terrain />

      <CapitalKingdom showLabels={debug.labels} />
      <FlowerFields />
      <Vegetation />
      <Harbor />
      <DustMotes />

      {/* Explicit default camera so ThirdPersonCamera has a known starting view
          before the player apiRef is populated. OrbitControls for debug. */}
      <PerspectiveCamera makeDefault position={[0, 12, 22]} fov={60} />
      {!debug.physics && <OrbitControls target={[0, 0, 0]} />}

      <PlayerEntity apiRef={playerRef} />
      <RemotePlayers />
      <ThirdPersonCamera playerRef={playerRef} />

      {/* South gate label marker when labels enabled */}
      {debug.labels && (
        <Text
          position={[SOUTH_GATE_POSITION.x, 12, SOUTH_GATE_POSITION.z + 6]}
          fontSize={1}
          color="#d4af37"
          outlineWidth={0.04}
          outlineColor="#000"
          anchorX="center"
          anchorY="middle"
        >
          South Gate
        </Text>
      )}
      {/* Spawn label marker */}
      {debug.spawnPoints && (
        <Text
          position={[PLAYER_SPAWN.x, 6, PLAYER_SPAWN.z + 3]}
          fontSize={0.8}
          color="#6a9a4a"
          outlineWidth={0.03}
          outlineColor="#000"
          anchorX="center"
          anchorY="middle"
        >
          Spawn
        </Text>
      )}

      {/* Post Processing for Stylized AAA Look */}
      {!debug.physics && (
        <EffectComposer disableNormalPass={false} multisampling={4}>
          <N8AO aoRadius={8} intensity={2.5} distanceFalloff={0.2} color="#1a1a2e" />
          <Bloom luminanceThreshold={0.85} luminanceSmoothing={0.75} intensity={0.8} mipmapBlur />
          <Vignette eskil={false} offset={0.1} darkness={0.5} />
        </EffectComposer>
      )}
    </group>
  );
}

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.4} color="#87ceeb" />
      {/* Warm "god ray" directional sun matching the Sky sun direction. */}
      <directionalLight
        position={[40, 50, -20]}
        intensity={2.2}
        color={SUN_COLOR}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={160}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      {/* Warm sky / cool purple-blue ground bounce for richer ambient fill. */}
      <hemisphereLight args={["#ffe5b4", "#6b6b9e", 1.2]} />
      {/* Cool sapphire rim light from opposite side for dramatic depth. */}
      <directionalLight position={[-30, 18, -25]} intensity={1.5} color="#87ceeb" />
    </>
  );
}
