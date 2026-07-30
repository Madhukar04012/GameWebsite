import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { config } from "./config.js";
import { healthRouter } from "./health.js";
import { gameRouter } from "./game.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: config.cors });

/* ── Middleware ── */
app.use(cors(config.cors));
app.use(express.json());

/* ── Routes ── */
app.use("/health", healthRouter());
app.use("/game", gameRouter());

/* ── In-memory player store ── */
interface PlayerData {
  id: string;
  name: string;
  position: { x: number; y: number; z: number };
  rotation: number;
  level: number;
}

const players = new Map<string, PlayerData>();

/* ── Socket.io ── */
io.on("connection", (socket) => {
  console.log(`[connect] ${socket.id}`);

  /* ── Player joins the world ── */
  socket.on("player:join", (data: { name: string }) => {
    const player: PlayerData = {
      id: socket.id,
      name: data.name || `Player_${socket.id.slice(0, 4)}`,
      position: { x: 0, y: 0, z: 3 },
      rotation: 0,
      level: 1,
    };

    players.set(socket.id, player);

    // Tell the new player about all existing players
    socket.emit("world:state", Array.from(players.values()));

    // Tell everyone else about the new player
    socket.broadcast.emit("player:joined", player);

    console.log(`[join] ${player.name} (${socket.id}) — ${players.size} online`);
  });

  /* ── Movement sync ── */
  socket.on("player:move", (data: { position: { x: number; y: number; z: number }; rotation: number }) => {
    const player = players.get(socket.id);
    if (!player) return;

    player.position = data.position;
    player.rotation = data.rotation;

    // Broadcast to all other clients
    socket.broadcast.emit("player:moved", {
      id: socket.id,
      position: data.position,
      rotation: data.rotation,
    });
  });

  /* ── Chat ── */
  socket.on("chat:send", (text: string) => {
    const player = players.get(socket.id);
    if (!player || typeof text !== "string" || text.trim().length === 0) return;

    const message = {
      id: `${socket.id}-${Date.now()}`,
      playerId: socket.id,
      playerName: player.name,
      text: text.trim().slice(0, 200),
      timestamp: Date.now(),
    };

    io.emit("chat:message", message);
  });

  /* ── Disconnect ── */
  socket.on("disconnect", () => {
    const player = players.get(socket.id);
    if (player) {
      io.emit("player:left", socket.id);
      players.delete(socket.id);
      console.log(`[leave] ${player.name} — ${players.size} online`);
    }
  });
});

/* ── Start ── */
httpServer.listen(config.port, () => {
  console.log(`⚔️  LEGEND server listening on port ${config.port}`);
});
