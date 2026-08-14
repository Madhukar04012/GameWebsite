import React from "react";
export interface InteriorConfig {
    tier: "A" | "B";
    component: React.ComponentType<{
        w: number;
        d: number;
        storyH: number;
    }>;
}
export declare const INTERIOR_REGISTRY: Record<string, InteriorConfig>;
//# sourceMappingURL=InteriorRegistry.d.ts.map