import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * DebugWorldMap — full-featured interactive 2D top-down World Geography Inspector.
 *
 * Visualizes:
 * 1. Macro Region Boundaries & Biome zones
 * 2. Topographic Elevation contours & landform crests
 * 3. Hydrology Network (Springs & Royal Torrent River gorge)
 * 4. Major World Travel Corridors & Roadways
 * 5. 12+ Landmark Pins with lore tooltips
 * 6. Live Player position telemetry beacon
 *
 * Toggled via 'M' key or DebugTools checkbox.
 */
import { useState, useEffect } from "react";
import { useDebugStore } from "../store/debugStore";
import { playerPos } from "../store/playerPosStore";
import { MASTER_LANDFORMS, MASTER_LANDMARKS, MASTER_SPRINGS, MASTER_TRAVEL_CORRIDORS, MASTER_DRAINAGE, sampleGeography, } from "@legend/shared";
export function DebugWorldMap() {
    const isVisible = useDebugStore((s) => s.worldMap);
    const toggleMap = useDebugStore((s) => s.toggle);
    const [pos, setPos] = useState(playerPos.get());
    const [selectedLandmark, setSelectedLandmark] = useState(null);
    // Subscribe to live player coordinates
    useEffect(() => {
        const unsub = playerPos.subscribe((newPos) => {
            setPos(newPos);
        });
        return () => {
            unsub();
        };
    }, []);
    // Keybind 'M' toggle
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "m" || e.key === "M") {
                // Ignore if typing in an input
                if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
                    return;
                toggleMap("worldMap");
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleMap]);
    if (!isVisible)
        return null;
    // Transform world coordinates (-200..+200) to SVG viewbox (0..800)
    // World: +Z is North (up in SVG -> Y=0), +X is East (right in SVG -> X=800)
    const toSvgX = (wx) => ((wx + 200) / 400) * 800;
    const toSvgY = (wz) => ((200 - wz) / 400) * 800;
    const playerSample = sampleGeography(pos.x, pos.z);
    return (_jsxs("div", { style: {
            position: "fixed",
            inset: 0,
            zIndex: 150,
            backgroundColor: "rgba(5, 7, 10, 0.88)",
            backdropFilter: "blur(8px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Inter', -apple-system, sans-serif",
            color: "#f0f2f5",
            userSelect: "none",
        }, children: [_jsxs("div", { style: {
                    width: "90%",
                    maxWidth: 960,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                    padding: "10px 18px",
                    background: "linear-gradient(90deg, rgba(20,25,35,0.9), rgba(15,20,30,0.7))",
                    border: "1px solid rgba(212,175,55,0.4)",
                    borderRadius: 8,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                }, children: [_jsxs("div", { style: { display: "flex", alignItems: "center", gap: 14 }, children: [_jsx("div", { style: { fontSize: 20, fontWeight: "bold", color: "#ffd166", letterSpacing: "0.08em" }, children: "\uD83D\uDDFA\uFE0F MASTER WORLD GEOGRAPHY MAP" }), _jsx("span", { style: { fontSize: 12, color: "#90e0ef", background: "rgba(0,180,216,0.15)", padding: "3px 8px", borderRadius: 4 }, children: "PHASE 1 FOUNDATION" })] }), _jsxs("div", { style: { display: "flex", alignItems: "center", gap: 16 }, children: [_jsxs("span", { style: { fontSize: 13, color: "#a0aec0" }, children: ["Press ", _jsx("kbd", { style: { background: "#2d3748", color: "#ffd166", padding: "2px 6px", borderRadius: 4, border: "1px solid #4a5568" }, children: "M" }), " to Close"] }), _jsx("button", { onClick: () => toggleMap("worldMap"), style: {
                                    background: "#e63946",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 6,
                                    padding: "6px 14px",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    fontSize: 13,
                                }, children: "\u2715 Close" })] })] }), _jsxs("div", { style: {
                    width: "90%",
                    maxWidth: 960,
                    height: "75vh",
                    display: "flex",
                    gap: 16,
                    position: "relative",
                }, children: [_jsx("div", { style: {
                            flex: 1,
                            background: "#080c14",
                            border: "1px solid rgba(212,175,55,0.3)",
                            borderRadius: 8,
                            overflow: "hidden",
                            position: "relative",
                            boxShadow: "inset 0 0 40px rgba(0,0,0,0.8)",
                        }, children: _jsxs("svg", { viewBox: "0 0 800 800", style: { width: "100%", height: "100%" }, children: [[-150, -100, -50, 0, 50, 100, 150].map((coord) => (_jsxs("g", { children: [_jsx("line", { x1: toSvgX(coord), y1: 0, x2: toSvgX(coord), y2: 800, stroke: "rgba(255,255,255,0.06)", strokeDasharray: "4 4" }), _jsx("line", { x1: 0, y1: toSvgY(coord), x2: 800, y2: toSvgY(coord), stroke: "rgba(255,255,255,0.06)", strokeDasharray: "4 4" }), _jsxs("text", { x: toSvgX(coord) + 4, y: 16, fill: "rgba(255,255,255,0.25)", fontSize: "10", children: [coord, "E"] }), _jsxs("text", { x: 8, y: toSvgY(coord) - 4, fill: "rgba(255,255,255,0.25)", fontSize: "10", children: [coord, "N"] })] }, `grid-${coord}`))), _jsx("rect", { x: 0, y: 0, width: 800, height: 280, fill: "rgba(160, 216, 255, 0.12)" }), _jsx("rect", { x: 0, y: 240, width: 300, height: 360, fill: "rgba(45, 106, 79, 0.16)" }), _jsx("rect", { x: 520, y: 160, width: 280, height: 440, fill: "rgba(217, 119, 6, 0.14)" }), _jsx("rect", { x: 0, y: 560, width: 360, height: 240, fill: "rgba(42, 58, 42, 0.22)" }), _jsx("rect", { x: 360, y: 560, width: 440, height: 240, fill: "rgba(6, 95, 70, 0.16)" }), _jsx("rect", { x: toSvgX(-46), y: toSvgY(46), width: toSvgX(46) - toSvgX(-46), height: toSvgY(-46) - toSvgY(46), fill: "rgba(212, 175, 55, 0.18)", stroke: "#ffd166", strokeWidth: "2", rx: "6" }), MASTER_TRAVEL_CORRIDORS.map((corridor) => (_jsx("polyline", { points: corridor.pathNodes.map((n) => `${toSvgX(n.x)},${toSvgY(n.z)}`).join(" "), fill: "none", stroke: "#f4a261", strokeWidth: "3.5", strokeDasharray: "6 4", opacity: "0.85" }, corridor.id))), MASTER_DRAINAGE.map((river) => (_jsx("polyline", { points: river.waypoints.map((w) => `${toSvgX(w.x)},${toSvgY(w.z)}`).join(" "), fill: "none", stroke: "#00b4d8", strokeWidth: "6", strokeLinecap: "round", strokeLinejoin: "round", opacity: "0.8" }, river.id))), MASTER_SPRINGS.map((sp) => (_jsx("circle", { cx: toSvgX(sp.source.x), cy: toSvgY(sp.source.z), r: "6", fill: "#00f5d4", stroke: "#ffffff", strokeWidth: "1.5" }, sp.id))), MASTER_LANDFORMS.map((lf) => (_jsxs("g", { transform: `translate(${toSvgX(lf.center.x)}, ${toSvgY(lf.center.z)})`, children: [_jsx("circle", { r: "4", fill: "rgba(255,255,255,0.4)" }), _jsx("text", { textAnchor: "middle", y: "-8", fill: "#e2e8f0", fontSize: "11", fontWeight: "bold", style: { textShadow: "0 2px 4px #000" }, children: lf.name })] }, lf.id))), MASTER_LANDMARKS.map((lm) => {
                                    const sx = toSvgX(lm.position.x);
                                    const sy = toSvgY(lm.position.z);
                                    const isSelected = selectedLandmark?.id === lm.id;
                                    return (_jsxs("g", { transform: `translate(${sx}, ${sy})`, onClick: () => setSelectedLandmark(lm), style: { cursor: "pointer" }, children: [_jsx("circle", { r: isSelected ? "11" : "8", fill: lm.importance === "major" ? "#ffd166" : "#00f0ff", stroke: "#ffffff", strokeWidth: "2" }), _jsx("text", { textAnchor: "middle", y: "18", fill: isSelected ? "#ffd166" : "#ffffff", fontSize: "10", fontWeight: "bold", style: { textShadow: "0 2px 4px #000" }, children: lm.name })] }, lm.id));
                                }), _jsxs("g", { transform: `translate(${toSvgX(pos.x)}, ${toSvgY(pos.z)})`, children: [_jsx("circle", { r: "16", fill: "rgba(230, 57, 70, 0.35)", children: _jsx("animate", { attributeName: "r", values: "8;18;8", dur: "2s", repeatCount: "indefinite" }) }), _jsx("circle", { r: "7", fill: "#e63946", stroke: "#ffffff", strokeWidth: "2" }), _jsx("text", { textAnchor: "middle", y: "-12", fill: "#ff4d6d", fontSize: "11", fontWeight: "bold", children: "YOU" })] })] }) }), _jsxs("div", { style: {
                            width: 320,
                            display: "flex",
                            flexDirection: "column",
                            gap: 12,
                        }, children: [_jsxs("div", { style: {
                                    background: "rgba(15,20,30,0.85)",
                                    border: "1px solid rgba(0,180,216,0.3)",
                                    borderRadius: 8,
                                    padding: 14,
                                }, children: [_jsx("div", { style: { fontSize: 13, fontWeight: "bold", color: "#00f0ff", marginBottom: 8 }, children: "\uD83D\uDCE1 LIVE PLAYER GEOGRAPHY" }), _jsxs("div", { style: { fontSize: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }, children: [_jsx("div", { children: "Position:" }), _jsxs("div", { style: { color: "#ffd166", fontWeight: "bold" }, children: ["(", Math.round(pos.x), "m, ", Math.round(pos.z), "m)"] }), _jsx("div", { children: "Elevation:" }), _jsxs("div", { style: { color: "#00f5d4", fontWeight: "bold" }, children: [playerSample.macroElevation.toFixed(1), "m"] }), _jsx("div", { children: "Region:" }), _jsx("div", { style: { color: "#90e0ef", fontWeight: "bold" }, children: playerSample.region.name }), _jsx("div", { children: "Climate:" }), _jsx("div", { style: { color: "#e2e8f0" }, children: playerSample.region.climate }), _jsx("div", { children: "Elevation Zone:" }), _jsx("div", { style: { color: "#e2e8f0" }, children: playerSample.elevationZone })] })] }), _jsxs("div", { style: {
                                    flex: 1,
                                    background: "rgba(15,20,30,0.85)",
                                    border: "1px solid rgba(212,175,55,0.3)",
                                    borderRadius: 8,
                                    padding: 14,
                                    overflowY: "auto",
                                }, children: [_jsx("div", { style: { fontSize: 13, fontWeight: "bold", color: "#ffd166", marginBottom: 8 }, children: "\uD83C\uDFDB\uFE0F LANDMARK INSPECTOR" }), selectedLandmark ? (_jsxs("div", { style: { fontSize: 12, lineHeight: 1.5 }, children: [_jsx("div", { style: { fontSize: 14, fontWeight: "bold", color: "#ffffff", marginBottom: 4 }, children: selectedLandmark.name }), _jsxs("div", { style: { color: "#ffd166", marginBottom: 8, textTransform: "capitalize" }, children: ["Category: ", selectedLandmark.category.replace("_", " "), " (", selectedLandmark.importance, ")"] }), _jsx("p", { style: { color: "#cbd5e1", marginBottom: 8 }, children: selectedLandmark.loreDescription }), _jsxs("div", { style: { color: "#94a3b8" }, children: ["Coordinates: (", selectedLandmark.position.x, ", ", selectedLandmark.position.z, ") | Elevation: ", selectedLandmark.elevation, "m"] })] })) : (_jsx("div", { style: { color: "#64748b", fontSize: 12, fontStyle: "italic" }, children: "Click any landmark icon on the map to inspect lore and spatial coordinates." }))] }), _jsxs("div", { style: {
                                    background: "rgba(15,20,30,0.85)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: 8,
                                    padding: 12,
                                    fontSize: 11,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 4,
                                }, children: [_jsx("div", { style: { fontWeight: "bold", color: "#e2e8f0", marginBottom: 4 }, children: "LEGEND" }), _jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [_jsx("span", { style: { width: 12, height: 4, background: "#00b4d8", borderRadius: 2 } }), "Royal Torrent River & Drainage"] }), _jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [_jsx("span", { style: { width: 12, height: 4, background: "#f4a261", borderRadius: 2 } }), "Major Travel Corridors"] }), _jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [_jsx("span", { style: { width: 8, height: 8, borderRadius: "50%", background: "#ffd166" } }), "Major Horizon Landmark"] }), _jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [_jsx("span", { style: { width: 8, height: 8, borderRadius: "50%", background: "#00f0ff" } }), "Waypoint / Sanctuary"] })] })] })] })] }));
}
//# sourceMappingURL=DebugWorldMap.js.map