import { Instances, Instance } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createStoneMaterial } from "../materials/createStoneMaterial";
import { createMetalMaterial } from "../materials/createMetalMaterial";
import { createWoodMaterial } from "../materials/createWoodMaterial";
import { generateDefenses } from "./generateDefenses";
import { useWorldStore } from "../store/worldStore";

const wallMat = createStoneMaterial({ stoneColor: "#8e8678", roughness: 0.95 });
const fndMat = createStoneMaterial({ stoneColor: "#4a4652", roughness: 0.92, seed: [2, 9] });
const towerMat = createStoneMaterial({ stoneColor: "#9c9383", roughness: 0.9, seed: [3.3, 1.1] });
const roofMat = createStoneMaterial({ roof: true, stoneColor: "#6c4d41", roughness: 0.8, metalness: 0.1 });
const ironMat = createMetalMaterial({ kind: "iron", seed: [40, 1] });
const woodMat = createWoodMaterial({ woodColor: "#3a2e1c", roughness: 0.9, seed: [40, 3] });
const torchEmissiveMat = new THREE.MeshStandardMaterial({ color: "#ffcc88", emissive: "#ff8800", emissiveIntensity: 0 });

function TorchLightsUpdater() {
  useFrame(() => {
    const timeOfDay = useWorldStore.getState().timeOfDay;
    const isNight = timeOfDay >= 18 || timeOfDay <= 6;
    let target = isNight ? 2 : 0;
    // fade in/out
    if (timeOfDay > 17 && timeOfDay < 19) {
      target = (timeOfDay - 17) / 2 * 2;
    } else if (timeOfDay > 5 && timeOfDay < 7) {
      target = (1 - (timeOfDay - 5) / 2) * 2;
    }
    torchEmissiveMat.emissiveIntensity = THREE.MathUtils.lerp(torchEmissiveMat.emissiveIntensity, target, 0.05);
  });
  return null;
}

