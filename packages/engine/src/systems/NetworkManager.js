/**
 * NetworkManager — pure logic for multiplayer state.
 *
 * Manages connected players without any Socket.io or React dependency.
 * The actual Socket.io connection lives in apps/game.
 */
export function createNetworkState() {
    return {
        connected: false,
        playerId: null,
        players: new Map(),
        latency: 0,
    };
}
export function addRemotePlayer(state, player) {
    const next = new Map(state.players);
    next.set(player.id, player);
    return { ...state, players: next };
}
export function removeRemotePlayer(state, playerId) {
    const next = new Map(state.players);
    next.delete(playerId);
    return { ...state, players: next };
}
export function updateRemotePlayerPosition(state, id, position, rotation) {
    const player = state.players.get(id);
    if (!player)
        return state;
    const next = new Map(state.players);
    next.set(id, { ...player, position, rotation });
    return { ...state, players: next };
}
//# sourceMappingURL=NetworkManager.js.map