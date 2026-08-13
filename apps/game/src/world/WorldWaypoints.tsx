/**
 * WorldWaypoints — Genshin-style exploration waypoints, Seelie spirits, & treasure camps:
 * 1. Resonant Waypoint Monoliths (Hovering spinning crystal with vertical sky beam)
 * 2. Luminous Seelie Guide Spirits (Floating wisps leading along scenic paths)
 * 3. Ancient Sealed Treasure Chests (Gilded chests with glowing lock rings)
 * 4. Adventurer Cooking Camps (Hanging cauldron over campfire, tents, bedrolls)
 */

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles, Text } from "@react-three/drei";
import * as THREE from "three";
import { heightAt } from "@legend/engine";
import { createStoneMaterial } from "../materials/createStoneMaterial";
import { createWoodMaterial } from "../materials/createWoodMaterial";

const stoneMat = createStoneMaterial({ stoneColor: "#5c5549", roughness: 0.88 });
const woodMat = createWoodMaterial({ woodColor: "#402a1e", roughness: 0.9 });
const goldMat = new THREE.MeshStandardMaterial({
  color: "#f5c542",
  metalness: 0.85,
  roughness: 0.25,
  emissive: "#d4af37",
  emissiveIntensity: 0.4,
});
const waypointGlowMat = new THREE.MeshStandardMaterial({
  color: "#00f0ff",
  emissive: "#00b4d8",
  emissiveIntensity: 2.8,
  roughness: 0.1,
});

export function WorldWaypoints() {
  return (
    <group>
      <WaypointMonolith position={[15, 0, -22]} name="South Plains Waypoint" />
      <WaypointMonolith position={[-35, 0, -28]} name="Whistling Woods Waypoint" />
      <WaypointMonolith position={[45, 0, 45]} name="Sunstone Plateau Waypoint" />
      <SeelieGuideSpirit />
      <SealedTreasureChests />
      <AdventurerCookingCamp position={[-18, 0, -32]} />
    </group>
  );
}

/** 1. Teleport Waypoint Monolith with Sky Light Beam */
function WaypointMonolith({ position, name }: { position: [number, number, number]; name: string }) {
  const [x, , z] = position;
  const y = heightAt(x, z);
  const crystalRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (crystalRef.current) {
      crystalRef.current.rotation.y = t * 0.8;
      crystalRef.current.position.y = 2.4 + Math.sin(t * 2) * 0.12;
    }
  });

  return (
    <group position={[x, y, z]}>
      {/* Stepped Stone Base */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow material={stoneMat}>
        <cylinderGeometry args={[2.2, 2.6, 0.5, 12]} />
      </mesh>
      <mesh position={[0, 0.65, 0]} castShadow receiveShadow material={stoneMat}>
        <cylinderGeometry args={[1.7, 2.0, 0.35, 12]} />
      </mesh>

      {/* Dual Curved Stone Wings */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 1.3, 1.8, 0]} rotation={[0, 0, s * -0.2]}>
          <mesh castShadow material={stoneMat}>
            <boxGeometry args={[0.45, 2.6, 0.7]} />
          </mesh>
          <mesh position={[0, 1.3, 0]} material={goldMat}>
            <coneGeometry args={[0.3, 0.8, 6]} />
          </mesh>
        </group>
      ))}

      {/* Levitating Spinning Diamond Crystal */}
      <mesh ref={crystalRef} position={[0, 2.4, 0]} material={waypointGlowMat}>
        <octahedronGeometry args={[0.55, 0]} />
      </mesh>

      {/* Radiant Vertical Sky Light Beam */}
      <mesh position={[0, 45, 0]}>
        <cylinderGeometry args={[0.35, 0.8, 90, 8, 1, true]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.2}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      <Sparkles count={25} scale={[3, 5, 3]} position={[0, 2.5, 0]} size={4} speed={0.7} color="#00f0ff" />
      <Text position={[0, 4.5, 0]} fontSize={0.65} color="#00f0ff" anchorX="center">{name}</Text>
    </group>
  );
}

/** 2. Luminous Seelie Guide Spirit */
function SeelieGuideSpirit() {
  const seelieRef = useRef<THREE.Group>(null);
  const seelieMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#a0e7e5",
    emissive: "#48cae4",
    emissiveIntensity: 2.2,
    transparent: true,
    opacity: 0.85,
  }), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 0.4;
    // Follows scenic curve near the south gate path
    const px = -8 + Math.cos(t) * 12;
    const pz = -18 + Math.sin(t * 1.5) * 8;
    const py = heightAt(px, pz) + 1.4 + Math.sin(clock.elapsedTime * 2) * 0.25;
    if (seelieRef.current) {
      seelieRef.current.position.set(px, py, pz);
    }
  });

  return (
    <group ref={seelieRef}>
      {/* Spirit Orb Body */}
      <mesh material={seelieMat}>
        <sphereGeometry args={[0.3, 12, 12]} />
      </mesh>
      {/* Trailing Spirit Ribbon */}
      <mesh position={[0, -0.25, -0.15]} rotation={[0.3, 0, 0]} material={seelieMat}>
        <coneGeometry args={[0.18, 0.6, 8]} />
      </mesh>
      <Sparkles count={18} scale={[1.5, 1.5, 1.5]} size={3.5} speed={0.8} color="#90e0ef" />
    </group>
  );
}

