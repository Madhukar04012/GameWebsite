/**
 * NetworkManager — pure logic for multiplayer state.
 *
 * Manages connected players without any Socket.io or React dependency.
 * The actual Socket.io connection lives in apps/game.
 */
export interface RemotePlayerData {
    id: string;
    name: string;
    position: {
        x: number;
        y: number;
        z: number;
    };
    rotation: number;
    level: number;
}
export interface NetworkState {
    connected: boolean;
    playerId: string | null;
    players: Map<string, RemotePlayerData>;
    latency: number;
}
export declare function createNetworkState(): NetworkState;
export declare function addRemotePlayer(state: NetworkState, player: RemotePlayerData): NetworkState;
export declare function removeRemotePlayer(state: NetworkState, playerId: string): NetworkState;
export declare function updateRemotePlayerPosition(state: NetworkState, id: string, position: {
    x: number;
    y: number;
    z: number;
}, rotation: number): NetworkState;
//# sourceMappingURL=NetworkManager.d.ts.map