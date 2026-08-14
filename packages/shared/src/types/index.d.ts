export interface Position {
    x: number;
    y: number;
    z: number;
}
export interface Player {
    id: string;
    name: string;
    position: Position;
    level: number;
    hp: number;
    maxHp: number;
}
export interface Entity {
    id: string;
    type: string;
    position: Position;
    hp: number;
    maxHp: number;
}
export interface ChatMessage {
    playerId: string;
    playerName: string;
    text: string;
    timestamp: number;
}
export type GameEvent = {
    type: "player_join";
    player: Player;
} | {
    type: "player_leave";
    playerId: string;
} | {
    type: "player_move";
    playerId: string;
    position: Position;
} | {
    type: "chat";
    message: ChatMessage;
} | {
    type: "damage";
    targetId: string;
    amount: number;
} | {
    type: "heal";
    targetId: string;
    amount: number;
};
export * from "./npc";
//# sourceMappingURL=index.d.ts.map