/** 3. Ancient Sealed Treasure Chests */
function SealedTreasureChests() {
  const chestSpots = useMemo(() => [
    { x: -32, z: -18, rot: 0.5 },
    { x: 22, z: -28, rot: -0.8 },
    { x: -48, z: 22, rot: 1.2 },
  ], []);

  const chestWoodMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#5c3d2e", roughness: 0.8 }), []);

  return (
    <group>
      {chestSpots.map((c, i) => {
        const y = heightAt(c.x, c.z);
        return (
          <group key={`chest-${i}`} position={[c.x, y, c.z]} rotation={[0, c.rot, 0]}>
            {/* Stone Pedestal */}
            <mesh position={[0, 0.15, 0]} castShadow receiveShadow material={stoneMat}>
              <boxGeometry args={[1.6, 0.3, 1.3]} />
            </mesh>
            {/* Chest Body */}
            <mesh position={[0, 0.45, 0]} castShadow material={chestWoodMat}>
              <boxGeometry args={[0.9, 0.45, 0.6]} />
            </mesh>
            {/* Gilded Lid */}
            <mesh position={[0, 0.72, 0]} castShadow material={chestWoodMat}>
              <cylinderGeometry args={[0.3, 0.3, 0.9, 8, 1, false, 0, Math.PI]} />
            </mesh>
            {/* Gold Bands & Lock */}
            <mesh position={[0, 0.5, 0.31]} material={goldMat}>
              <boxGeometry args={[0.16, 0.18, 0.05]} />
            </mesh>
            {/* Glowing Lock Ring */}
            <mesh position={[0, 0.5, 0.33]} material={waypointGlowMat}>
              <ringGeometry args={[0.04, 0.08, 12]} />
            </mesh>
            <Sparkles count={6} scale={[1.2, 1, 1.2]} position={[0, 0.6, 0]} size={2.5} speed={0.4} color="#ffd166" />
          </group>
        );
      })}
    </group>
  );
}

/** 4. Adventurer Field Cooking Camp */
function AdventurerCookingCamp({ position }: { position: [number, number, number] }) {
  const [x, , z] = position;
  const y = heightAt(x, z);

  const tentFabricMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#3d5a80", roughness: 0.8, side: THREE.DoubleSide }), []);
  const cauldronMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#1c1c1c", metalness: 0.8, roughness: 0.4 }), []);
  const emberMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#ff5400" }), []);

  return (
    <group position={[x, y, z]}>
      {/* Triangular Adventurer Tent */}
      <group position={[-2.5, 1.1, 0]}>
        <mesh castShadow material={tentFabricMat}>
          <coneGeometry args={[1.8, 2.2, 4]} />
        </mesh>
        {/* Sleeping Bedroll */}
        <mesh position={[0, -0.9, 0]} material={new THREE.MeshStandardMaterial({ color: "#e0a96d" })}>
          <boxGeometry args={[0.9, 0.2, 1.6]} />
        </mesh>
      </group>

      {/* Cooking Cauldron on Tripod */}
      <group position={[0, 0, 0]}>
        {/* 3 Wooden Legs */}
        {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((ang, i) => (
          <mesh key={i} position={[Math.sin(ang) * 0.4, 0.8, Math.cos(ang) * 0.4]} rotation={[0.2 * Math.cos(ang), 0, -0.2 * Math.sin(ang)]} material={woodMat}>
            <cylinderGeometry args={[0.03, 0.04, 1.6, 6]} />
          </mesh>
        ))}
        {/* Iron Cauldron Pot */}
        <mesh position={[0, 0.6, 0]} castShadow material={cauldronMat}>
          <sphereGeometry args={[0.35, 12, 10]} />
        </mesh>
        {/* Crackling Fire Embers */}
        <mesh position={[0, 0.08, 0]} material={emberMat}>
          <cylinderGeometry args={[0.25, 0.35, 0.15, 8]} />
        </mesh>
        <Sparkles count={15} scale={[1, 1.5, 1]} position={[0, 0.6, 0]} size={3.5} speed={0.8} color="#ff7b00" />
      </group>

      {/* Wooden Notice Board */}
      <group position={[2.2, 1.2, 0]} rotation={[0, -0.4, 0]}>
        <mesh position={[0, 0, 0]} castShadow material={woodMat}>
          <boxGeometry args={[1.4, 1.0, 0.1]} />
        </mesh>
        <mesh position={[0, -0.8, 0]} castShadow material={woodMat}>
          <cylinderGeometry args={[0.06, 0.08, 1.6, 6]} />
        </mesh>
        <Text position={[0, 0.1, 0.06]} fontSize={0.14} color="#f4a261" anchorX="center">ADVENTURER POST</Text>
      </group>
    </group>
  );
}
