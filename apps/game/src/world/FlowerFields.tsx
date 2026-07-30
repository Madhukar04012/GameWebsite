import { useRef, useState, useEffect, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Sparkles } from "@react-three/drei";
import { Mesh } from "three";
import { createSlime, createWraith, createGolem } from "@legend/engine";
import type { MonsterData, MonsterKind } from "@legend/engine";
import { MonsterEntity } from "./MonsterEntity";
import { playerPos } from "../store/playerPosStore";
import { createTerrainMaterial } from "../materials/createTerrainMaterial";

/** Art-bible: bioluminescent flora palette — emerald + sapphire + crimson glow. */
const COLORS = ["#d4af37", "#c44a6a", "#2a9d8f", "#5daeff", "#e63946"];

interface FlowerProps { position: [number, number, number]; }

function Flower({ position }: FlowerProps) {
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  // No per-flower pointLight — the grove previously spawned ~200, killing
  // integrated-GPU perf. Emissive glow is the bloom-fake stand-in.
  return (
    <group position={position}>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.01, 0.015, 0.5]} />
        <meshStandardMaterial color="#1a3b2a" />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} />
      </mesh>
    </group>
  );
}

const flowers = Array.from({ length: 200 }, () =>
  [(Math.random() - 0.5) * 40, 0, (Math.random() - 0.5) * 40] as [number, number, number]
);

/** Floating ember particles — warm gold motes drifting above the field. */
const embers = Array.from({ length: 40 }, () =>
  [(Math.random() - 0.5) * 38, 0.5 + Math.random() * 3, (Math.random() - 0.5) * 38] as [number, number, number]
);

const SPAWNS = [
  { x: -6, z: -4, kind: "slime" as MonsterKind },
  { x: 4, z: -6, kind: "slime" as MonsterKind },
  { x: -2, z: -10, kind: "slime" as MonsterKind },
  { x: 8, z: -2, kind: "wraith" as MonsterKind },
  { x: -8, z: -8, kind: "wraith" as MonsterKind },
  { x: 0, z: -14, kind: "golem" as MonsterKind },
];

function makeMonster(kind: MonsterKind, idx: string, x: number, z: number): MonsterData {
  if (kind === "wraith") return createWraith(idx, x, z);
  if (kind === "golem") return createGolem(idx, x, z);
  return createSlime(idx, x, z);
}

const initialMonsters: MonsterData[] = SPAWNS.map((s, i) =>
  makeMonster(s.kind, `${s.kind}-${i}`, s.x, s.z)
);

const groveMat = createTerrainMaterial({ variant: "grove", seed: [5.1, 2.7] });

export function FlowerFields() {
  const [monsters, setMonsters] = useState(initialMonsters);

  const handleDeath = useCallback((id: string) => {
    setMonsters((prev) => prev.filter((s) => s.id !== id));
    const spawn = SPAWNS[Math.floor(Math.random() * SPAWNS.length)];
    setTimeout(() => {
      setMonsters((prev) => [...prev, makeMonster(spawn.kind, `${spawn.kind}-${Date.now()}`, spawn.x, spawn.z)]);
    }, 5000);
  }, []);

  return (
    <group position={[0, 0, -150]}>
      {/* Mystic grove ground — deep blue-green bioluminescent grass. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow material={groveMat}>
        <planeGeometry args={[50, 50]} />
      </mesh>

      {flowers.map((pos, i) => <Flower key={i} position={pos} />)}
      {embers.map((pos, i) => <Ember key={i} position={pos} />)}

      {/* Firefly sparkle field — bioluminescent glow replacing the cut pointLights. */}
      <Sparkles count={80} scale={[40, 8, 40]} size={4} speed={0.6} color="#2a9d8f" opacity={0.7} />
      <Sparkles count={50} scale={[35, 5, 35]} size={2.5} speed={0.8} color="#d4af37" opacity={0.5} />
      <Sparkles count={30} scale={[30, 4, 30]} size={2} speed={0.5} color="#c44a6a" opacity={0.4} />

      {monsters.map((s) => <MonsterEntity key={s.id} data={s} onDeath={handleDeath} />)}

      <Text position={[0, 4, 0]} fontSize={0.8} color="#2a9d8f" anchorX="center" anchorY="middle">
        Flower Fields
      </Text>
    </group>
  );
}

function Ember({ position }: { position: [number, number, number] }) {
  const ref = useRef<Mesh>(null);
  const baseY = position[1];
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.position.y = baseY + Math.sin(performance.now() * 0.001 + position[0]) * 0.3;
    ref.current.rotation.y += delta;
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.03, 6, 6]} />
      <meshBasicMaterial color="#f3c649" transparent opacity={0.7} />
    </mesh>
  );
}
