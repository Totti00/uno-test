import {ServerInterface} from "./ServerInterface.ts";
import {Card, GameServer, Message, Player} from "../utils/interfaces.ts";
import {Server} from "./Server";

export class _API implements ServerInterface {
    _server: ServerInterface;
    player?: Player;

    constructor() {
        this._server = new Server();
    }

    playOnline() {
        this._server = new Server();
    }

    createServer(serverName: string): Promise<string> {
        return this._server.createServer(serverName);
    }

    emitReady(): void {
        this._server.emitReady();
    }

    getPlayer(): Player {
        return this._server.getPlayer();
    }

    getServerPlayers(): Promise<Player[]> {
        return this._server.getServerPlayers();
    }

    getServerByPlayerId(playerId: string): Promise<string> {
        return this._server.getServerByPlayerId(playerId);
    }

    getServers(): Promise<GameServer[]> {
        return this._server.getServers();
    }

    getChat(): Promise<Message[]> {
        return this._server.getChat();
    }

    joinServer(serverId: string): Promise<string> {
        return this._server.joinServer(serverId);
    }

    leaveServer(): void {
        this._server.leaveServer();
    }

    move(draw: boolean | null, cardId: string): Promise<void> {
        return this._server.move(draw, cardId);
    }

    moveSelectableColorCard(draw: boolean | null, cardId: string, colorSelected: string): Promise<void> {
        return this._server.moveSelectableColorCard(draw, cardId, colorSelected);
    }

    chat(message: Message): Promise<void>{
        return this._server.chat(message);
    }

    onFinishGame(cb: (playersOrdered: Player[]) => void): () => void {
        return this._server.onFinishGame(cb);
    }

    onGameInit(cb: (data: { players: Player[]; cards: Card[]; card: Card; nxtPlayer: number; }) => void): () => void {
        return this._server.onGameInit(cb);
    }

    onMove(cb: (data: { nxtPlayer: number; card: Card; draw?: number; cardsToDraw?: Card[] }) => void): () => void {
        return this._server.onMove(cb);
    }

    onMoveSelectableColorCard(cb: (data: { nxtPlayer: number; card: Card; draw?: number; colorSelected: string; cardsToDraw?: Card[] }) => void): () => void {
        return this._server.onMoveSelectableColorCard(cb);
    }

    onChat(cb: (data: { messages: Message[] }) => void): () => void{
        return this._server.onChat(cb);
    }

    onPlayerLeft(cb: () => void): () => void {
        return this._server.onPlayerLeft(cb);
    }

    onPlayersUpdated(cb: (players: Player[]) => void): () => void {
        return this._server.onPlayersUpdated(cb);
    }
}

const API = new _API();

export default API;