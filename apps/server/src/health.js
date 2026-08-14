import { Router } from "express";
export function healthRouter() {
    const router = Router();
    router.get("/", (_req, res) => {
        res.json({
            status: "ok",
            service: "legend-server",
            version: "0.1.0",
            uptime: process.uptime(),
        });
    });
    return router;
}
//# sourceMappingURL=health.js.map