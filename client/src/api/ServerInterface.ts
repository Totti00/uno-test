import {Card, GameServer, Message, Player} from "../utils/interfaces.ts";

export interface ServerInterface {
    player?: Player;

    getServers(): Promise<GameServer[]>;
    getServerPlayers(): Promise<Player[]>;
    getServerByPlayerId(playerName: string): Promise<string>;
    createServer(serverName: string): Promise<string>;
    joinServer(serverId: string): Promise<string>;

    emitReady(): void;
    leaveServer(): void;
    move(draw: boolean | null, cardId: string): Promise<void>;
    chat(message: Message): Promise<void>;

    onPlayersUpdated(cb: (players: Player[]) => void): () => void;
    onGameInit(
        cb: (data: { players: Player[]; cards: Card[] }) => void
    ): () => void;
    onMove(
        cb: (data: {
            nxtPlayer: number;
            card: Card;
            draw?: number;
            cardsToDraw?: Card[];
        }) => void
    ): () => void;
    onChat(
        cb: (data: {
            messages: Message[];
        }) => void
    ): () => void;
    onPlayerLeft(cb: () => void): () => void;
    onFinishGame(cb: (playersOrdered: Player[]) => void): () => void;

    getPlayer(): Player;
    getChat(): Promise<Message[]>;
}