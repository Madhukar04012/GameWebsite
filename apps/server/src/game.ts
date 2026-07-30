import { Router, Request, Response } from "express";

interface AuthBody {
  playerName?: string;
}

export function gameRouter() {
  const router = Router();

  /* ── Auth endpoint ── */
  router.post("/auth", (req: Request, res: Response) => {
    const { playerName } = req.body as AuthBody;

    const name = playerName?.trim() || `Player_${Math.random().toString(36).slice(2, 6)}`;

    res.json({
      playerId: `player-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      playerName: name,
      latency: 0,
    });
  });

  /* ── Server stats ── */
  router.get("/status", (_req: Request, res: Response) => {
    res.json({
      status: "running",
      version: "0.1.0",
      uptime: process.uptime(),
    });
  });

  return router;
}
