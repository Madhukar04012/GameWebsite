import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createWoodMaterial } from "../../../materials/createWoodMaterial";
import { createStoneMaterial } from "../../../materials/createStoneMaterial";
import { useWorldStore } from "../../../store/worldStore";
const woodDark = createWoodMaterial({ woodColor: "#3a2416", roughness: 0.9 });
const woodMid = createWoodMaterial({ woodColor: "#5c3c24", roughness: 0.85 });
const stoneFloor = createStoneMaterial({ stoneColor: "#555248", roughness: 0.9 });
export function ShopInterior({ w, d, storyH }) {
    const isNight = useWorldStore((s) => s.timeOfDay >= 18 || s.timeOfDay <= 6);
    const lightIntensity = isNight ? 1.0 : 0.4;
    return (_jsxs("group", { children: [_jsx("mesh", { position: [0, 0.05, 0], receiveShadow: true, material: stoneFloor, children: _jsx("boxGeometry", { args: [w - 0.2, 0.1, d - 0.2] }) }), _jsxs("group", { position: [0, 0.5, 0], children: [_jsx("mesh", { position: [-w / 4 + 0.5, 0, 0], castShadow: true, receiveShadow: true, material: woodDark, children: _jsx("boxGeometry", { args: [w / 2 - 1.5, 1.0, 0.8] }) }), _jsx("mesh", { position: [w / 4 - 0.5, 0, 0], castShadow: true, receiveShadow: true, material: woodDark, children: _jsx("boxGeometry", { args: [w / 2 - 1.5, 1.0, 0.8] }) })] }), _jsxs("group", { position: [0, 1.2, -d / 2 + 0.3], children: [_jsx("mesh", { castShadow: true, receiveShadow: true, material: woodMid, children: _jsx("boxGeometry", { args: [w - 1.0, 2.4, 0.4] }) }), Array.from({ length: 4 }).map((_, i) => (_jsx("mesh", { position: [0, -1.0 + i * 0.6, 0.2], castShadow: true, receiveShadow: true, material: woodDark, children: _jsx("boxGeometry", { args: [w - 1.2, 0.05, 0.3] }) }, i)))] }), _jsx("pointLight", { position: [0, storyH - 0.5, 0], intensity: lightIntensity, distance: 8, color: "#ffd480" })] }));
}
//# sourceMappingURL=ShopInterior.js.map