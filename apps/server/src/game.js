import { Router } from "express";
export function gameRouter() {
    const router = Router();
    /* ── Auth endpoint ── */
    router.post("/auth", (req, res) => {
        const { playerName } = req.body;
        const name = playerName?.trim() || `Player_${Math.random().toString(36).slice(2, 6)}`;
        res.json({
            playerId: `player-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            playerName: name,
            latency: 0,
        });
    });
    /* ── Server stats ── */
    router.get("/status", (_req, res) => {
        res.json({
            status: "running",
            version: "0.1.0",
            uptime: process.uptime(),
        });
    });
    return router;
}
//# sourceMappingURL=game.js.map