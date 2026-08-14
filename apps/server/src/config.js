// In dev, Vite may land on any free port 5173–5179; allow them all.
const DEV_ORIGINS = Array.from({ length: 20 }, (_, i) => `http://localhost:${5173 + i}`);
export const config = {
    port: parseInt(process.env.PORT || "3001", 10),
    cors: {
        origin: process.env.CORS_ORIGIN
            ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
            : DEV_ORIGINS,
    },
};
//# sourceMappingURL=config.js.map