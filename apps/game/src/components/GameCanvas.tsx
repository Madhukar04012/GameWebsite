import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping, PCFSoftShadowMap, SRGBColorSpace } from "three";
import { Scene } from "./Scene";
import { useGameStore } from "../store/gameStore";
import { useGraphicsStore } from "../store/graphicsStore";
import { GamePhase } from "@legend/engine";
import { Suspense } from "react";
import { LoadingScreen } from "../systems/LoadingScreen";
import { IntroCinematic } from "../systems/IntroCinematic";
import { HUD } from "../systems/HUD";
import { NetworkClient } from "../systems/NetworkClient";
import { ZoneTransition } from "../systems/ZoneTransition";
import { CharacterSelectScreen } from "../systems/CharacterSelectScreen";
import { DebugTools } from "../systems/DebugTools";

export function GameCanvas() {
  const phase = useGameStore((s) => s.phase);
  const dpr = useGraphicsStore((s) => s.dpr);
  const showGame = phase === GamePhase.PLAYING || phase === GamePhase.SPAWNING;
  const showCinematic = phase === GamePhase.CINEMATIC;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", background: "#050505" }}>
      <NetworkClient />
      <Canvas
        shadows
        camera={{ position: [0, 5, 10], fov: 60 }}
        style={{ width: "100%", height: "100%", display: "block" }}
        gl={{
          antialias: true,
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
          outputColorSpace: SRGBColorSpace,
          logarithmicDepthBuffer: true,
        }}
        dpr={dpr}
        onCreated={({ gl }) => {
          /* Read store outside hook context via getState() */
          const gfx = useGraphicsStore.getState();
          gl.shadowMap.type = PCFSoftShadowMap;
          gl.shadowMap.enabled = true;
          gl.toneMappingExposure = 1.15;
          // log removed
        }}
      >
        <Suspense fallback={null}>
          {(showGame || showCinematic) && <Scene />}
          {showCinematic && <IntroCinematic />}
        </Suspense>
      </Canvas>

      <LoadingScreen />
      <HUD />
      <ZoneTransition />
      <CharacterSelectScreen />
      <DebugTools />
    </div>
  );
}
