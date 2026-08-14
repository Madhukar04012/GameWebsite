import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping, PCFShadowMap, PCFSoftShadowMap, BasicShadowMap, SRGBColorSpace } from "three";
import { Scene } from "./Scene";
import { useGameStore } from "../store/gameStore";
import { useGraphicsStore, resolveShadowMapType } from "../systems/GraphicsScalability";
import { GamePhase } from "@legend/engine";
import { Suspense } from "react";
import { LoadingScreen } from "../systems/LoadingScreen";
import { IntroCinematic } from "../systems/IntroCinematic";
import { HUD } from "../systems/HUD";
import { NetworkClient } from "../systems/NetworkClient";
import { ZoneTransition } from "../systems/ZoneTransition";
import { CharacterSelectScreen } from "../systems/CharacterSelectScreen";
import { DebugTools } from "../systems/DebugTools";
import { DebugWorldMap } from "../systems/DebugWorldMap";
import { PerformanceHUD } from "./PerformanceHUD";

export function GameCanvas() {
  const phase = useGameStore((s) => s.phase);
  const settings = useGraphicsStore((s) => s.settings);
  const activeTier = useGraphicsStore((s) => s.activeTier);
  const shadows = settings.dynamicShadows;
  const showGame = phase === GamePhase.PLAYING || phase === GamePhase.SPAWNING;
  const showCinematic = phase === GamePhase.CINEMATIC;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", background: "#050505" }}>
      <NetworkClient />
      <Canvas
        shadows={shadows}
        camera={{ position: [0, 5, 10], fov: 60 }}
        style={{ width: "100%", height: "100%", display: "block" }}
        gl={{
          antialias: false,
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
          outputColorSpace: SRGBColorSpace,
          logarithmicDepthBuffer: false,
        }}
        dpr={settings.maxDpr}
        onCreated={({ gl }) => {
          /* Read store outside hook context via getState() */
          const gfx = useGraphicsStore.getState();
          gl.shadowMap.type = resolveShadowMapType(gfx.settings.shadowMapType);
          gl.shadowMap.enabled = shadows;
          gl.toneMappingExposure = 1.15;
        }}
      >
        <Suspense fallback={null}>
          {(showGame || showCinematic) && <Scene />}
          {showCinematic && <IntroCinematic />}
        </Suspense>
        <PerformanceHUD />
      </Canvas>

      <LoadingScreen />
      <HUD />
      <ZoneTransition />
      <CharacterSelectScreen />
      <DebugTools />
      <DebugWorldMap />
    </div>
  );
}
