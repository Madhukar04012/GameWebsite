import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useNPCStore } from "../../store/npcStore";

const _object = new THREE.Object3D();
const _color = new THREE.Color();

// Very simple placeholder colors based on profession
const ProfessionColors: Record<string, string> = {
  Citizen: "#a3b18a",
  Guard: "#silver", 
  Merchant: "#d4af37",
  Noble: "#9d4edd",
  Worker: "#d4a373",
  Priest: "#fff",
  Sailor: "#0077b6"
};

export function NPCRenderer() {
  const npcs = useNPCStore(s => s.npcs); // trigger render when count changes
  const mutableNPCs = useNPCStore(s => s.mutableNPCs);
  
  const count = npcs.length;
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Map array index to ID for fast access during useFrame
  const npcArray = useMemo(() => npcs, [npcs]);

  useFrame(() => {
    if (!meshRef.current) return;
    
    let renderedCount = 0;
    
    // Iterate array for stable order matching instances
    for (let i = 0; i < count; i++) {
      const id = npcArray[i].id;
      const npc = mutableNPCs.get(id);
      if (!npc) continue;

      // Only render Tier 1 or Tier 2 (visible nearby). Skip Tier 0 to save vertex processing.
      if (npc.state.tier > 0) {
        _object.position.set(npc.state.position.x, npc.state.position.y + 1, npc.state.position.z);
        _object.updateMatrix();
        meshRef.current.setMatrixAt(renderedCount, _object.matrix);
        
        _color.set(ProfessionColors[npc.profession] || "#ccc");
        meshRef.current.setColorAt(renderedCount, _color);
        
        renderedCount++;
      }
    }
    
    meshRef.current.count = renderedCount;
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  if (count === 0) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow receiveShadow>
      <capsuleGeometry args={[0.4, 1.0, 4, 8]} />
      <meshStandardMaterial roughness={0.8} />
    </instancedMesh>
  );
}
