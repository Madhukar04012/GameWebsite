import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createWoodMaterial } from "../../../materials/createWoodMaterial";
import { createStoneMaterial } from "../../../materials/createStoneMaterial";
import { createFabricMaterial } from "../../../materials/createFabricMaterial";
import { useWorldStore } from "../../../store/worldStore";
const woodDark = createWoodMaterial({ woodColor: "#352216", roughness: 0.8 });
const marble = createStoneMaterial({ stoneColor: "#ffffff", roughness: 0.4, metalness: 0.1 });
const richCarpet = createFabricMaterial({ kind: "banner", color: "#3a1860" });
export function ManorInterior({ w, d, storyH }) {
    const isNight = useWorldStore((s) => s.timeOfDay >= 18 || s.timeOfDay <= 6);
    const lightIntensity = isNight ? 1.0 : 0.5;
    return (_jsxs("group", { children: [_jsx("mesh", { position: [0, 0.05, 0], receiveShadow: true, material: marble, children: _jsx("boxGeometry", { args: [w - 0.2, 0.1, d - 0.2] }) }), _jsx("mesh", { position: [0, 0.11, 0], receiveShadow: true, material: richCarpet, rotation: [-Math.PI / 2, 0, 0], children: _jsx("circleGeometry", { args: [Math.min(w, d) * 0.35, 32] }) }), _jsxs("group", { position: [0, 0.5, 0], children: [_jsx("mesh", { castShadow: true, receiveShadow: true, material: woodDark, children: _jsx("boxGeometry", { args: [w * 0.5, 0.1, 1.2] }) }), _jsx("mesh", { position: [-w * 0.2, -0.2, 0], castShadow: true, receiveShadow: true, material: woodDark, children: _jsx("cylinderGeometry", { args: [0.08, 0.08, 0.5] }) }), _jsx("mesh", { position: [w * 0.2, -0.2, 0], castShadow: true, receiveShadow: true, material: woodDark, children: _jsx("cylinderGeometry", { args: [0.08, 0.08, 0.5] }) })] }), _jsx("pointLight", { position: [0, storyH - 0.5, 0], intensity: lightIntensity, distance: 10, color: "#ffddaa", castShadow: true })] }));
}
//# sourceMappingURL=ManorInterior.js.map