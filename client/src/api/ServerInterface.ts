import {Card, GameServer, Message, Player} from "../utils/interfaces";

export interface ServerInterface {
    player?: Player;

    getServers(): Promise<GameServer[]>;
    getServerPlayers(): Promise<Player[]>;
    getServerByPlayerId(playerId: string): Promise<string>;
    createServer(serverName: string): Promise<string>;
    joinServer(serverId: string): Promise<string>;

    emitReady(): void;
    leaveServer(): void;
    move(draw: boolean | null, cardId: string): Promise<void>;
    moveSelectableColorCard(draw: boolean | null, cardId: string, colorSelected: string): Promise<void>;
    chat(message: Message): Promise<void>;
    isPlayerMaster(): Promise<boolean>;
    playAgain(): Promise<void>;
    UNO(): Promise<void>;
    PASS(): Promise<void>;

    onPlayersUpdated(cb: (players: Player[]) => void): () => void;
    onGameInit(
        cb: (data: { players: Player[]; cards: Card[]; card: Card; nxtPlayer: number; }) => void
    ): () => void;
    onMove(
        cb: (data: {
            nxtPlayer: number;
            card: Card;
            draw?: number;
            cardsToDraw?: Card[];
        }) => void
    ): () => void;
    onMoveSelectableColorCard(
        cb: (data: {
            nxtPlayer: number;
            card: Card;
            draw?: number;
            colorSelected: string;
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
    onResetTimer(cb: (moveTime: number) => void): () => void;
    onTimeOut(cb: () => void): () => void;
    onForceLeave(cb: () => void): () => void;
    onShowUNO(cb: (showButton: boolean) => void): () => void;
    onShowPassButton(cb: (showButton: boolean) => void): () => void;
    onFinalPlayerPass(cb: (nxtPlayer: number) => void): () => void;
    onDraw2Cards(cb:(data:{lastPlayer:number; cardsToDrawLast?: Card[] }) => void): () => void;

    getPlayer(): Player;
    getChat(): Promise<Message[]>;
}