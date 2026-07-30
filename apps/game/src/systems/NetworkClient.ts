import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useGameStore } from "../store/gameStore";
import { GamePhase } from "@legend/engine";
import type { RemotePlayerData } from "@legend/engine";

const SERVER_URL = "http://localhost:3001";

/** Singleton socket so non-React systems (PlayerEntity) can emit moves. */
let _socket: Socket | null = null;
export function getSocket(): Socket | null {
  return _socket;
}

interface ServerPlayer {
  id: string;
  name: string;
  position: { x: number; y: number; z: number };
  rotation: number;
  level: number;
}

function toRemote(p: ServerPlayer): RemotePlayerData {
  return {
    id: p.id,
    name: p.name,
    position: p.position,
    rotation: p.rotation,
    level: p.level,
  };
}

/**
 * NetworkClient — connects to the server during CONNECT_SERVER and syncs
 * remote players into the game store.
 */
export function NetworkClient() {
  const socketRef = useRef<Socket | null>(null);
  const phase = useGameStore((s) => s.phase);
  const setConnection = useGameStore((s) => s.setConnection);
  const setRemotePlayers = useGameStore((s) => s.setRemotePlayers);
  const upsertRemotePlayer = useGameStore((s) => s.upsertRemotePlayer);
  const removeRemotePlayer = useGameStore((s) => s.removeRemotePlayer);
  const updateRemotePlayer = useGameStore((s) => s.updateRemotePlayer);
  const playerName = useGameStore((s) => s.connection.playerName);

  useEffect(() => {
    if (phase !== GamePhase.CONNECT_SERVER) return;
    if (socketRef.current?.connected) return;

    const socket = io(SERVER_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;
    _socket = socket;

    socket.on("connect", () => {
      console.log("[Network] Connected:", socket.id);
      setConnection({ status: "connected", playerId: socket.id, error: null });
      socket.emit("player:join", { name: playerName });
    });

    socket.on("disconnect", () => {
      console.log("[Network] Disconnected");
      setConnection({ status: "disconnected", error: "Disconnected from server" });
    });

    socket.on("connect_error", (err: Error) => {
      console.error("[Network] Error:", err.message);
      setConnection({ status: "disconnected", error: err.message });
    });

    socket.on("world:state", (players: ServerPlayer[]) => {
      console.log(`[Network] World state: ${players.length} players`);
      const map: Record<string, RemotePlayerData> = {};
      for (const p of players) {
        if (p.id === socket.id) continue;
        map[p.id] = toRemote(p);
      }
      setRemotePlayers(map);
    });

    socket.on("player:joined", (player: ServerPlayer) => {
      console.log("[Network] Player joined:", player.name);
      if (player.id === socket.id) return;
      upsertRemotePlayer(toRemote(player));
    });

    socket.on("player:left", (playerId: string) => {
      console.log("[Network] Player left:", playerId);
      removeRemotePlayer(playerId);
    });

    socket.on("player:moved", (data: { id: string; position: { x: number; y: number; z: number }; rotation: number }) => {
      updateRemotePlayer(data.id, data.position, data.rotation);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      _socket = null;
    };
  }, [phase, setConnection, setRemotePlayers, upsertRemotePlayer, removeRemotePlayer, updateRemotePlayer, playerName]);

  return null;
}