export function Walls() {
  const items = useMemo(() => generateDefenses(), []);

  const walls = items.filter(i => i.kind === "wall");
  const foundations = items.filter(i => i.kind === "foundation");
  const merlons = items.filter(i => i.kind === "merlon");
  const roundTowers = items.filter(i => i.kind === "tower_round");
  const squareTowers = items.filter(i => i.kind === "tower_square");
  const gates = items.filter(i => i.kind === "gate");
  const doorsL = items.filter(i => i.kind === "door_left");
  const doorsR = items.filter(i => i.kind === "door_right");
  const portcullises = items.filter(i => i.kind === "portcullis");
  const torches = items.filter(i => i.kind === "torch");

  const isNight = useWorldStore(s => s.timeOfDay >= 18 || s.timeOfDay <= 6);
  const torchIntensity = isNight ? 2 : 0; // The point lights need React state if we want them dynamic, but they are expensive anyway.

  return (
    <group>
      <TorchLightsUpdater />

      {/* Walls */}
      <Instances limit={Math.max(1, walls.length)} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <primitive object={wallMat} attach="material" />
        {walls.map((w, i) => <Instance key={i} position={w.position} rotation={w.rotation} scale={w.scale} />)}
      </Instances>

      {/* Foundations */}
      <Instances limit={Math.max(1, foundations.length)} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <primitive object={fndMat} attach="material" />
        {foundations.map((f, i) => <Instance key={i} position={f.position} rotation={f.rotation} scale={f.scale} />)}
      </Instances>

      {/* Merlons */}
      <Instances limit={Math.max(1, merlons.length)} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <primitive object={wallMat} attach="material" />
        {merlons.map((m, i) => <Instance key={i} position={m.position} rotation={m.rotation} scale={m.scale} />)}
      </Instances>

      {/* Round Towers */}
      <Instances limit={Math.max(1, roundTowers.length)} castShadow receiveShadow>
        <cylinderGeometry args={[1, 1, 1, 12]} />
        <primitive object={towerMat} attach="material" />
        {roundTowers.map((t, i) => <Instance key={i} position={t.position} rotation={t.rotation} scale={t.scale} />)}
      </Instances>
      
      {/* Round Tower Roofs & Machicolations */}
      <Instances limit={Math.max(1, roundTowers.length)} castShadow>
        <coneGeometry args={[1.2, 1, 12]} />
        <primitive object={roofMat} attach="material" />
        {roundTowers.map((t, i) => <Instance key={i} position={[t.position[0], t.position[1] + t.scale[1]/2 + t.scale[0]*0.4, t.position[2]]} scale={[t.scale[0], t.scale[0]*0.8, t.scale[2]]} />)}
      </Instances>
      <Instances limit={Math.max(1, roundTowers.length)} castShadow>
        <cylinderGeometry args={[1.15, 1.0, 0.2, 12]} />
        <primitive object={fndMat} attach="material" />
        {roundTowers.map((t, i) => <Instance key={i} position={[t.position[0], t.position[1] + t.scale[1]/2 - t.scale[1]*0.02, t.position[2]]} scale={[t.scale[0], t.scale[1]*0.1, t.scale[2]]} />)}
      </Instances>

      {/* Square Towers */}
      <Instances limit={Math.max(1, squareTowers.length)} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <primitive object={towerMat} attach="material" />
        {squareTowers.map((t, i) => <Instance key={i} position={t.position} rotation={t.rotation} scale={t.scale} />)}
      </Instances>
      
      {/* Square Tower Roofs & Machicolations */}
      <Instances limit={Math.max(1, squareTowers.length)} castShadow>
        <coneGeometry args={[0.8, 1, 4]} />
        <primitive object={roofMat} attach="material" />
        {squareTowers.map((t, i) => <Instance key={i} position={[t.position[0], t.position[1] + t.scale[1]/2 + t.scale[0]*0.5, t.position[2]]} rotation={[0, Math.PI/4 + t.rotation[1], 0]} scale={[t.scale[0]*1.4, t.scale[0], t.scale[2]*1.4]} />)}
      </Instances>
      <Instances limit={Math.max(1, squareTowers.length)} castShadow>
        <boxGeometry args={[1.15, 0.2, 1.15]} />
        <primitive object={fndMat} attach="material" />
        {squareTowers.map((t, i) => <Instance key={i} position={[t.position[0], t.position[1] + t.scale[1]/2 - t.scale[1]*0.02, t.position[2]]} rotation={t.rotation} scale={[t.scale[0], t.scale[1]*0.1, t.scale[2]]} />)}
      </Instances>

      {/* Gatehouse Bodies */}
      <Instances limit={Math.max(1, gates.length)} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <primitive object={wallMat} attach="material" />
        {gates.map((g, i) => <Instance key={i} position={g.position} rotation={g.rotation} scale={g.scale} />)}
      </Instances>
      
      {/* Gatehouse Roofs & Details */}
      <Instances limit={Math.max(1, gates.length)} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <primitive object={roofMat} attach="material" />
        {gates.map((g, i) => <Instance key={i} position={[g.position[0], g.position[1] + g.scale[1]/2 + 0.6, g.position[2]]} rotation={g.rotation} scale={[g.scale[0]+1, 1.2, g.scale[2]+1]} />)}
      </Instances>
      <Instances limit={Math.max(1, gates.length)} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <primitive object={fndMat} attach="material" />
        {gates.map((g, i) => <Instance key={i} position={[g.position[0], g.position[1] + g.scale[1]/2 - 0.2, g.position[2]]} rotation={g.rotation} scale={[g.scale[0]+0.8, 0.4, g.scale[2]+0.8]} />)}
      </Instances>
      {/* Gatehouse Passage Tunnel */}
      <Instances limit={Math.max(1, gates.length)} receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <primitive object={fndMat} attach="material" />
        {gates.map((g, i) => <Instance key={i} position={[g.position[0], g.position[1] - g.scale[1]/2 + g.scale[1]*0.3, g.position[2]]} rotation={g.rotation} scale={[g.scale[0]*0.4, g.scale[1]*0.6, g.scale[2]+0.1]} />)}
      </Instances>

      {/* Portcullis Top Bars */}
      <Instances limit={Math.max(1, portcullises.length)} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <primitive object={ironMat} attach="material" />
        {portcullises.map((p, i) => <Instance key={i} position={[p.position[0], p.position[1] + p.scale[1]*0.4, p.position[2]]} rotation={p.rotation} scale={[p.scale[0], 0.4, p.scale[2]]} />)}
      </Instances>
      
      {/* Portcullis Vertical Bars */}
      <Instances limit={Math.max(1, portcullises.length * 8)} castShadow>
        <cylinderGeometry args={[1, 1, 1, 6]} />
        <primitive object={ironMat} attach="material" />
        {portcullises.map((p, i) => {
          const bars = [];
          for(let b = 0; b < 8; b++) {
            const ox = (b - 3.5) * (p.scale[0] / 8);
            const s = Math.sin(p.rotation[1]);
            const c = Math.cos(p.rotation[1]);
            bars.push(<Instance key={`${i}-${b}`} position={[p.position[0] + ox*c, p.position[1], p.position[2] - ox*s]} rotation={p.rotation} scale={[0.1, p.scale[1], 0.1]} />);
          }
          return bars;
        })}
      </Instances>

      {/* Doors */}
      <Instances limit={Math.max(1, doorsL.length)} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <primitive object={woodMat} attach="material" />
        {doorsL.map((d, i) => <Instance key={i} position={d.position} rotation={d.rotation} scale={d.scale} />)}
      </Instances>
      <Instances limit={Math.max(1, doorsR.length)} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <primitive object={woodMat} attach="material" />
        {doorsR.map((d, i) => <Instance key={i} position={d.position} rotation={d.rotation} scale={d.scale} />)}
      </Instances>
      {/* Door Metal Bands */}
      <Instances limit={Math.max(1, doorsL.length * 3 + doorsR.length * 3)} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <primitive object={ironMat} attach="material" />
        {doorsL.map((d, i) => {
          return [-0.3, 0, 0.3].map(yOff => <Instance key={`L-${i}-${yOff}`} position={[d.position[0], d.position[1] + d.scale[1] * yOff, d.position[2]]} rotation={d.rotation} scale={[d.scale[0]*1.02, 0.2, d.scale[2]*1.1]} />);
        })}
        {doorsR.map((d, i) => {
          return [-0.3, 0, 0.3].map(yOff => <Instance key={`R-${i}-${yOff}`} position={[d.position[0], d.position[1] + d.scale[1] * yOff, d.position[2]]} rotation={d.rotation} scale={[d.scale[0]*1.02, 0.2, d.scale[2]*1.1]} />);
        })}
      </Instances>

      {/* Torches Emissive */}
      <Instances limit={Math.max(1, torches.length)} castShadow>
        <cylinderGeometry args={[1, 0.5, 1, 6]} />
        <primitive object={ironMat} attach="material" />
        {torches.map((t, i) => <Instance key={`body-${i}`} position={t.position} rotation={t.rotation} scale={[0.1, 0.6, 0.1]} />)}
      </Instances>
      <Instances limit={Math.max(1, torches.length)}>
        <sphereGeometry args={[1, 8, 8]} />
        <primitive object={torchEmissiveMat} attach="material" />
        {torches.map((t, i) => <Instance key={`fire-${i}`} position={[t.position[0], t.position[1] + 0.35, t.position[2]]} rotation={t.rotation} scale={[0.15, 0.15, 0.15]} />)}
      </Instances>
      {/* Keep expensive PointLights only for the main gates if desired, or skip them for performance since we have so many.
          With 4 gates * 2 torches = 8 lights. That's fine. */}
      {torches.map((t, i) => (
        isNight && <pointLight key={`pl-${i}`} position={[t.position[0], t.position[1] + 0.5, t.position[2]]} intensity={torchIntensity} distance={15} color="#ffaa55" />
      ))}
    </group>
  );
}