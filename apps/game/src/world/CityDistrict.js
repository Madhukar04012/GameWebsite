import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Text } from "@react-three/drei";
import { CityBuilding } from "./CityBuilding";
import { CityBlock } from "./CityBlock";
/** Renders a city district with all its buildings (+ optional label). */
export function CityDistrict({ district, showLabel = false }) {
    const labelPos = {
        x: district.center.x,
        z: district.center.z,
    };
    return (_jsxs("group", { children: [district.buildings.map((b, i) => (_jsx(CityBuilding, { def: b, color: b.color ?? district.color, district: district.name }, `${district.name}-bldg-${i}`))), district.blocks?.map((block, i) => (_jsx(CityBlock, { block: block, district: district.name, color: district.color }, `${district.name}-block-${i}`))), showLabel && (_jsx(Text, { position: [labelPos.x, 8, labelPos.z], fontSize: 1.2, color: "#d4af37", outlineWidth: 0.04, outlineColor: "#000", anchorX: "center", anchorY: "middle", children: district.label }))] }));
}
//# sourceMappingURL=CityDistrict.js.map