/**
 * NetworkManager — pure logic for multiplayer state.
 *
 * Manages connected players without any Socket.io or React dependency.
 * The actual Socket.io connection lives in apps/game.
 */

export interface RemotePlayerData {
  id: string;
  name: string;
  position: { x: number; y: number; z: number };
  rotation: number;
  level: number;
}

export interface NetworkState {
  connected: boolean;
  playerId: string | null;
  players: Map<string, RemotePlayerData>;
  latency: number;
}

export function createNetworkState(): NetworkState {
  return {
    connected: false,
    playerId: null,
    players: new Map(),
    latency: 0,
  };
}

export function addRemotePlayer(
  state: NetworkState,
  player: RemotePlayerData,
): NetworkState {
  const next = new Map(state.players);
  next.set(player.id, player);
  return { ...state, players: next };
}

export function removeRemotePlayer(
  state: NetworkState,
  playerId: string,
): NetworkState {
  const next = new Map(state.players);
  next.delete(playerId);
  return { ...state, players: next };
}

export function updateRemotePlayerPosition(
  state: NetworkState,
  id: string,
  position: { x: number; y: number; z: number },
  rotation: number,
): NetworkState {
  const player = state.players.get(id);
  if (!player) return state;

  const next = new Map(state.players);
  next.set(id, { ...player, position, rotation });
  return { ...state, players: next };
}
