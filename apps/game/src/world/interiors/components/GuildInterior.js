import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createWoodMaterial } from "../../../materials/createWoodMaterial";
import { createStoneMaterial } from "../../../materials/createStoneMaterial";
import { createFabricMaterial } from "../../../materials/createFabricMaterial";
import { useWorldStore } from "../../../store/worldStore";
const woodDark = createWoodMaterial({ woodColor: "#301d12", roughness: 0.85 });
const woodMid = createWoodMaterial({ woodColor: "#4a2e1c", roughness: 0.8 });
const stoneFloor = createStoneMaterial({ stoneColor: "#6c6a65", roughness: 0.85 });
const redCarpet = createFabricMaterial({ kind: "banner", color: "#a02020" });
export function GuildInterior({ w, d, storyH }) {
    const isNight = useWorldStore((s) => s.timeOfDay >= 18 || s.timeOfDay <= 6);
    const lightIntensity = isNight ? 1.2 : 0.6;
    return (_jsxs("group", { children: [_jsx("mesh", { position: [0, 0.05, 0], receiveShadow: true, material: stoneFloor, children: _jsx("boxGeometry", { args: [w - 0.2, 0.1, d - 0.2] }) }), _jsx("mesh", { position: [0, 0.11, 0], receiveShadow: true, material: redCarpet, children: _jsx("boxGeometry", { args: [w * 0.4, 0.02, d - 1.0] }) }), _jsx("group", { position: [0, 0.6, -d / 2 + 1.2], children: _jsx("mesh", { castShadow: true, receiveShadow: true, material: woodDark, children: _jsx("boxGeometry", { args: [2.0, 1.1, 1.0] }) }) }), [-w / 3, w / 3].map(px => [-d / 3, d / 3].map(pz => (_jsx("mesh", { position: [px, storyH / 2, pz], castShadow: true, receiveShadow: true, material: woodMid, children: _jsx("cylinderGeometry", { args: [0.2, 0.2, storyH, 8] }) }, `${px}-${pz}`)))), _jsx("pointLight", { position: [0, storyH - 0.8, 0], intensity: lightIntensity, distance: 12, color: "#ffeebb", castShadow: true })] }));
}
//# sourceMappingURL=GuildInterior.js.map