import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useInputManager } from "./InputManager";
import { createInitialPlayerState, updatePlayer, createDefaultCamera, heightAt, } from "@legend/engine";
import { playerPos } from "../store/playerPosStore";
import { getSocket } from "./NetworkClient";
const NET_TICK = 0.05; // 20 Hz movement sync
export function PlayerEntity({ apiRef }) {
    const rootRef = useRef(null);
    const bodyRef = useRef(null);
    const leftArmRef = useRef(null);
    const rightArmRef = useRef(null);
    const leftLegRef = useRef(null);
    const rightLegRef = useRef(null);
    const capeRef = useRef(null);
    const stateRef = useRef(createInitialPlayerState());
    const inputRef = useInputManager();
    const cameraRef = useRef(createDefaultCamera());
    const playerPosRef = useRef({ x: 0, y: 0, z: 0 });
    const netAcc = useRef(0);
    const walkTime = useRef(0);
    // Expose API for camera to consume
    useEffect(() => {
        if (apiRef) {
            apiRef.current = {
                get position() { return playerPosRef.current; },
                get state() { return stateRef.current; },
                get cameraYaw() { return cameraRef.current.yaw; },
                setCameraYaw(yaw) { cameraRef.current.yaw = yaw; },
            };
        }
    }, [apiRef]);
    // Materials memoized for player avatar
    const mats = useMemo(() => ({
        armorSilver: new THREE.MeshStandardMaterial({
            color: "#d8dde6",
            metalness: 0.85,
            roughness: 0.25,
        }),
        armorGold: new THREE.MeshStandardMaterial({
            color: "#f5c542",
            metalness: 0.9,
            roughness: 0.2,
            emissive: "#d4af37",
            emissiveIntensity: 0.2,
        }),
        darkSteel: new THREE.MeshStandardMaterial({
            color: "#2a2d34",
            metalness: 0.7,
            roughness: 0.5,
        }),
        glowingVisor: new THREE.MeshBasicMaterial({
            color: "#00f0ff",
        }),
        runeGlow: new THREE.MeshStandardMaterial({
            color: "#00e5ff",
            emissive: "#00d4ff",
            emissiveIntensity: 2.2,
            roughness: 0.1,
        }),
        capeRed: new THREE.MeshStandardMaterial({
            color: "#991b1b",
            roughness: 0.8,
            side: THREE.DoubleSide,
        }),
        capeTrim: new THREE.MeshStandardMaterial({
            color: "#d4af37",
            roughness: 0.5,
        }),
    }), []);
    useFrame((_, delta) => {
        const dt = Math.min(delta, 0.05);
        const state = updatePlayer(stateRef.current, inputRef.current, dt, cameraRef.current.yaw);
        const groundY = heightAt(state.position.x, state.position.z);
        state.position.y = state.position.y < groundY ? groundY : state.position.y;
        if (state.position.y === groundY)
            state.isGrounded = true;
        stateRef.current = state;
        playerPosRef.current = state.position;
        // Publish position for AI / audio
        playerPos.set({ x: state.position.x, z: state.position.z });
        // Sync movement to server
        netAcc.current += dt;
        if (netAcc.current >= NET_TICK) {
            netAcc.current = 0;
            const socket = getSocket();
            if (socket?.connected) {
                socket.emit("player:move", {
                    position: state.position,
                    rotation: state.rotation,
                });
            }
        }
        if (rootRef.current) {
            rootRef.current.position.set(state.position.x, state.position.y, state.position.z);
            rootRef.current.rotation.y = state.rotation;
        }
        // Procedural walk & idle animation
        const isMoving = Boolean(inputRef.current.forward || inputRef.current.backward || inputRef.current.left || inputRef.current.right);
        if (isMoving) {
            walkTime.current += dt * 10;
        }
        else {
            walkTime.current += dt * 2;
        }
        const t = walkTime.current;
        // Bobbing & breathing
        if (bodyRef.current) {
            bodyRef.current.position.y = isMoving ? Math.abs(Math.sin(t)) * 0.08 : Math.sin(t) * 0.02;
        }
        // Arm and Leg swinging
        if (leftLegRef.current && rightLegRef.current) {
            const legSwing = isMoving ? Math.sin(t) * 0.6 : 0;
            leftLegRef.current.rotation.x = legSwing;
            rightLegRef.current.rotation.x = -legSwing;
        }
        if (leftArmRef.current && rightArmRef.current) {
            const armSwing = isMoving ? Math.sin(t) * 0.5 : Math.sin(t * 0.5) * 0.05;
            leftArmRef.current.rotation.x = -armSwing;
            rightArmRef.current.rotation.x = armSwing;
        }
        // Cape wind flutter
        if (capeRef.current) {
            const flutter = Math.sin(t * 1.5) * 0.15 + (isMoving ? 0.35 : 0.1);
            capeRef.current.rotation.x = 0.1 + flutter;
        }
    });
    return (_jsxs("group", { ref: rootRef, children: [_jsxs("mesh", { rotation: [-Math.PI / 2, 0, 0], position: [0, 0.02, 0], children: [_jsx("circleGeometry", { args: [0.55, 16] }), _jsx("meshBasicMaterial", { color: "#000000", transparent: true, opacity: 0.35 })] }), _jsxs("group", { ref: bodyRef, position: [0, 0.7, 0], children: [_jsx("mesh", { castShadow: true, material: mats.armorSilver, position: [0, 0.25, 0], children: _jsx("boxGeometry", { args: [0.42, 0.5, 0.26] }) }), _jsx("mesh", { castShadow: true, material: mats.armorGold, position: [0, 0.28, 0.135], children: _jsx("boxGeometry", { args: [0.2, 0.2, 0.03] }) }), _jsx("mesh", { castShadow: true, material: mats.darkSteel, position: [0, 0.02, 0], children: _jsx("boxGeometry", { args: [0.44, 0.08, 0.28] }) }), _jsx("mesh", { castShadow: true, material: mats.armorGold, position: [0, 0.02, 0.145], children: _jsx("boxGeometry", { args: [0.1, 0.1, 0.02] }) }), _jsxs("group", { position: [0, 0.65, 0], children: [_jsx("mesh", { castShadow: true, material: mats.armorSilver, children: _jsx("boxGeometry", { args: [0.3, 0.32, 0.32] }) }), _jsx("mesh", { castShadow: true, material: mats.armorGold, position: [0, 0.2, -0.02], children: _jsx("boxGeometry", { args: [0.06, 0.14, 0.28] }) }), _jsx("mesh", { position: [0, 0.02, 0.162], material: mats.glowingVisor, children: _jsx("boxGeometry", { args: [0.22, 0.04, 0.01] }) })] }), _jsx("mesh", { castShadow: true, material: mats.armorGold, position: [-0.28, 0.45, 0], children: _jsx("sphereGeometry", { args: [0.14, 8, 8] }) }), _jsx("mesh", { castShadow: true, material: mats.armorGold, position: [0.28, 0.45, 0], children: _jsx("sphereGeometry", { args: [0.14, 8, 8] }) }), _jsxs("group", { ref: leftArmRef, position: [-0.28, 0.35, 0], children: [_jsx("mesh", { castShadow: true, material: mats.armorSilver, position: [0, -0.2, 0], children: _jsx("cylinderGeometry", { args: [0.065, 0.055, 0.4, 8] }) }), _jsxs("group", { position: [-0.12, -0.15, 0.08], rotation: [0, -Math.PI / 4, 0], children: [_jsx("mesh", { castShadow: true, material: mats.capeRed, children: _jsx("boxGeometry", { args: [0.35, 0.55, 0.04] }) }), _jsx("mesh", { castShadow: true, material: mats.armorGold, position: [0, 0, 0.025], children: _jsx("boxGeometry", { args: [0.15, 0.25, 0.01] }) })] })] }), _jsx("group", { ref: rightArmRef, position: [0.28, 0.35, 0], children: _jsx("mesh", { castShadow: true, material: mats.armorSilver, position: [0, -0.2, 0], children: _jsx("cylinderGeometry", { args: [0.065, 0.055, 0.4, 8] }) }) }), _jsxs("group", { position: [0.05, 0.28, -0.18], rotation: [0, 0, -Math.PI / 5], children: [_jsx("mesh", { castShadow: true, material: mats.armorGold, position: [0, 0.48, 0], children: _jsx("cylinderGeometry", { args: [0.025, 0.025, 0.22, 6] }) }), _jsx("mesh", { castShadow: true, material: mats.armorGold, position: [0, 0.35, 0], children: _jsx("boxGeometry", { args: [0.24, 0.04, 0.06] }) }), _jsx("mesh", { castShadow: true, material: mats.darkSteel, position: [0, -0.15, 0], children: _jsx("boxGeometry", { args: [0.08, 0.95, 0.04] }) }), _jsx("mesh", { material: mats.runeGlow, position: [0, -0.15, 0.025], children: _jsx("boxGeometry", { args: [0.03, 0.8, 0.01] }) })] }), _jsx("mesh", { ref: capeRef, castShadow: true, material: mats.capeRed, position: [0, 0.45, -0.14], children: _jsx("planeGeometry", { args: [0.42, 0.85, 4, 4] }) })] }), _jsxs("group", { ref: leftLegRef, position: [-0.12, 0.45, 0], children: [_jsx("mesh", { castShadow: true, material: mats.darkSteel, position: [0, -0.2, 0], children: _jsx("cylinderGeometry", { args: [0.075, 0.065, 0.4, 8] }) }), _jsx("mesh", { castShadow: true, material: mats.armorSilver, position: [0, -0.4, 0.04], children: _jsx("boxGeometry", { args: [0.12, 0.1, 0.2] }) })] }), _jsxs("group", { ref: rightLegRef, position: [0.12, 0.45, 0], children: [_jsx("mesh", { castShadow: true, material: mats.darkSteel, position: [0, -0.2, 0], children: _jsx("cylinderGeometry", { args: [0.075, 0.065, 0.4, 8] }) }), _jsx("mesh", { castShadow: true, material: mats.armorSilver, position: [0, -0.4, 0.04], children: _jsx("boxGeometry", { args: [0.12, 0.1, 0.2] }) })] })] }));
}
//# sourceMappingURL=PlayerEntity.js.map