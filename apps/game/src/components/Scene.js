import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useEffect } from "react";
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
import { DayNightCycle } from "../world/DayNightCycle";
import { River } from "../world/River";
import { WeatherController } from "../world/WeatherController";
import { Vegetation } from "../world/Vegetation";
import { DustMotes } from "../world/DustMotes";
import { Biomes } from "../world/Biomes";
import { FireflySwarm } from "../world/FireflySwarm";
import { GroundMist } from "../world/GroundMist";
import { EffectComposer, Bloom, Vignette, Noise, ToneMapping, BrightnessContrast, HueSaturation, ChromaticAberration, SSAO } from "@react-three/postprocessing";
import { PlayerSpawn } from "../world/PlayerSpawn";
import { useDebugStore } from "../store/debugStore";
import { useQualitySettings } from "../systems/GraphicsScalability";
import { EffectPlayer } from "../systems/EffectPlayer";
import { AudioController } from "../systems/AudioController";
import { PLAYER_SPAWN, SOUTH_GATE_POSITION, WORLD_SIZE } from "@legend/shared";
import { StorytellingVignettes } from "../world/StorytellingVignettes";
import { LandmarkLighting } from "../world/LandmarkLighting";
import { ExplorationLandmarks } from "../world/ExplorationLandmarks";
import { Waterfall } from "../world/Waterfall";
import { DenseGrass } from "../world/DenseGrass";
import { AmbientWildlife } from "../world/AmbientWildlife";
import { WorldWaypoints } from "../world/WorldWaypoints";
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
/**
 * Offline grounded IBL — RoomEnvironment renders an interior probe in-memory
 * via PMREMGenerator (no network fetch, respects the offline constraint). PBR
 * materials (water fresnel, castle stone, gold accents) pick it up for
 * believable ambient reflection without an external HDR.
 */
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
    const playerRef = useRef(null);
    const debug = useDebugStore();
    const settings = useQualitySettings();
    return (_jsxs("group", { children: [_jsx(GroundedEnvironment, {}), _jsx(DayNightCycle, {}), _jsx(LandmarkLighting, {}), debug.grid && _jsx("gridHelper", { args: [WORLD_SIZE, 80, "#d4af37", "#1a3b66"] }), debug.spawnPoints && _jsx(PlayerSpawn, {}), _jsx(Terrain, {}), _jsx(River, {}), _jsx(CapitalKingdom, { showLabels: debug.labels }), _jsx(StorytellingVignettes, {}), _jsx(FlowerFields, {}), _jsx(Vegetation, {}), _jsx(Harbor, {}), _jsx(DustMotes, {}), _jsx(GroundMist, {}), _jsx(FireflySwarm, { position: [0, 2, 0], count: 80, radius: 30, color: "#2a9d8f" }), _jsx(Biomes, {}), _jsx(Waterfall, {}), _jsx(ExplorationLandmarks, {}), _jsx(DenseGrass, {}), _jsx(AmbientWildlife, {}), _jsx(WorldWaypoints, {}), _jsx(WeatherController, {}), _jsx(EffectPlayer, {}), _jsx(AudioController, {}), _jsx(PerspectiveCamera, { makeDefault: true, position: [0, 12, 22], fov: 60 }), debug.physics && _jsx(OrbitControls, { target: [0, 0, 0] }), _jsx(PlayerEntity, { apiRef: playerRef }), _jsx(RemotePlayers, {}), _jsx(ThirdPersonCamera, { playerRef: playerRef }), debug.labels && (_jsx(Text, { position: [SOUTH_GATE_POSITION.x, 12, SOUTH_GATE_POSITION.z + 6], fontSize: 1, color: "#d4af37", outlineWidth: 0.04, outlineColor: "#000", anchorX: "center", anchorY: "middle", children: "South Gate" })), debug.spawnPoints && (_jsx(Text, { position: [PLAYER_SPAWN.x, 6, PLAYER_SPAWN.z + 3], fontSize: 0.8, color: "#6a9a4a", outlineWidth: 0.03, outlineColor: "#000", anchorX: "center", anchorY: "middle", children: "Spawn" })), !debug.physics && settings.postProcessing && (() => {
                const children = [];
                if (settings.ssao)
                    children.push(_jsx(SSAO, { radius: 12, intensity: 3.0, distanceFalloff: 0.25, color: new THREE.Color("#1a1a2e") }, "ssao"));
                if (settings.bloom)
                    children.push(_jsx(Bloom, { luminanceThreshold: 0.8, luminanceSmoothing: 0.6, intensity: 1.2, mipmapBlur: true }, "bloom"));
                if (settings.vignette)
                    children.push(_jsx(Vignette, { eskil: false, offset: 0.15, darkness: 0.45 }, "vignette"));
                if (settings.ssao)
                    children.push(_jsx(Noise, { intensity: 0.08, size: 1, opacity: 0.3 }, "noise"));
                if (settings.ssao)
                    children.push(_jsx(ChromaticAberration, { offset: [0.0006, 0.001] }, "ca"));
                children.push(_jsx(ToneMapping, { mode: THREE.ACESFilmicToneMapping, exposure: 1.15 }, "tm"));
                children.push(_jsx(BrightnessContrast, { brightness: 0.01, contrast: 0.08 }, "bc"));
                children.push(_jsx(HueSaturation, { saturation: 0.14 }, "hs"));
                return _jsx(EffectComposer, { enableNormalPass: false, multisampling: settings.multisampling, frameBufferType: THREE.HalfFloatType, children: children });
            })()] }));
}
//# sourceMappingURL=Scene.js.map