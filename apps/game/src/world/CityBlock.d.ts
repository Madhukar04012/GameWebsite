import type { CityBlockDef, DistrictName, BuildingDef } from "@legend/shared";
interface CityBlockProps {
    block: CityBlockDef;
    district: DistrictName;
    color: string;
}
export declare function generateBlockLayout(block: CityBlockDef, district: DistrictName): {
    bldgs: BuildingDef[];
    props: any[];
};
export declare function CityBlock({ block, district, color }: CityBlockProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=CityBlock.d.ts.map