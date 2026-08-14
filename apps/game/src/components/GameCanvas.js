import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping, PCFShadowMap, PCFSoftShadowMap, BasicShadowMap, SRGBColorSpace } from "three";
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
import { DebugWorldMap } from "../systems/DebugWorldMap";
export function GameCanvas() {
    const phase = useGameStore((s) => s.phase);
    const dpr = useGraphicsStore((s) => s.dpr);
    const antialias = useGraphicsStore((s) => s.antialias);
    const quality = useGraphicsStore((s) => s.quality);
    const shadows = quality !== "low";
    const showGame = phase === GamePhase.PLAYING || phase === GamePhase.SPAWNING;
    const showCinematic = phase === GamePhase.CINEMATIC;
    return (_jsxs("div", { style: { position: "relative", width: "100%", height: "100%", background: "#050505" }, children: [_jsx(NetworkClient, {}), _jsx(Canvas, { shadows: shadows, camera: { position: [0, 5, 10], fov: 60 }, style: { width: "100%", height: "100%", display: "block" }, gl: {
                    antialias,
                    toneMapping: ACESFilmicToneMapping,
                    toneMappingExposure: 1.15,
                    outputColorSpace: SRGBColorSpace,
                    logarithmicDepthBuffer: false,
                }, dpr: dpr, onCreated: ({ gl }) => {
                    /* Read store outside hook context via getState() */
                    const gfx = useGraphicsStore.getState();
                    const shadowType = gfx.quality === "ultra" || gfx.quality === "high" ? PCFSoftShadowMap :
                        gfx.quality === "medium" ? PCFShadowMap : BasicShadowMap;
                    gl.shadowMap.type = shadowType;
                    gl.shadowMap.enabled = shadows;
                    gl.toneMappingExposure = 1.15;
                }, children: _jsxs(Suspense, { fallback: null, children: [(showGame || showCinematic) && _jsx(Scene, {}), showCinematic && _jsx(IntroCinematic, {})] }) }), _jsx(LoadingScreen, {}), _jsx(HUD, {}), _jsx(ZoneTransition, {}), _jsx(CharacterSelectScreen, {}), _jsx(DebugTools, {}), _jsx(DebugWorldMap, {})] }));
}
//# sourceMappingURL=GameCanvas.js.map