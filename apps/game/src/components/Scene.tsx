import { useRef, useEffect } from "react";
import { PerspectiveCamera, OrbitControls, Text } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { PlayerEntity } from "../systems/PlayerEntity";
import { ThirdPersonCamera } from "../systems/ThirdPersonCamera";
import { RemotePlayers } from "../systems/RemotePlayers";
import { CapitalKingdom } from "../world/CapitalKingdom";
import { Terrain } from "../world/Terrain";
import { DayNightCycle } from "../world/DayNightCycle";
import { River } from "../world/River";
import { EffectComposer, Bloom, Vignette, ToneMapping, BrightnessContrast, HueSaturation, SSAO } from "@react-three/postprocessing";
import { PlayerSpawn } from "../world/PlayerSpawn";
import type { PlayerAPI } from "../systems/PlayerEntity";
import { useDebugStore } from "../store/debugStore";
import { useQualitySettings } from "../systems/GraphicsScalability";
import { EffectPlayer } from "../systems/EffectPlayer";
import { AudioController } from "../systems/AudioController";
import { PLAYER_SPAWN, SOUTH_GATE_POSITION, WORLD_SIZE } from "@legend/shared";
import { LandmarkLighting } from "../world/LandmarkLighting";

// Components temporarily disabled for Emergency Performance Recovery:
// import { FlowerFields } from "../world/FlowerFields";
// import { Harbor } from "../world/Harbor";
// import { WeatherController } from "../world/WeatherController";
// import { Vegetation } from "../world/Vegetation";
// import { DustMotes } from "../world/DustMotes";
// import { Biomes } from "../world/Biomes";
// import { FireflySwarm } from "../world/FireflySwarm";
// import { GroundMist } from "../world/GroundMist";
// import { StorytellingVignettes } from "../world/StorytellingVignettes";
// import { ExplorationLandmarks } from "../world/ExplorationLandmarks";
// import { Waterfall } from "../world/Waterfall";
// import { DenseGrass } from "../world/DenseGrass";
// import { AmbientWildlife } from "../world/AmbientWildlife";
// import { WorldWaypoints } from "../world/WorldWaypoints";

function GroundedEnvironment() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  useEffect(() => {
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
  const settings = useQualitySettings();

  return (
    <group>
      {/* Grounded IBL probe for PBR materials (offline — no network fetch). */}
      <GroundedEnvironment />

      {/* DayNightCycle — dynamic sky, sun, stars, fog, and lighting driven by
          in-game time (worldStore). Replaces the static Environment + SceneLighting. */}
      {debug.perfLights ? <DayNightCycle /> : <ambientLight intensity={1.5} />}

      {/* Time-of-day reactive light sources for lanterns, braziers, and shrines */}
      {debug.perfLights && <LandmarkLighting />}

      {/* Debug grid + spawn markers (dev only). */}
      {debug.grid && <gridHelper args={[WORLD_SIZE, 80, "#d4af37", "#1a3b66"]} />}
      {debug.spawnPoints && <PlayerSpawn />}

      {/* Terrain heightfield replaces the flat plane. */}
      <Terrain />
      <River />

      <CapitalKingdom showLabels={debug.labels} />

      {/* ====================================================
          EMERGENCY PERFORMANCE RECOVERY - TEMPORARILY DISABLED 
          ====================================================
      <StorytellingVignettes />
      <FlowerFields />
      <Vegetation />
      <Harbor />
      <DustMotes />
      <GroundMist />
      <FireflySwarm position={[0, 2, 0]} count={80} radius={30} color="#2a9d8f" />
      <Biomes />
      <Waterfall />
      <ExplorationLandmarks />
      <DenseGrass />
      <AmbientWildlife />
      <WorldWaypoints />
      <WeatherController />
      ====================================================== */}

      {/* Pooled particle effects + procedural ambient audio, mounted once. */}
      <EffectPlayer />
      <AudioController />

      {/* Explicit default camera so ThirdPersonCamera has a known starting view
          before the player apiRef is populated. OrbitControls for debug mode. */}
      <PerspectiveCamera makeDefault position={[0, 12, 22]} fov={60} />
      {debug.physics && <OrbitControls target={[0, 0, 0]} />}

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
      {!debug.physics && settings.postProcessing && debug.perfPostFX && (() => {
        const children = [];
        if (settings.ssao) children.push(<SSAO key="ssao" radius={12} intensity={3.0} distanceFalloff={0.25} color={new THREE.Color("#1a1a2e")} />);
        if (settings.bloom) children.push(<Bloom key="bloom" luminanceThreshold={0.8} luminanceSmoothing={0.6} intensity={0.6} mipmapBlur />); // lowered bloom
        if (settings.vignette) children.push(<Vignette key="vignette" eskil={false} offset={0.15} darkness={0.45} />);
        
        // NOISE AND CHROMATIC ABERRATION REMOVED FOR CLEAN IMAGE
        
        // ToneMapping exposure lowered to 1.0 (from 1.15) to fix overexposure
        children.push(<ToneMapping key="tm" mode={THREE.ACESFilmicToneMapping} exposure={1.0} />);
        children.push(<BrightnessContrast key="bc" brightness={0} contrast={0.05} />); // flattened brightness
        children.push(<HueSaturation key="hs" saturation={0.14} />);
        return <EffectComposer enableNormalPass={false} multisampling={settings.multisampling} frameBufferType={THREE.HalfFloatType}>{children}</EffectComposer>;
      })()}
    </group>
  );
}
