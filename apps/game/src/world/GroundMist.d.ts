/**
 * GroundMist -- Low-lying rolling mist layer. Uses a horizontal particle field
 * with custom shaders for wispy, drifting fog at ground level.
 *
 * Art direction: pale blue-white or magical ethereal mist that hugs the ground
 * and slowly rolls, creating depth and atmosphere in low areas, swamps, and
 * morning scenes.
 */
interface GroundMistProps {
    count?: number;
    /** Center of the mist volume. */
    position?: [number, number, number];
    /** Horizontal spread radius (default 60). */
    radius?: number;
    /** Vertical thickness (default 3 = thin ground layer). */
    thickness?: number;
    /** Mist color (default pale blue-white). */
    color?: string;
    /** Opacity scaling factor (default 1.0). */
    opacity?: number;
}
export declare function GroundMist({ count, position, radius, thickness, color, opacity, }: GroundMistProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=GroundMist.d.ts.map